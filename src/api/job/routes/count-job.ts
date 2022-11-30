"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/jobs/count",
      handler: "job.count",
    },
  ],
};
