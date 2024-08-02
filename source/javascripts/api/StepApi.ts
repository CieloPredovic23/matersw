import algoliasearch from 'algoliasearch';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import { Maintainer, Step, StepInputOptions } from '@/core/Step';
import { YmlStepObject } from '@/core/BitriseYml.step';
import VersionUtils from '@/utils/version.utils';

const ALGOLIA_APP_ID = 'HI1538U2K4';
const ALGOLIA_API_KEY = '708f890e859e7c44f309a1bbad3d2de8';
const ALGOLIA_STEPLIB_STEPS_INDEX = 'steplib_steps';
const ALGOLIA_STEPLIB_INPUTS_INDEX = 'steplib_inputs';

// DTOs
type AlgoliaStepResponse = Partial<{
  readonly objectID: string;
  id: string;
  cvs: string;
  version: string;
  is_deprecated: boolean;
  is_latest: boolean;
  latest_version_number: string;
  step: Partial<YmlStepObject>;
  info: {
    maintainer?: Maintainer;
    asset_urls?: YmlStepObject['asset_urls'] & {
      'icon.svg'?: string;
      'icon.png'?: string;
    };
  };
}>;

type AlgoliaStepInputResponse = Partial<{
  readonly objectID: string;
  cvs: string;
  order: number;
  opts: StepInputOptions;
  is_latest: boolean;
  [key: string]: unknown;
}>;

// TRANSFORMATIONS
function toStep(response: AlgoliaStepResponse, availableVersions?: string[]): Step | undefined {
  if (!response.id || !response.cvs) {
    return undefined;
  }

  return {
    ...response.step,
    info: {
      id: response.id,
      cvs: response.cvs,
      icon:
        response.info?.asset_urls?.['icon.svg'] ||
        response.info?.asset_urls?.['icon.png'] ||
        response.step?.asset_urls?.['icon.svg'] ||
        response.step?.asset_urls?.['icon.png'],
      isOfficial: response.info?.maintainer === Maintainer.Bitrise && !response.is_deprecated,
      isVerified: response.info?.maintainer === Maintainer.Verified && !response.is_deprecated,
      isCommunity: response.info?.maintainer === Maintainer.Community && !response.is_deprecated,
      isDeprecated: Boolean(response.is_deprecated),
    },
    versionInfo: {
      availableVersions,
      version: response.version || '',
      selectedVersion: VersionUtils.normalizeVersion(response),
      resolvedVersion: VersionUtils.resolveVersion(response, response.latest_version_number || '', availableVersions),
      latestVersion: response.latest_version_number,
      isLatest: Boolean(response.is_latest),
    },
  };
}

// API CALLS
function getAlgoliaClients() {
  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
  return {
    stepsClient: client.initIndex(ALGOLIA_STEPLIB_STEPS_INDEX),
    inputsClient: client.initIndex(ALGOLIA_STEPLIB_INPUTS_INDEX),
  };
}

async function getAllSteps() {
  const { stepsClient } = getAlgoliaClients();
  const results: Array<AlgoliaStepResponse> = [];
  await stepsClient.browseObjects<AlgoliaStepResponse>({
    batch: (objects) => results.push(...objects),
    filters: 'is_latest:true AND is_deprecated:false',
  });
  return uniqBy(results, 'id')
    .map((step) => toStep(step))
    .filter(Boolean) as Step[];
}

async function getStep({ cvs }: { cvs: string }): Promise<Array<Step>> {
  const [id] = cvs.split('@');
  const { stepsClient } = getAlgoliaClients();
  const results: AlgoliaStepResponse[] = [];
  await stepsClient.browseObjects<AlgoliaStepResponse>({
    batch: (batch) => results.push(...batch),
    filters: `id:${id}`,
  });
  const availableVersions = results.map((step) => step.version).filter(Boolean) as string[];
  return results.map((step) => toStep(step, availableVersions)).filter(Boolean) as Step[];
}

async function getStepInputs({ cvs }: { cvs: string }): Promise<Step['inputs']> {
  const { inputsClient } = getAlgoliaClients();
  const results: AlgoliaStepInputResponse[] = [];
  await inputsClient.browseObjects<AlgoliaStepInputResponse>({
    filters: `cvs:${cvs}`,
    batch: (batch) => results.push(...batch),
  });

  return sortBy(results, 'order').map(({ opts, cvs: _, is_latest, objectID, order, ...input }) => {
    return { opts, ...input };
  }) as Exclude<Step['inputs'], undefined>;
}

export default {
  getAllSteps,
  getStep,
  getStepInputs,
};
