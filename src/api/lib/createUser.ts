import { UserRole } from "../types";

export const createUser = async (ctx, roleToCreate: "Musician" | "Client") => {
  const { email, password, fName, lName, phone } = ctx.request.body.data;

  const { id: adminId } = ctx.state.user;

  console.log(
    `Admin with ID: ${adminId} is creating a new ${roleToCreate} called ${fName} ${lName}`
  );
  console.table({ fName, lName, phone, email });

  try {
    const allRoles: UserRole[] = await strapi.plugins[
      "users-permissions"
    ].services.role.find();

    const role: UserRole = allRoles.find((role) => role.name === roleToCreate);

    const user = await strapi.plugins["users-permissions"].services.user.add({
      blocked: false,
      confirmed: true,
      fName,
      lName,
      username: `${fName} ${lName}`,
      email,
      password,
      provider: "local",
      created_by: adminId,
      updated_by: adminId,
      role: role.id,
    });

    return user;
  } catch (err) {
    console.log(JSON.stringify(err));
    const { name, message, details } = err;
    if (name === "ValidationError") {
      return ctx.badRequest(message, details);
    }
  }
};
