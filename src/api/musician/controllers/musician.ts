"use strict";

import { factories } from "@strapi/strapi";
import { createUser } from "../../lib/createUser";

export default factories.createCoreController("api::musician.musician", {
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
    const data = ctx.request.body.data;
    const user = await createUser(ctx, "Musician", data);
    const { fName, lName, phone, instruments, location, notes, canMD } = data;
    const instrumentIds = instruments.map((instr) => instr.id);

    try {
      const createdUser = await strapi.entityService.create(
        `api::musician.musician`,
        {
          data: {
            fName,
            lName,
            instruments: {
              connect: [...instrumentIds],
            },
            location,
            notes,
            canMD,
            phone,
            users_permissions_user: {
              connect: [parseInt(user.id)],
            },
          },
        }
      );
      return createdUser;
    } catch (e) {
      console.log("Error creating the musician: ", e);
      return ctx.badRequest("Could not create Musician", e);
    }
  },
  async delete(ctx) {
    //delete the jobs related to the musician to prevent orphaned jobs
    const { request } = ctx;
    const { url } = request;
    const musicianId = url.split("/").pop();

    const jobs = await strapi.entityService.findMany("api::job.job", {
      populate: {
        musician: true,
      },
      filters: {
        musician: {
          id: {
            $eq: musicianId,
          },
        },
      },
    });

    console.log(
      `Before deleting musician ${musicianId}, need to delete related jobs. Jobs to delete`,
      jobs
    );

    jobs.forEach(async (job) => {
      const deletedJob = await strapi.entityService.delete(
        "api::job.job",
        job.id
      );
      console.log("deleted job: ", deletedJob);
    });
    //delete the musician
    const response = await super.delete(ctx);
    return response;
  },
});

const convertToDataAndTotal = (data, meta) => {
  return { data, total: meta.pagination.total };
};
