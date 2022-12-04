"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/sets/count",
      handler: "set.count",
    },
  ],
};
