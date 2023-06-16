"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "POST",
      path: "/events/payment-checkout",
      handler: "event.paymentCheckout",
    },
  ],
};
