export default {
  lockClientEditingForUpcomingEvents: {
    task: async ({ strapi }) => {
      try {
        console.log("RUNNING CRON JOB: lockClientEditingForUpcomingEvents ");
        const [{ value }] = await strapi.entityService.findMany(
          "api::cron.cron",
          {
            fields: ["value"],
            filters: {
              rule: "clientEditLockThresholdInDays",
            },
          }
        );

        console.log("DAYS: ", value);

        const now = new Date();
        const lockThresholdAsDate = new Date(
          new Date().setDate(now.getDate() + parseInt(value))
        );

        console.log(
          "AS DATE: ",
          lockThresholdAsDate.toISOString().split("T")[0]
        );

        await strapi.db.query("api::event.event").updateMany({
          where: {
            date: {
              $lt: lockThresholdAsDate.toISOString().split("T")[0],
            },
          },
          data: {
            clientCanEdit: false,
          },
        });

        console.log(
          "lockClientEditingForUpcomingEvents - COMPLETE SUCCESSFULLY"
        );
      } catch (e) {
        console.error(
          "Error in CRON JOB: lockClientEditingForUpcomingEvents: ",
          e
        );
      }
    },

    options: {
      rule: "*/1 * * * *",
    },
  },
};
