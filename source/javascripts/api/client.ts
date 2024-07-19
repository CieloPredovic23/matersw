import merge from 'lodash/merge';
import getCookie from '@/hooks/utils/cookies';

const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

type ExtraOpts = { excludeCSRF?: boolean };
type ClientOpts = RequestInit & ExtraOpts;

const DEFAULT_OPTIONS: ClientOpts = {
  headers: DEFAULT_HEADERS,
};
const client = async (url: string, options?: ClientOpts) => {
  const csrfHeader = !options?.excludeCSRF ? { 'X-CSRF-TOKEN': getCookie('CSRF-TOKEN') } : undefined;
  const headers = merge({}, DEFAULT_OPTIONS.headers, options?.headers, csrfHeader);
  const opts = merge({}, DEFAULT_OPTIONS, options, { headers });
  return fetch(url, opts);
};

export const get = async <T>(url: string, options?: ClientOpts) => {
  const response = await client(url, { ...options, method: 'GET' });
  return (await response.json()) as T;
};

export const post = async <T>(url: string, options: ClientOpts) => {
  const response = await client(url, { ...options, method: 'POST' });
  return (await response.json()) as T;
};

export const put = async <T>(url: string, options: ClientOpts) => {
  const response = await client(url, { ...options, method: 'PUT' });
  return (await response.json()) as T;
};

export const patch = async <T>(url: string, options: ClientOpts) => {
  const response = await client(url, { ...options, method: 'PATCH' });
  return (await response.json()) as T;
};

export const del = async <T>(url: string, options: ClientOpts) => {
  const response = await client(url, { ...options, method: 'DELETE' });
  return (await response.json()) as T;
};
