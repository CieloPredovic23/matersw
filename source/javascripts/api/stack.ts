import { UseQueryOptions } from '@tanstack/react-query';

export type AllStackInfo = {
  available_stacks: {
    [key: string]: {
      title: string;
      project_types: string[];
      available_machines?: string[];
    };
  };
  project_types_with_default_stacks: {
    [key: string]: {
      default_stack: string;
    };
  };
};

export const GET_ALL_STACK_INFO_PATH = `/app/:appSlug/all_stack_info`;

export const getAllStackInfoPath = (appSlug: string) => GET_ALL_STACK_INFO_PATH.replace(':appSlug', appSlug);

export const getAllStackInfoQueryOptions = (appSlug: string): UseQueryOptions<AllStackInfo, Error, AllStackInfo> => ({
  staleTime: Infinity,
  queryKey: [getAllStackInfoPath(appSlug)],
  queryFn: ({ signal }) => stack(appSlug, signal),
});

// TODO: Create a general fetch service
const stack = async (appSlug: string, signal?: AbortSignal) => {
  const response = await monolithApi(getAllStackInfoPath(appSlug), {
    signal,
  });
  return (await response.json()) as AllStackInfo;
};

export default stack;
