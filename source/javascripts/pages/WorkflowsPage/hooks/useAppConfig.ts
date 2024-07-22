import { useQuery } from '@tanstack/react-query';
import { BitriseYml } from '@/core/domain/BitriseYml';

const getAppConfig = (appSlug: string) => async () => {
  const response = await fetch(`/api/app/${appSlug}/config`);
  return response.json();
};

type Props = {
  appSlug: string;
};

const useAppConfig = ({ appSlug }: Props) => {
  return useQuery<BitriseYml>({
    queryKey: ['app', appSlug, 'config'],
    queryFn: getAppConfig(appSlug),
    staleTime: Infinity,
  });
};

export default useAppConfig;
