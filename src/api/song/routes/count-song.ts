"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/songs/count",
      handler: "song.count",
    },
  ],
};
