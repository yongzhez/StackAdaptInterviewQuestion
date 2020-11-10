export const formatQuotes = (data) =>
  Object.values(data).map((coin) => ({
    rank: coin.cmc_rank,
    name: coin.name,
    symbol: coin.symbol,
    price: Number.parseFloat(coin.quote.USD.price).toFixed(2),
  }));
