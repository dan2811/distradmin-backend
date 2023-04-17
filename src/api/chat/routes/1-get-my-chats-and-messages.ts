"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/chats/mine",
      handler: "chat.mine",
    },
  ],
};
