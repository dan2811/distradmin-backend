"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/event-types/count",
      handler: "event-type.count",
    },
  ],
};
