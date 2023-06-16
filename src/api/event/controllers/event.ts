"use strict";

import { factories } from "@strapi/strapi";
import {
  convertToDataAndTotal,
  createNewBraintreeCustomer,
  findMyEvents,
  getBraintreeGateway,
  getNewBraintreeToken,
  getUser,
  saveTransactionToEvent,
} from "./helpers";
import { GigEvent } from "../../types";
import { getUserByClientId } from "../../lib/getUser";

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

    const clientUserId = await getUserByClientId(newEvent.client.id);

    console.log("CLIENT USER ID: ", clientUserId);
    console.log("ADMIN ID: ", ctx.state.user.id);

    try {
      // Create chatroom for client and Admin
      await strapi.entityService.create("api::chat.chat", {
        data: {
          event: newEvent.id,
          users_permissions_users: [ctx.state.user.id, clientUserId],
          name: "Chat",
          isClientChat: true,
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
  async update(ctx) {
    console.log(ctx);
    const res = await super.update(ctx);
    console.log("UPDATE EVENT RESULT: ", res);
    const { payments, gross } = res.data.attributes;
    const totalPaid = payments.reduce(
      (accumulator, payment) =>
        parseInt(accumulator) + parseInt(payment.amount),
      0
    );
    const result = await strapi.entityService.update(
      "api::event.event",
      res.data.id,
      {
        data: {
          amountDue: gross - totalPaid,
        },
      }
    );

    console.log("UPDATE AMOUNT DUE RES: ", result);

    return res;
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
  async paypalWebhook(ctx) {
    console.log("PAYPAL WEBHOOK FULL CTX: ", ctx);
    const raw = ctx.request.body[Symbol.for("unparsedBody")];
    console.log("BODY: ", raw);

    const { request } = ctx;
    console.log("REQUEST: ", request);
    const usersEvents = await findMyEvents(ctx);
    console.log("UPDATE PAYMENT", ctx);
    const { data } = request;
    const { user } = ctx.state;

    console.log("req: ", JSON.parse(ctx.req.body));

    // get event ID from url or body

    // get previous event payments

    // append new payment to previous payments JSON

    // update the event payments

    // return the new JSON for this events payment

    const entry = await strapi.entityService.update("api::article.article", 1, {
      data: {
        payments: "xxx",
      },
    });

    const body = {
      id: "WH-7Y7254563A4550640-11V2185806837105M",
      event_version: "1.0",
      create_time: "2015-02-17T18:51:33Z",
      resource_type: "capture",
      resource_version: "2.0",
      event_type: "PAYMENT.CAPTURE.COMPLETED",
      summary: "Payment completed for $ 57.0 USD",
      resource: {
        id: "42311647XV020574X",
        amount: { currency_code: "USD", value: "57.00" },
        final_capture: true,
        seller_protection: {
          status: "ELIGIBLE",
          dispute_categories: ["ITEM_NOT_RECEIVED", "UNAUTHORIZED_TRANSACTION"],
        },
        disbursement_mode: "DELAYED",
        seller_receivable_breakdown: {
          gross_amount: { currency_code: "USD", value: "57.00" },
          paypal_fee: { currency_code: "USD", value: "2.48" },
          platform_fees: [
            {
              amount: { currency_code: "USD", value: "5.13" },
              payee: { merchant_id: "CDD7K6247RPCC" },
            },
          ],
          net_amount: { currency_code: "USD", value: "49.39" },
        },
        invoice_id: "3942619:fdv09c49-a3g6-4cbf-1358-f6d241dacea2",
        custom_id: "d93e4fcb-d3af-137c-82fe-1a8101f1ad11",
        status: "COMPLETED",
        supplementary_data: { related_ids: { order_id: "8U481631H66031715" } },
        create_time: "2022-08-26T18:29:50Z",
        update_time: "2022-08-26T18:29:50Z",
        links: [
          {
            href: "https://api.paypal.com/v2/payments/captures/0KG12345VG343800K",
            rel: "self",
            method: "GET",
          },
          {
            href: "https://api.paypal.com/v2/payments/captures/0KG12345VG343880K/refund",
            rel: "refund",
            method: "POST",
          },
          {
            href: "https://api.paypal.com/v2/checkout/orders/8U481631H66031715",
            rel: "up",
            method: "GET",
          },
        ],
      },
      links: [
        {
          href: "https://api.paypal.com/v1/notifications/webhooks-events/WH-7Y7254563A4550640-11V2185806837105M",
          rel: "self",
          method: "GET",
        },
        {
          href: "https://api.paypal.com/v1/notifications/webhooks-events/WH-7Y7254563A4550640-11V2185806837105M/resend",
          rel: "resend",
          method: "POST",
        },
      ],
    };
  },
  async paymentToken(ctx) {
    const { braintreeId } = await getUser(ctx);
    const gateway = getBraintreeGateway();

    if (!braintreeId) {
      const braintreeCustomer = await createNewBraintreeCustomer(gateway, ctx);
      return await getNewBraintreeToken(gateway, braintreeCustomer.id);
    }
    return await getNewBraintreeToken(gateway, braintreeId);
  },
  async paymentCheckout(ctx) {
    const { payment_method_nonce, deviceData, amount } = ctx.request.body;
    const raw = ctx.request.body[Symbol.for("unparsedBody")];
    console.log("BODY: ", raw);
    let res;

    const gateway = getBraintreeGateway();

    gateway.transaction.sale(
      {
        amount: amount,
        paymentMethodNonce: payment_method_nonce,
        deviceData,
        options: {
          submitForSettlement: true,
        },
      },
      (err, result) => {
        if (result.success) {
          saveTransactionToEvent(ctx, result);
          res = result;
        }
        console.log("RESULT: ", result);
        console.log("error: ", err);
        throw new Error(err);
      }
    );

    return res;
  },
});
