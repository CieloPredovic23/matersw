import { useQuery } from '@tanstack/react-query';
import StepApi from '@/api/StepApi';

function useAlgoliaSteps() {
  return useQuery({
    queryKey: ['algolia-steps'],
    queryFn: () => StepApi.getAllSteps(),
    staleTime: Infinity,
  });
}

function useAlgoliaStep({
  id,
  filter,
  enabled = true,
}: {
  id: string;
  filter: 'latest_version' | 'all_versions';
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ['algolia-step', { id, filter }],
    queryFn: () => StepApi.getStepById({ id, filter }),
    enabled: Boolean(id && enabled),
    staleTime: Infinity,
  });
}

function useAlgoliaStepInputs({ cvs, enabled = true }: { cvs: string; enabled?: boolean }) {
  return useQuery({
    queryKey: ['algolia-step', 'inputs', { cvs }] as const,
    queryFn: () => StepApi.getStepInputs({ cvs }),
    enabled: Boolean(cvs && enabled),
    staleTime: Infinity,
  });
}

export { useAlgoliaSteps, useAlgoliaStep, useAlgoliaStepInputs };
