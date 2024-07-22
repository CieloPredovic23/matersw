import { useQuery } from '@tanstack/react-query';
import { getAllStackInfoPath, getStacks } from '@/core/api/stackApi';
import { fromApiCollection } from '@/core/services/stackService';

type Props = {
  appSlug: string;
};

const useStacks = ({ appSlug }: Props) => {
  return useQuery({
    queryKey: [getAllStackInfoPath(appSlug)],
    queryFn: ({ signal }) => getStacks(appSlug, { signal }),
    select: (data) => fromApiCollection(data),
    enabled: Boolean(appSlug),
    staleTime: Infinity,
  });
};

export default useStacks;
