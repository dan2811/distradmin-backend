"use strict";

import { factories } from '@strapi/strapi';

export default factories.createCoreController("api::admin.admin", {
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
  async check(ctx) {
    const [endpoint, userEmail] = ctx.url.split("email=");
    try {
      interface admins {
        results: [{ email: string, isAdmin: boolean; }],
        pagination: object;
      }
      const admins: admins = await strapi.service("api::admin.admin").find({ fields: ["email", "isAdmin"] }) as admins;
      if (admins.results.find((admin) => {
        return admin.email === userEmail && admin.isAdmin === true;
      })) {
        return true;
      }
    } catch (e) {
      ctx.body = e;
      return;
    }
  }
});


const convertToDataAndTotal = (data, meta) => {
  return { data, total: meta.pagination.total };
};