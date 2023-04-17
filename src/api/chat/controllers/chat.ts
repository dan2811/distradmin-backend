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
});
