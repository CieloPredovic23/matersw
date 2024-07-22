import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AlgoliaStepDTO, AttributesToRetrieve, getStep } from '@/core/api/algoliaApi';

type Props = {
  id: string;
  enabled?: boolean;
  latestOnly?: boolean;
  attributesToRetrieve?: AttributesToRetrieve;
};

const useAlgoliaStep = ({
  id,
  enabled,
  latestOnly,
  attributesToRetrieve = ['*'],
}: Props): UseQueryResult<Array<AlgoliaStepDTO>> => {
  const filter = { id, latestOnly, attributesToRetrieve };
  return useQuery<AlgoliaStepDTO[]>({
    queryKey: ['algolia', 'step', filter] as const,
    queryFn: () => getStep(filter),
    staleTime: Infinity,
    enabled,
  });
};

export default useAlgoliaStep;
