"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/chats/count",
      handler: "chat.count",
    },
  ],
};
