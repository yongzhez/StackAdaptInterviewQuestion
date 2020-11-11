////////////////////////////////////////////////////////////////////////////////

const SYMBOLS = [
  "AAPL",
  "AMZN",
  "MONY",
  "PETS",
  "PZZA",
  "SHOP",
  "TSLA",
  "WIFI",
];

////////////////////////////////////////////////////////////////////////////////

const readJSON = function () {
  // Simulate success rate
  if (Math.random() > 0.2) {
    // Call was successful
    return Promise.resolve({
      version: 1,
      payload: {
        AAPL: 1588773600,
        AMZN: 1588690800,
        MONY: 1588428000,
        PETS: 1588532400,
        SHOP: 1588525200,
        TSLA: 1588608000,
      },
    });
  } else return Promise.reject("the file could not be opened for reading");
};

////////////////////////////////////////////////////////////////////////////////

const loadState = function () {
  // Read the previous state
  const result = readJSON();

  return result
    .then((state) => {
      // If state is compliant
      if (state.version !== 1) {
        console.warn("version mismatch with previous state, rebuilding...");
        return {};
      }

      return state.payload;
    })
    .catch((error) => {
      console.error("failed to load previous state, rebuilding...\n", error);
      return {};
    })
    .then((payload) => {
      // Populate primary queue data
      for (const symbol of SYMBOLS) {
        if (!(symbol in payload)) payload[symbol] = 0;
	  }

      // Oldest entries to the top
      return Object.fromEntries(
        Object.entries(payload).sort((a, b) => a[1] - b[1])
      );
    });
};

////////////////////////////////////////////////////////////////////////////////

(async () => {
  const state = JSON.stringify(await loadState());
  const success = JSON.stringify({
    PZZA: 0,
    WIFI: 0,
    MONY: 1588428000,
    SHOP: 1588525200,
    PETS: 1588532400,
    TSLA: 1588608000,
    AMZN: 1588690800,
    AAPL: 1588773600,
  });

  const failure = JSON.stringify({
    AAPL: 0,
    AMZN: 0,
    MONY: 0,
    PETS: 0,
    PZZA: 0,
    SHOP: 0,
    TSLA: 0,
    WIFI: 0,
  });

  // Perform a poor-mans comparison on result
  if (state !== success && state !== failure)
    throw new Error("unrecognized result");
})();
