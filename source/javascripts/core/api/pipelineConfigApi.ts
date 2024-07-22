import { get, put } from '@/core/api/client';

export type PipelineConfigDTO = {
  uses_repository_yml: boolean;
};

const PIPELINE_CONFIG_PATH = 'app/:appSlug/pipeline_config';
export const getPipelineConfigPath = (appSlug: string) => PIPELINE_CONFIG_PATH.replace(':appSlug', appSlug);

export const getPipelineConfig = (appSlug: string, options?: RequestInit) =>
  get<PipelineConfigDTO>(getPipelineConfigPath(appSlug), options);

export const updatePipelineConfig = (
  appSlug: string,
  usesRepositoryYml: boolean,
  options?: Omit<RequestInit, 'body'>,
) =>
  put(getPipelineConfigPath(appSlug), {
    body: JSON.stringify({
      uses_repository_yml: usesRepositoryYml,
    }),
    ...options,
  });
