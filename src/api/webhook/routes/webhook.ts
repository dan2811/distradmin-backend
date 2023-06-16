"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "POST",
      path: "/webhooks/braintree/disbursement",
      handler: "webhook.braintreeDisbursement",
    },
  ],
};
