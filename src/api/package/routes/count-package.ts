"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/packages/count",
      handler: "package.count",
    },
  ],
};
