import server from "../../config/server";

export const getUserDetails = async () => {
  const res = await server.get("/eplan/user");
  return res;
};
