"use strict";

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::event.event", {
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return convertToDataAndTotal(data, meta);
  },

  async mine(ctx) {
    const { id: userId } = await strapi.plugins[
      "users-permissions"
    ].services.jwt.getToken(ctx);

    const client = await strapi.entityService.findMany("api::client.client", {
      populate: "*",
      filters: {
        users_permissions_user: {
          id: {
            $eq: userId,
          },
        },
      },
    });

    const event = client[0].event;
    delete event.profit;
    delete event.notes;
    delete event.googleDocId;

    return event;
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
});

const convertToDataAndTotal = (data, meta) => {
  return { data, total: meta.pagination.total };
};
