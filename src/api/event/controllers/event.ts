"use strict";

import { factories } from "@strapi/strapi";
import { convertToDataAndTotal, findMyEvents } from "./helpers";
import { GigEvent } from "../../types";

export default factories.createCoreController("api::event.event", {
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return convertToDataAndTotal(data, meta);
  },

  async create(ctx) {
    // Calling the default core action
    const { data, meta } = await super.create(ctx);
    const newEvent: GigEvent = await strapi.entityService.findOne(
      "api::event.event",
      data.id,
      {
        populate: "*",
      }
    );

    const admins = await strapi.entityService.findMany("api::admin.admin");

    const adminIDs: { id: number }[] = admins.map((admin) => {
      return { id: admin.id };
    });

    try {
      // Create chatroom for client and Admin
      await strapi.entityService.create("api::client-chat.client-chat", {
        data: {
          client: {
            set: [{ id: newEvent.client.id }],
          },
          admin_users: {
            set: adminIDs,
          },
          messages: null,
        },
      });
    } catch (error) {
      //delete event created to prevent events being created without a chat room
      await strapi.entityService.delete("api::event.event", data);
      ctx.res.send(500, "Event cannot be created, please try again");
    }

    // TODO - create chatroom for musicians and admin

    // TODO - create chatroom for client and admin

    return { data, meta };
  },

  async mine(ctx) {
    const events = await findMyEvents(ctx);
    events.forEach((event) => {
      delete event.profit;
      delete event.notes;
      delete event.googleDocId;
    });

    console.log("FOUND EVENTS: ", events);
    return events[0];
  },

  async count(ctx) {
    try {
      const { data, meta } = await super.find(ctx);
      return convertToDataAndTotal(data, meta);
    } catch (e) {
      ctx.body = e;
      return;
    }
  },

  async delete(ctx) {
    const { request } = ctx;
    const { url } = request;
    const eventID = url.split("/").pop();

    const jobs = await strapi.entityService.findMany("api::job.job", {
      populate: {
        event: true,
      },
      filters: {
        event: {
          id: {
            $eq: eventID,
          },
        },
      },
    });

    console.log(
      `Before deleting event ${eventID}, need to delete related jobs. Jobs to delete`,
      jobs
    );

    jobs.forEach(async (job) => {
      const deletedJob = await strapi.entityService.delete(
        "api::job.job",
        job.id
      );
      console.log("deleted job: ", deletedJob);
    });

    const { data: deletedEvent } = await super.delete(ctx);

    return deletedEvent;
  },
  async updatePayment(ctx) {
    const { request } = ctx;
    console.log("REQUEST: ", request);
    const usersEvents = await findMyEvents(ctx);
    console.log("UPDATE PAYMENT", ctx);
    const { data } = request;
    const { user } = ctx.state;

    console.log("req: ", JSON.parse(ctx.req.body));

    //get event ID from url or body

    //get previous event payments

    //append new payment to previous payments JSON

    //update the event payments

    //return the new JSON for this events payment

    // const entry = await strapi.entityService.update("api::article.article", 1, {
    //   data: {
    //     payments: "xxx",
    //   },
    // });
  },
});
