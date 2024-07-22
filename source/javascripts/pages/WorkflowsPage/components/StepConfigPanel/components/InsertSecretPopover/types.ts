import { Secret } from '@/core/domain/Secret';

export type CreateSecretFormValues = Secret;
export type HandlerFn = (secret: Secret) => void;
