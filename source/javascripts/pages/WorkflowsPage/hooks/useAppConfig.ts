import { useQuery } from '@tanstack/react-query';

const queryKey = (appSlug: string) => ['app', appSlug, 'config'];

const getAppConfig = (appSlug: string) => async () => {
  const response = await fetch(`/api/app/${appSlug}/config`);
  return response.json();
};

type Props = {
  appSlug: string;
};

const useAppConfig = ({ appSlug }: Props) => {
  return useQuery({
    queryKey: queryKey(appSlug),
    queryFn: getAppConfig(appSlug),
  });
};

export default useAppConfig;
