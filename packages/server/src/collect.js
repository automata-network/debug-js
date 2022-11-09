module.exports = {
  handler: async (ctx) => {
    const { body } = ctx.request;

    const logParsed = formateLog(body);

    console.log(logParsed);

    ctx.type = "json";
    ctx.status = 200;
  },
};

function formateLog(body) {
  const { appName, ua, logs, uid } = body;

  return logs && logs.length
    ? logs
        .map((item) => {
          const { type, log, time, url } = item;
          return `[${type}|${appName}|${uid}|${time}] ${log} [${url}|${ua}]`;
        })
        .join("\n")
    : "";
}
