"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/webhooks/braintree/disbursement",
      handler: "webhook.braintreeDisbursement",
    },
  ],
};
