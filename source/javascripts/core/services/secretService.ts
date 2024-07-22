import { SecretWithState } from '@/models';
import { UpsertSecretDTO } from '@/core/api/secretApi';

export const toApi = (secret: SecretWithState): UpsertSecretDTO => {
  return {
    name: secret.key,
    value: secret.value,
    expandInStepInputs: secret.isExpand,
    exposedForPullRequests: secret.isExpose,
    isProtected: secret.isProtected,
  };
};
