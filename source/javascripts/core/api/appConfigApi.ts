import { get, post } from './client';
import { BitriseYml } from '@/core/domain/BitriseYml';

type AppConfigDTO = BitriseYml;

export const GET_APP_CONFIG_PATH = `/api/app/:appSlug/config`;

const getAppConfigPath = (appSlug: string, readFromRepo?: boolean) =>
  `${GET_APP_CONFIG_PATH.replace(':appSlug', appSlug)}${readFromRepo ? '?is_force_from_repo=1' : ''}`;

export const getAppConfig = (appSlug: string, readFromRepo?: boolean, options?: RequestInit) =>
  get<AppConfigDTO>(getAppConfigPath(appSlug, readFromRepo), options);

export const updateAppConfig = (appSlug: string, appConfig: string, options?: Omit<RequestInit, 'body'>) =>
  post<AppConfigDTO>(getAppConfigPath(appSlug), {
    ...options,
    body: JSON.stringify({
      app_config_datastore_yaml: appConfig,
    }),
  });
