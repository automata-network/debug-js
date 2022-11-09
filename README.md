# DebugJs

A front-end logs collection tool.

## Install Client

```bash
npm i @automata-network/debug-js-browser -S
```

## Use Client

```typescript
const debugJs = new DebugJs({
  appName: "example",
  collectorUrl: "http://localhost:9000/collect",
  logLevel: LogLevel.Info,
  requestInterval: 5000,
});

debugJs.setUid("johnny");
```

## Install Server SDK

```bash
npm i @automata-network/debug-js-server -S
```

## Use Client

```js
const { listen } = require("@automata-network/debug-js-server");

const { app, router } = listen({
  onReceiveLogs: (logs) => {
    console.log(logs);
  },
});
```

## Change Port, Path, Cors And Rate Limit Settings

We are using the `@koa/cors` and `koa-ratelimit`, read their document for more informations.

```js
const { listen } = require("@automata-network/debug-js-server");

const { app, router } = listen({
  path: "/collect",
  port: 9000,
  corsOptions: {},
  rateLimitOptions: {},
  onReceiveLogs: (logs) => {
    console.log(logs);
  },
});
```
