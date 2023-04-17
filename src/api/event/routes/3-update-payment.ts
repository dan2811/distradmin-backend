"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "PUT",
      path: "/events/update-payment",
      handler: "event.updatePayment",
    },
  ],
};
