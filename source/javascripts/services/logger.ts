import _ from "underscore";
import { datadogLogs, StatusType, HandlerType, Logger as DLogger } from "@datadog/browser-logs";
import { Context } from "@datadog/browser-core";
import { getAppSlug } from "./app-service";

interface Logger {
	debug(message: string): void;
	info(message: string): void;
	warn(message: string): void;
  error(message: string): void;
  setContext(ctx: Context): void;
}

type LoggerOptions = {
  name: string,
  clientToken: string|undefined,
  isProd: boolean|undefined,
  level: StatusType
}

class DataDogLoggerService implements Logger {
  private logger: DLogger

	constructor({
    name,
    clientToken = (<any>window).DATADOG_API_KEY,
    isProd = (<any>window).isProd,
    level = StatusType.warn
  }: LoggerOptions,
  context: Context,
  dLogger: typeof datadogLogs) {
    dLogger.init({ clientToken, forwardErrorsToLogs: false });
    this.logger = dLogger.createLogger(name, {
      level, context,
      handler: isProd ? HandlerType.http : HandlerType.console
    });
  }

  setContext = (ctx: Context) => {
    Object.keys(ctx).forEach((key) => {
      this.logger.addContext(key, ctx[key]);
    });
  };

	debug = (message: string, ctx?: Context) => {
		this.logger.debug(message, ctx);
	};

	info = (message: string, ctx?: Context) => {
		this.logger.info(message, ctx);
	};

	warn = (message: string, ctx?: Context) => {
		this.logger.warn(message, ctx);
	};

	error = (message: string, ctx?: Context) => {
		this.logger.error(message, ctx);
	};
}

// testing purposes
(<any>window).datadogLogs = datadogLogs;

const getDefaultTags = (): Context => _.pick({
  service: (<any>window).serviceName,
  mode: (<any>window).mode,
  appSlug: getAppSlug()
}, _.identity) as Context;

export default (opts: LoggerOptions): Logger => {
  const tags = getDefaultTags();

  // D-Dog supports console logging as well depends on the environment
  // if we are using some other service we need to create other type of loggers here for environments
  // this works for every environment
  return new DataDogLoggerService(
    opts, tags,
    (<any>window).datadogLogs
  );
}
