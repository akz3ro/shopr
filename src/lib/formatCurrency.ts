export const formatCurrency = (amount: number, currency: string = "USD") => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    currencyDisplay: "symbol",
  });

  return formatter.format(amount);
};
