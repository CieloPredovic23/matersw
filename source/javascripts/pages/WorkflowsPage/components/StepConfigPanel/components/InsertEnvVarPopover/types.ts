import { EnvVar } from '@/core/domain/EnvVar';

export type CreateEnvVarFormValues = EnvVar;
export type HandlerFn = (envVar: EnvVar) => void;
