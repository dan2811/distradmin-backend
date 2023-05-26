"use strict";

module.exports = {
  routes: [
    {
      // Path defined with a URL parameter
      method: "GET",
      path: "/chats/unread/:chatId",
      handler: "chat.unread",
    },
  ],
};
