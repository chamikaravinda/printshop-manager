import {
  dispatchError,
  dispatchStopLoading,
  dispatchStartLoading,
  dispatchSuccess,
} from "./notifications.action";

export const getPurchaseOrders = async (
  startIndex,
  limit,
  filters,
  success
) => {
  dispatchStartLoading();
  await fetch(
    `/api/purchase-order/get?startIndex=${startIndex}&limit=${limit}${setSearchFilters(
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


export const deletePurchaseOrders = async (
  orderId, success
) => {
  dispatchStartLoading();
  await fetch(
    `/api/purchase-order/${orderId}`, {
      method: "DELETE",
    }
  )
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
