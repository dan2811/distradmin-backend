"use strict";

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::client.client", {
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return convertToDataAndTotal(data, meta);
  },
  async count(ctx) {
    try {
      const { data, meta } = await super.find(ctx);
      return convertToDataAndTotal(data, meta);
    } catch (e) {
      ctx.body = e;
      return;
    }
  },
  async create(ctx) {
    const { email, password, fName, lName, phone } = JSON.parse(
      ctx.request.body
    );
    const { id: adminId } = ctx.state.user;

    console.log("adminId", adminId);

    try {
      const user = await strapi.plugins["users-permissions"].services.user.add({
        blocked: false,
        confirmed: true,
        username: email,
        email,
        password,
        provider: "local",
        created_by: adminId,
        updated_by: adminId,
        role: 3,
      });

      const client = await strapi.entityService.create("api::client.client", {
        data: {
          fName,
          lName,
          phone,
          users_permissions_user: {
            connect: [user.id],
          },
        },
      });

      console.log("CLIENT: ", client);

      return client;
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },
});

const convertToDataAndTotal = (data, meta) => {
  return { data, total: meta.pagination.total };
};
