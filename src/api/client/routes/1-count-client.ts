"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/clients/count",
      handler: "client.count",
    },
  ],
};
