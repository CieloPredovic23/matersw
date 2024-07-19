import { useQuery } from '@tanstack/react-query';
import { AppConfig } from '@/models/AppConfig';

export default function useAppConfig(appSlug: string) {
  return useQuery<AppConfig>({
    queryKey: ['app', appSlug, 'config'],
    queryFn: getAppConfig(appSlug),
  });
}
