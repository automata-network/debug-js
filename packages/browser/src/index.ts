import { serialize, tryGet } from "./utils";

export enum LogLevel {
  Info = "Info",
  Warn = "Warn",
  Error = "Error",
}

enum LogType {
  Error = "Error",
  Info = "Info",
  Warn = "Warn",
  Debug = "Debug",
  Log = "Log",
}

interface DebugJsConstructorOptions {
  appName: string;
  collectorUrl: string;
  requestInterval?: number;
  logLevel?: LogLevel;
  uid?: string;
}

interface LogCache {
  type: LogType;
  log: string;
  time: string;
  url: string;
}

let installed = false;

export class DebugJs {
  appName: string;
  collectorUrl: string;
  requestInterval: number;
  logLevel: LogLevel;
  uid?: string;
  private ua = navigator.userAgent;
  private lastRequestTime = 0;
  private logsRequestTimer: any;
  private logsCache: LogCache[] = [];

  constructor({
    appName,
    collectorUrl,
    requestInterval = 1000,
    logLevel = LogLevel.Error,
    uid,
  }: DebugJsConstructorOptions) {
    if (installed) {
      throw new Error("You can only have one DebugJS instance.");
    }

    this.appName = appName;
    this.collectorUrl = collectorUrl;
    this.requestInterval = requestInterval;
    this.logLevel = logLevel;
    this.uid = uid;

    this.wrapConsole();
    this.watchWindowErrors();
    this.watchPromiseErrors();
    this.watchLogs();

    installed = true;
  }

  private wrapConsole() {
    const self = this;

    const consoleLog = console.log;
    const consoleError = console.error;
    const consoleDebug = console.debug;
    const consoleInfo = console.info;
    const consoleWarn = console.warn;

    console.error = function () {
      if (
        self.logLevel === LogLevel.Error ||
        self.logLevel === LogLevel.Warn ||
        self.logLevel === LogLevel.Info
      ) {
        self.log(LogType.Error, ...arguments);
      }

      consoleError(...arguments);
    };

    console.warn = function () {
      if (self.logLevel === LogLevel.Info || self.logLevel === LogLevel.Warn) {
        self.log(LogType.Warn, ...arguments);
      }

      consoleWarn(...arguments);
    };

    console.debug = function () {
      if (self.logLevel === LogLevel.Info) {
        self.log(LogType.Debug, ...arguments);
      }

      consoleDebug(...arguments);
    };

    console.info = function () {
      if (self.logLevel === LogLevel.Info) {
        self.log(LogType.Info, ...arguments);
      }

      consoleInfo(...arguments);
    };

    console.log = function () {
      if (self.logLevel === LogLevel.Info) {
        self.log(LogType.Log, ...arguments);
      }

      consoleLog(...arguments);
    };
  }

  private watchPromiseErrors() {
    const self = this;

    window.addEventListener("unhandledrejection", function (a: any) {
      try {
        a = a || {};
        var e = a.detail ? tryGet(a.detail, "reason") : tryGet(a, "reason");
        if (e !== undefined && e !== null) {
          self.log(e);
        }
      } catch (f) {}
    });
  }

  private watchWindowErrors() {
    const self = this;

    window.addEventListener("error", function (ev) {
      const { lineno, colno, error } = ev;

      self.log(LogType.Error, {
        message: error.message,
        name: error.name || "Error",
        line: error.line || lineno || null,
        column: error.column || colno || null,
        stack: error.stack || null,
      });
    });
  }

  private watchLogs() {
    const self = this;

    this.logsRequestTimer = setInterval(function () {
      const now = new Date().getTime();
      if (
        self.lastRequestTime + self.requestInterval <= now &&
        self.logsCache.length
      ) {
        self.sendLogs();
        self.lastRequestTime = now;
      }
    }, 1000);
  }

  private sendLogs() {
    fetch(this.collectorUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appName: this.appName,
        ua: this.ua,
        uid: this.uid,
        logs: this.logsCache,
      }),
    }).catch((e) => {});

    this.logsCache = [];
  }

  destory() {
    clearInterval(this.logsRequestTimer);
  }

  setUid(uid: string) {
    this.uid = uid;
  }

  log(type: LogType, ...args: any[]) {
    const now = new Date().toISOString();
    const url = location.href;

    this.logsCache.push({
      type,
      log: serialize(args),
      time: now,
      url,
    });
  }
}

export default DebugJs;
