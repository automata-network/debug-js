const Koa = require("koa");
const logger = require("koa-logger");
const Router = require("koa-router");
const cors = require("@koa/cors");
const ratelimit = require("koa-ratelimit");
const { koaBody } = require("koa-body");

const collect = require("./collect");

module.exports = {
  listen: function (options) {
    const {
      path = "/collect",
      port = 9000,
      rateLimitOptions,
      corsOptions,
      onReceiveLogs,
    } = options || {};
    const app = new Koa();
    const router = new Router();

    router.post(path, koaBody(), collect.generateHandler(onReceiveLogs));

    app.use(
      ratelimit(
        rateLimitOptions || {
          driver: "memory",
          db: new Map(),
          duration: 10 * 1000, // 10 requests per 10s
          errorMessage: "Exceeds max rate.",
          id: (ctx) => ctx.ip,
          max: 10,
          disableHeader: true,
        }
      )
    );

    app.use(logger());
    app.use(cors(corsOptions || { credentials: true }));
    app.use(router.routes());

    app.listen(port, () => {
      console.log(`Server listening on port: ${port}`);
    });

    return {
      app,
      router,
    };
  },
};
