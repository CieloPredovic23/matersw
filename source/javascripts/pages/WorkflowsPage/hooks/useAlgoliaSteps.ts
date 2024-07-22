import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AlgoliaStepDTO, AttributesToRetrieve, getAllSteps } from '@/core/api/algoliaApi';

type Props = {
  attributesToRetrieve: AttributesToRetrieve;
};

const useAlgoliaSteps = ({ attributesToRetrieve = ['*'] }: Props): UseQueryResult<AlgoliaStepDTO[]> => {
  return useQuery<AlgoliaStepDTO[]>({
    queryKey: ['algolia', 'steps', attributesToRetrieve],
    queryFn: () => getAllSteps({ attributesToRetrieve }),
    staleTime: Infinity,
  });
};

export default useAlgoliaSteps;
