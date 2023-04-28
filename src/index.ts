import { createNotification } from "./PushNotifications/createNotification";
import {
  getUsersInChat,
  markMessageAsRead,
  removeUserFromArray,
  saveMessageToClientChat,
} from "./chatHelpers";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    var io = require("socket.io")(strapi.server.httpServer, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", function (socket) {
      console.debug("Socket connection established", socket);
      socket.on("join", ({ user, roomId }) => {
        socket.join(`room-${roomId}`);
        console.log(`${user} joined room ${roomId}`);
      });

      socket.on("clientMessage", async ({ user, message, roomId }) => {
        console.log("server received new client messsage: ", {
          user,
          message,
          roomId,
        });

        try {
          const newMessage = await saveMessageToClientChat(
            user,
            message,
            strapi,
            roomId
          );

          console.log("NEW MESSAGE IS CONSTRUCTED: ", newMessage);

          const { chat } = newMessage;
          const users = await getUsersInChat(strapi, chat.id);
          const usersToSendTo = removeUserFromArray(user.id, users);

          if (usersToSendTo.length > 1) {
            console.log(
              `USERS TO RECEIVE PUSH NOTIF: ${chat.id}: `,
              usersToSendTo
            );

            const notification = {
              app_id: process.env.ONE_SIGNAL_APP_ID,
              include_external_user_ids: usersToSendTo.map((recipient) => {
                if (recipient.id !== user.data.user.id) {
                  return `${recipient.id}`;
                }
              }),
              contents: {
                en: message,
              },
              name: "CHATS",
              headings: {
                en: `${user.data.user.email}`,
              },
            };

            console.log("NOTIFICATION: ", notification);

            const result = await createNotification(notification);

            console.log("ONE SIGNAL RESULT: ", result);
          }

          io.to(`room-${roomId}`).emit("newMessage", newMessage);
        } catch (e) {
          console.error(
            `Error saving chat message: `,
            { user: user.email, message, roomId },
            e
          );
        }
      });

      socket.on("messageRead", async ({ userId, messageId }) => {
        console.log("messageRead event received", { userId, messageId });
        try {
          markMessageAsRead(userId, messageId);
        } catch (e) {
          console.error("COULD NOT MARK MESSAGE AS READ", {
            userIdThatReadMessage: userId,
            messageId,
          });
        }
      });
    });
  },
};
