import server from "../../config/server";

export const getRequests = async (body) => {
  const res = await server.post("/eplan/support/requests/search", body);
  return res;
};

export const getRequestDetails = async (requestType, requestId) => {
  const res = await server.get(
    `/eplan/support/requests/${requestType}/${requestId}`
  );
  return res;
};

export const getRequestComments = async (requestId) => {
  const res = await server.get(`/eplan/support/requests/${requestId}/comments`);
  return res;
};

export const getRequestAttachments = async (requestId) => {
  const res = await server.get(
    `/eplan/support/requests/${requestId}/attachments`
  );
  return res;
};

export const getRequestAttachmentsDownload = async (requestId) => {
  const res = await server.get(
    `/eplan/support/attachments/${requestId}/download`
  );
  return res;
};

export const getRequestPreview = async (requestId) => {
  const res = await server.get(
    `/eplan/support/attachments/${requestId}/preview`
  );

  return res;
};

export const getRequestCount = async () => {
  const res = await server.get("/eplan/support/requests/count");
  return res;
};

export const getRequestDownload = async (type, body) => {
  const res = await server.post(
    `/eplan/support/requests/download/${type}`,
    body
  );
  return res;
};

export const getSearchResults = async (body) => {
  const res = await server.post("/eplan/support/smartsearch", body);
  return res;
};

export const createRequest = async (body) => {
  const res = await server.post("/eplan/support/requests", body);
  return res;
};

export const uploadAttachments = async (files) => {
  const res = await server.post(
    `/eplan/support/requests/attachments`,

    files,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(res);
  return res;
};
export const cancelRequest = async (requestId, CancelStatus) => {
  const res = await server.patch(
    `/eplan/support/requests/${requestId}/cancel`,
    {
      status: CancelStatus,
    }
  );
};

export const getRequestTypeSubType = async (params) => {
  const res = await server.get("/eplan/support/requests/request-types");
  return res;
};

export const getDrivers = async (params) => {
  const res = await server.get("/eplan/drivers/smartSearch", {
    params,
  });
  return res;
};

export const getVehicles = async (params) => {
  const res = await server.get("/eplan/vehicles/smartSearch", {
    params,
  });
  return res;
};

export const addComments = async (Id, body) => {
  const res = await server.post(`/eplan/support/requests/${Id}/comments`, body);
  return res;
};

export const deleteAttachment = async (body) => {
  const res = await server.delete(`/eplan/support/requests/attachments`, {
    data: body,
  });

  return res;
};
