import server from "../../config/server";

export const login = async (user) => {
  const res = await server.post("/eplan/login", user);
  return res;
};

export const validateToken = async (token) => {
  const res = await server.get("/eplan/token", {
    headers: { Authorization: token },
  });
  return res;
};

export const getNewSession = async (token, refreshToken) => {
  console.log("*********************************** Generating New Session ****************************************************");
  const res = await server.get(`eplan/token?refresh_token=${refreshToken}`, {
    headers: { Authorization: token }
  });
  return res;
};