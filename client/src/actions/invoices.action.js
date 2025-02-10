import {
  dispatchError,
  dispatchStopLoading,
  dispatchStartLoading,
  dispatchSuccess,
} from "./notifications.action";

export const getInvoices = async (
  startIndex,
  limit,
  filters,
  success
) => {
  dispatchStartLoading();
  await fetch(
    `/api/invoice/get?startIndex=${startIndex}&limit=${limit}${setSearchFilters(
      filters
    )}`
  )
    .then((res) => res.json())
    .then((payload) => {
      if (!payload.success) {
        dispatchError(payload.message);
        return;
      }
      dispatchStopLoading();
      success(payload.data);
    })
    .catch((error) => {
      dispatchError(error.message);
    });
};

export const getInvoice = async (invoiceId, success) => {
  dispatchStartLoading();
  await fetch(`/api/invoice/get/${invoiceId}`)
    .then((res) => res.json())
    .then((payload) => {
      if (!payload.success) {
        dispatchError(payload.message);
        return;
      }
      dispatchStopLoading();
      success(payload.data);
    })
    .catch((error) => {
      dispatchError(error.message);
    });
};

export const addInvoice = async (newInvoice, success) => {
  dispatchStartLoading();
  await fetch("/api/invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newInvoice),
  })
    .then((res) => res.json())
    .then((payload) => {
      if (!payload.success) {
        dispatchError(payload.message);
        return;
      }
      success();
      dispatchSuccess(payload.message);
    })
    .catch((error) => {
      dispatchError(error.message);
    });
};

export const updateInvoice = async (
  updatedInvoice,
  invoiceId,
  success
) => {
  dispatchStartLoading();
  await fetch(`/api/invoice/${invoiceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedInvoice),
  })
    .then((res) => res.json())
    .then((payload) => {
      if (!payload.success) {
        dispatchError(payload.message);
        return;
      }
      success();
      dispatchSuccess(payload.message);
    })
    .catch((error) => {
      dispatchError(error.message);
    });
};

export const deleteInvoice = async (invoiceId, success) => {
  dispatchStartLoading();
  await fetch(`/api/invoice/${invoiceId}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((payload) => {
      if (!payload.success) {
        dispatchError(payload.message);
        return;
      }
      success();
      dispatchSuccess(payload.message);
    })
    .catch((error) => {
      dispatchError(error.message);
    });
};

const setSearchFilters = (filters) => {
  let query = "";
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== "") {
      query += `&${key}=${filters[key]}`;
    }
  });
  return query;
};
