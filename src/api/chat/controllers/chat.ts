/**
 * chat controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::chat.chat", {
  async mine(ctx) {
    const { id: userId } = await strapi.plugins[
      "users-permissions"
    ].services.jwt.getToken(ctx);
    const chats = await strapi.entityService.findMany("api::chat.chat", {
      populate: {
        messages: {
          populate: {
            id: true,
            sender: true,
            chat: true,
          },
        },
      },
      filters: {
        users_permissions_users: {
          id: {
            $eq: userId,
          },
        },
      },
    });

    return chats;
  },
  async unread(ctx) {
    const { id: userId } = await strapi.plugins[
      "users-permissions"
    ].services.jwt.getToken(ctx);

    const { chatId } = ctx.params;

    const allMessages = await strapi.entityService.findMany(
      "api::message.message",
      {
        filters: {
          chat: {
            id: chatId,
          },
        },
        populate: "*",
        fields: ["*"],
      }
    );
    console.log("allMessages: ", allMessages);
    const messagesFromOtherUsers = allMessages.filter(
      (message) => message.sender.id !== userId
    );

    if (!messagesFromOtherUsers) {
      return [];
    }

    let unreadMessages = [];
    for (let i = 0; i < messagesFromOtherUsers.length; i++) {
      const usersThatHaveReadCurrentMessage = messagesFromOtherUsers[i].hasRead;

      if (!usersThatHaveReadCurrentMessage) {
        unreadMessages.push(messagesFromOtherUsers[i]);
        continue;
      }

      const userHasReadMessage = usersThatHaveReadCurrentMessage.find(
        (user: any) => {
          console.log("This should be false!", user.id === userId);
          return user.id === userId;
        }
      );

      if (!userHasReadMessage) {
        unreadMessages.push(messagesFromOtherUsers[i]);
        continue;
      } else {
        break;
      }
    }
    return unreadMessages;
  },
});
