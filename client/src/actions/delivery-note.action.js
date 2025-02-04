import {
  dispatchError,
  dispatchStopLoading,
  dispatchStartLoading,
  dispatchSuccess,
} from "./notifications.action";

export const getDeliveryNotes = async (
  startIndex,
  limit,
  filters,
  success
) => {
  dispatchStartLoading();
  await fetch(
    `/api/delivery-note/get?startIndex=${startIndex}&limit=${limit}${setSearchFilters(
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

export const getDeliveryNote = async (orderId, success) => {
  dispatchStartLoading();
  await fetch(`/api/delivery-note/get/${orderId}`)
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

export const addDeliveryNote = async (newDeliveryNote, success) => {
  dispatchStartLoading();
  await fetch("/api/delivery-note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newDeliveryNote),
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

export const updateDeliveryNote = async (
  updatedDeliveryNote,
  noteId,
  success
) => {
  dispatchStartLoading();
  await fetch(`/api/delivery-note/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedDeliveryNote),
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

export const deleteDeliveryNote = async (orderId, success) => {
  dispatchStartLoading();
  await fetch(`/api/delivery-note/${orderId}`, {
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
