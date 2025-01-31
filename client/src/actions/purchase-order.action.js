import {
  dispatchError,
  dispatchStopLoading,
  dispatchStartLoading,
  dispatchSuccess,
} from "./notifications.action";




export const getPurchaseOrders = async (startIndex,limit, success) => {
  dispatchStartLoading();
  await fetch(`/api/purchase-order/get?startIndex=${startIndex}&limit=${limit}}`)
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
