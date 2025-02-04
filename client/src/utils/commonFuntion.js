export const formatCurrencyToLRK = (value) => {
  return parseFloat(value || 0).toLocaleString("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
