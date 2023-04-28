export const saveMessageToClientChat = async (
  user,
  message,
  strapi,
  roomId
) => {
  //TODO check user's jwt to make sure they have access to this chatRoom
  const newMessage = await strapi.entityService.create("api::message.message", {
    populate: "*",
    data: {
      content: message,
      sender: {
        connect: user.data.user.id,
      },
      chat: {
        connect: roomId,
      },
    },
  });
  return newMessage;
};

export const getUsersInChat = async (strapi, chatId: number) => {
  const chat = await strapi.entityService.findOne("api::chat.chat", chatId, {
    populate: { users_permissions_users: true },
  });
  console.log("CURRENT CHAT: ", chat);
  return chat.users_permissions_users;
};

export const removeUserFromArray = (id: number, users: { id: number }[]) => {
  return users.filter((user) => user.id !== id);
};

export const markMessageAsRead = async (userId, messageId) => {
  console.log("mark messge read inputs", messageId, userId);
  const message = await strapi.entityService.findOne(
    "api::message.message",
    messageId,
    { populate: "*" }
  );

  try {
    const updatedResults = await strapi.entityService.update(
      "api::message.message",
      messageId,
      {
        data: {
          hasRead: [...message.hasRead.map((message) => message.id), userId],
        },
      }
    );

    console.log(`user ${userId} has read `, updatedResults);
  } catch (e) {
    console.error("error updating message read: ", e);
  }
};
