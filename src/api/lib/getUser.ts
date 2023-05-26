export const getUserByClientId = async (clientId): Promise<number> => {
  const client: {
    users_permissions_user: {
      id: number;
    };
  } = await strapi.entityService.findOne("api::client.client", clientId, {
    populate: { users_permissions_user: true },
  });
  console.log("This should have users_perm", client);
  if (!client) {
    throw new Error(`Problem getting the user ID of client: ${clientId}`);
  }
  return client.users_permissions_user.id;
};
