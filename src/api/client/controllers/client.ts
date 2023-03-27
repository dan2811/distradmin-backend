"use strict";

import { factories } from "@strapi/strapi";
import { UserRole } from "../../types";

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

    console.log(
      `Admin with ID: ${adminId} is creating a new client called ${fName} ${lName} with email: ${email}`
    );

    try {
      const allRoles: UserRole[] = await strapi.plugins[
        "users-permissions"
      ].services.role.find();

      const clientRole: UserRole = allRoles.find(
        (role) => role.name === "client"
      );

      const user = await strapi.plugins["users-permissions"].services.user.add({
        blocked: false,
        confirmed: true,
        username: email,
        email,
        password,
        provider: "local",
        created_by: adminId,
        updated_by: adminId,
        role: clientRole.id,
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

      return client;
    } catch (err) {
      console.log(JSON.stringify(err));
      const { name, message, details } = err;
      if (name === "ValidationError") {
        return ctx.badRequest(message, details);
      }
    }
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
