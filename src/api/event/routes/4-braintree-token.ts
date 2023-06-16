"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/events/braintree-token",
      handler: "event.braintreeToken",
    },
  ],
};
