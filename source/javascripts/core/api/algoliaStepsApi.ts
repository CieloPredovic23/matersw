import algoliasearch from 'algoliasearch';
import { Paths } from 'type-fest';
import uniqBy from 'lodash/uniqBy';
import { Step } from '@/core/domain/Step';

export enum Maintainer {
  Bitrise = 'bitrise',
  Verified = 'verified',
  Community = 'community',
}

type StepInfoModelDTO = {
  maintainer?: Maintainer;
  asset_urls?: Step['asset_urls'] & {
    'icon.svg'?: string;
    'icon.png'?: string;
  };
};

export type StepModelDTO = Step;

export type AlgoliaStepDTO = Partial<{
  readonly objectID: string;
  cvs: string;
  id: string;
  version: string;
  is_deprecated: boolean;
  is_latest: boolean;
  latest_version_number: string;
  step: Partial<StepModelDTO>;
  info: StepInfoModelDTO;
}>;

export type AttributesToRetrieve = Paths<AlgoliaStepDTO> | ['*'];

const getAlgoliaClients = () => {
  const client = algoliasearch('HI1538U2K4', '708f890e859e7c44f309a1bbad3d2de8');
  return {
    stepsClient: client.initIndex('steplib_steps'),
    inputsClient: client.initIndex('steplib_inputs'),
  };
};

type GetStepParams = {
  id: string;
  latestOnly?: boolean;
  attributesToRetrieve?: AttributesToRetrieve;
};

export const getStep = async ({
  id,
  latestOnly,
  attributesToRetrieve = ['*'],
}: GetStepParams): Promise<AlgoliaStepDTO[]> => {
  const { stepsClient } = getAlgoliaClients();
  const results: AlgoliaStepDTO[] = [];
  await stepsClient.browseObjects<AlgoliaStepDTO>({
    batch: (batch) => results.push(...batch),
    attributesToRetrieve: attributesToRetrieve as string[],
    filters: latestOnly ? `id:${id} AND is_latest:true` : `id:${id}`,
  });
  return results;
};

type GetAllStepsParams = {
  attributesToRetrieve?: AttributesToRetrieve;
};

export const getAllSteps = async ({ attributesToRetrieve = ['*'] }: GetAllStepsParams): Promise<AlgoliaStepDTO[]> => {
  const { stepsClient } = getAlgoliaClients();
  const results: Array<AlgoliaStepDTO> = [];
  const attrs = attributesToRetrieve[0] === '*' ? ['*'] : ['id', ...(attributesToRetrieve as string[])];
  await stepsClient.browseObjects<AlgoliaStepDTO>({
    batch: (objects) => results.push(...objects),
    attributesToRetrieve: attrs,
    filters: 'is_latest:true AND is_deprecated:false',
  });
  return uniqBy(results, 'id');
};
