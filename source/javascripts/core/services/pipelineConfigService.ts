import { PipelineConfigDTO } from '@/core/api/pipelineConfigApi';
import { PipelineConfig } from '@/core/domain/PipelineConfig';

export const fromApi = (dto: PipelineConfigDTO): PipelineConfig => {
  return {
    usesRepositoryYml: dto.uses_repository_yml,
  };
};

export const toApi = (model: PipelineConfig): PipelineConfigDTO => {
  return {
    uses_repository_yml: model.usesRepositoryYml,
  };
};
