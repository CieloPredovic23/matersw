import { getAppSlug } from "./app-service";
import StringService from "./string-service";

enum RequestServiceMode {
	Website = "website",
	Cli = "cli"
}

class RequestService {
	public mode: string;
	public appSlug: string;

	constructor() {
		this.mode = this.modeFromEnvVars() as string;
		this.appSlug = getAppSlug() as string;
	}

	private modeFromEnvVars(): RequestServiceMode {
		if (process.env["MODE"] == "WEBSITE") {
			return RequestServiceMode.Website;
		}

		return RequestServiceMode.Cli;
	}

	private prefixedError(message: string, messagePrefix: string): Error {
		return new Error(messagePrefix + message);
	}

	private responseAbortedError(messagePrefix: string): Error {
		return this.prefixedError(window["strings"].request_service.response.aborted, messagePrefix);
	}

	private errorFromResponseBody(
		responseBody: any,
		defaultMessage: string = window["strings"].request_service.response.default_error
	): Error {
		return new Error(responseBody.error || responseBody.error_msg || defaultMessage);
	}

	getAppConfigYML(_requestConfig: any): Promise<string | Error | { bitrise_yml: string; error: Error }> {
		let requestURL: string;

		switch (this.mode) {
			case RequestServiceMode.Website:
				requestURL = StringService.stringReplacedWithParameters(window["routes"].website.yml_get, {
					app_slug: this.appSlug
				});

				break;
			case RequestServiceMode.Cli:
				requestURL = window["routes"].local_server.yml_get;

				break;
		}

		return new Promise((resolve, reject) => {
			fetch(requestURL).then(
				response => {
					if (response.ok) {
						response
							.text()
							.then(resolve, _reason =>
								reject(new Error(window["strings"].request_service.load_app_config.default_error))
							);
					} else {
						response.json().then(
							(responseBody: any) => {
								if (responseBody.bitrise_yml) {
									reject({
										bitrise_yml: responseBody.bitrise_yml,
										error_message: new Error(
											window["strings"].request_service.load_app_config.invalid_bitrise_yml_error
										)
									});
								} else {
									reject(
										this.errorFromResponseBody(
											responseBody,
											window["strings"].request_service.load_app_config.error_prefix
										)
									);
								}
							},
							_reason => reject(new Error(window["strings"].request_service.load_app_config.default_error))
						);
					}
				},
				_reason => reject(this.responseAbortedError(window["strings"].request_service.load_app_config.error_prefix))
			);
		});
	}
}

export default new RequestService();
