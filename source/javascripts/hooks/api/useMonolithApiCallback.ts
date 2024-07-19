import { useQuery } from '@tanstack/react-query';

export interface MonolithError {
  error_msg: string;
}

export default function useMonolithApiCallback<T>(url: string) {
  return useQuery<T, MonolithError>({
    queryKey: [url],
    queryFn: async () => {
      const response = await fetch(url);
      return response.json();
    },
  });
}
