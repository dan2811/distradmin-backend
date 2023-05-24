"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/crons/count",
      handler: "cron.count",
    },
  ],
};
