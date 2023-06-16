const braintree = require("braintree");

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

export const saveBraintreeIdToUserModel = async (ctx, braintreeId) => {
  const { id: userId } = await strapi.plugins[
    "users-permissions"
  ].services.jwt.getToken(ctx);

  const savedUser = await strapi.entityService.update(
    "plugin::users-permissions.user",
    userId,
    {
      data: {
        braintreeId,
      },
    }
  );

  return savedUser;
};

export const getUser = async (ctx) => {
  const { id: userId } = await strapi.plugins[
    "users-permissions"
  ].services.jwt.getToken(ctx);

  const user = await strapi.entityService.findOne(
    "plugin::users-permissions.user",
    userId
  );

  return user;
};

export const getNewBraintreeToken = async (gateway, customerId) => {
  const clientToken = await gateway.clientToken.generate({
    customerId,
  });

  return clientToken;
};

export const createNewBraintreeCustomer = async (gateway, ctx) => {
  const { fName, lName, email } = ctx.state.user;

  const customer = await gateway.customer.create({
    firstName: fName,
    lastName: lName,
    email: email,
  });

  await saveBraintreeIdToUserModel(ctx, customer.customer.id);

  return customer;
};

export const getBraintreeGateway = () => {
  return new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });
};
