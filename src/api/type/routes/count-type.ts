"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/types/count",
      handler: "type.count",
    },
  ],
};
