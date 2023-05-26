export const findMyEvents = async (ctx) => {
  const { id: userId } = await strapi.plugins[
    "users-permissions"
  ].services.jwt.getToken(ctx);

  console.log("ID: ", userId);

  const clientArray = await strapi.entityService.findMany(
    "api::client.client",
    {
      filters: {
        users_permissions_user: {
          id: userId,
        },
      },
    }
  );

  if (clientArray.length > 1) {
    return 500;
  }

  console.log("client array: ", clientArray);
  const client = clientArray[0];

  const clientEvents = await strapi.entityService.findMany("api::event.event", {
    populate: "*",
    filters: {
      client: {
        id: client.id,
      },
    },
  });

  return clientEvents;
};

export const convertToDataAndTotal = (data, meta) => {
  return { data, total: meta.pagination.total };
};
