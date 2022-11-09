const { listen } = require("@automata-network/debug-js-server");

const { app, router } = listen({
  onReceiveLogs: (logs) => {
    console.log(logs);
  },
});
