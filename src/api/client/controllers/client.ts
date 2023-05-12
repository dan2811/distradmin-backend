"use strict";

import { factories } from "@strapi/strapi";
import { UserRole } from "../../types";
import { createUser } from "../../lib/createUser";

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
    const user = await createUser(ctx, "client");
    console.log("THIS SHOULD BE JSON", ctx.request.body);
    const { fName, lName, phone } = JSON.parse(ctx.request.body);
    const createdUser = await strapi.entityService.create(
      `api::client.client`,
      {
        data: {
          fName,
          lName,
          phone,
          users_permissions_user: {
            connect: [user.id],
          },
        },
      }
    );

    return createdUser;
  },
  async update(ctx) {
    const {
      email,
      newAccountPassword,
      fName,
      lName,
      phone,
      id: clientId,
    } = ctx.request.body;

    try {
      await strapi.plugins["users-permissions"].services.user.edit(clientId, {
        email,
        newAccountPassword,
      });
      await strapi.entityService.update("api::client.client", clientId, {
        data: {
          fName,
          lName,
          phone,
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
});

const convertToDataAndTotal = (data, meta) => {
  return { data, total: meta.pagination.total };
};
