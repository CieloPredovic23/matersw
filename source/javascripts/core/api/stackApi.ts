import { get } from '@/core/api/client';

export type AllStackInfoDTO = {
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
export type StackDTO = AllStackInfoDTO['available_stacks'][string];

export const GET_ALL_STACK_INFO_PATH = `/app/:appSlug/all_stack_info`;

export const getAllStackInfoPath = (appSlug: string) => GET_ALL_STACK_INFO_PATH.replace(':appSlug', appSlug);

export const getStacks = (appSlug: string, options?: RequestInit) =>
  get<AllStackInfoDTO>(getAllStackInfoPath(appSlug), options);
