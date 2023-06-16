"use strict";

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::webhook.webhook", {
  async braintreeDisbursement(ctx) {
    console.log("BRAINTREE DISBURSEMENT WEBHOOK", ctx);
    return "success";
  },
});
