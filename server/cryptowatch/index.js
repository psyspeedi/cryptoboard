const { StreamClient } = require("cw-sdk-node");

const webSocketServer = require('../index')

const CWclient = (subscriptions) => new StreamClient({
  creds: {
    apiKey: "", // your cw api key
    secretKey: "" // your cw secret key
  },
  subscriptions,
//   subscriptions: [
//     "markets:86:trades", // kraken btc:usd
//     // "pairs:9:performance", // btc/usd pair
//     // "markets:1:trades"
//   ],
  logLevel: "debug"
});

// Handlers for market and pair data
// CWclient.onMarketUpdate(marketData => {
//   console.log(marketData.trades[0].price);
    // console.log(webSocketServer);
// });

// client.onPairUpdate(pairData => {
//   console.log(pairData);
// });

// Error handling
// CWclient.onError(err => {
//   console.error(err);
// });

// You can also listen on state changes
// client.onStateChange(newState => {
//   console.log("connection state changed:", newState);
// });

// CWclient.onConnect(() => {
//   console.info("streaming data for the next 15 seconds...");
//   setTimeout(() => {
//     client.disconnect();
//   }, 15 * 1000);
// });

// CWclient.onDisconnect(() => {
//   console.log("done");
// });

// Connect to stream
// CWclient.connect();

module.exports = CWclient