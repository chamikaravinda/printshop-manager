import {
  dispatchError,
  dispatchStopLoading,
  dispatchStartLoading,
} from "./notifications.action";

export const getDasahboardDetails = async (
  success
) => {
  dispatchStartLoading();
  await fetch(
    "/api/dashboard/"
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