import { del, get, patch, post } from '@/core/api/client';

export type SecretParams = {
  appSlug: string;
  secretKey: string;
};

export type UpsertSecretDTO = {
  name: string;
  value: string;
  expandInStepInputs: boolean;
  exposedForPullRequests: boolean;
  isProtected: boolean;
};

const SECRET_PATH = '/api/:appSlug/secrets';
const SECRET_ITEM_PATH = '/api/:appSlug/secrets/:secretKey';

const getSecretPath = (appSlug: string) => SECRET_PATH.replace(':appSlug', appSlug);

const getSecretItemPath = ({ appSlug, secretKey }: SecretParams) =>
  SECRET_ITEM_PATH.replace(':appSlug', appSlug).replace(':secretKey', secretKey);

export const getSecretValue = async (params: SecretParams, options?: RequestInit) =>
  get<{ value: string }>(getSecretItemPath(params), options);

export const deleteSecret = async (params: SecretParams, options?: RequestInit) =>
  del(getSecretItemPath(params), options);

type UpsertParams = SecretParams & {
  body: UpsertSecretDTO;
  isSaved?: boolean;
};

export const upsertSecret = async ({ appSlug, secretKey, body, isSaved }: UpsertParams, options?: RequestInit) => {
  const bodyStr = JSON.stringify(body);
  if (isSaved) {
    return patch(getSecretItemPath({ appSlug, secretKey }), {
      body: bodyStr,
      ...options,
    });
  }

  return post(getSecretPath(appSlug), { body: bodyStr, ...options });
};
