import { DefaultError, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { deleteSecret, getSecretValue, SecretParams, upsertSecret } from '@/core/api/secretApi';
import { toApi } from '@/core/services/secretService';
import { SecretWithState } from '@/models';

type UseSecretValueProps = SecretParams & Omit<UseQueryOptions<{ value: string }>, 'queryKey' | 'queryFn'>;

function useSecretValue({ appSlug, secretKey, ...opts }: UseSecretValueProps) {
  return useQuery<{ value: string }>({
    queryKey: ['app', appSlug, 'secrets', secretKey],
    queryFn: () => getSecretValue({ appSlug, secretKey }),
    staleTime: 0,
    gcTime: 0,
    ...opts,
  });
}

type UseDeleteSecretProps = SecretParams & Omit<UseMutationOptions, 'mutationKey' | 'mutationFn'>;

function useDeleteSecret({ appSlug, secretKey, ...opts }: UseDeleteSecretProps) {
  return useMutation({
    mutationKey: ['app', appSlug, 'secrets', secretKey],
    mutationFn: () => deleteSecret({ appSlug, secretKey }),
    ...opts,
  });
}

type UseUpsertSecretProps = SecretParams & UseMutationOptions<unknown, DefaultError, MutateParams>;
type MutateParams = {
  secret: SecretWithState;
};

function useUpsertSecret({ appSlug, secretKey, ...opts }: UseUpsertSecretProps) {
  return useMutation({
    mutationKey: ['app', appSlug, 'secrets', secretKey],
    mutationFn: ({ secret }) =>
      upsertSecret({
        appSlug,
        secretKey,
        body: toApi(secret),
        isSaved: secret.isSaved,
      }),
    ...opts,
  });
}

export { useSecretValue, useDeleteSecret, useUpsertSecret };
