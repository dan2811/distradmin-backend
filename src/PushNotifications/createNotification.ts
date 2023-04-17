const fetch = require("node-fetch");
const optionsBuilder = (method, path, body) => {
  return {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${process.env.ONE_SIGNAL_API_KEY}`,
    },
    body: body ? JSON.stringify(body) : null,
  };
};

export const createNotification = async (data) => {
  const method = "POST";
  const path = "/notifications";
  const body = data;
  try {
    const response = await fetch(
      `${process.env.ONE_SIGNAL_BASE_URL}${path}`,
      optionsBuilder(method, path, body)
    );
    return response.json();
  } catch (e) {
    console.error("ERROR IN createNotification", e);
  }
};
