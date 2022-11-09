import { DebugJs, LogLevel } from "@automata/debug-js-browser";

const debugJs = new DebugJs({
  appName: "example",
  collectorUrl: "http://localhost:9000/collect",
  logLevel: LogLevel.Info,
  requestInterval: 2000,
});

debugJs.setUid("johnny");

setInterval(() => {
  throw new Error("time: " + new Date().getTime());
}, 100);
