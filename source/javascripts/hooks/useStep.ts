import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import maxSatisfying from 'semver/ranges/max-satisfying';
import { useQuery } from '@tanstack/react-query';
import merge from 'lodash/merge';

import useBitriseYmlStore from '@/hooks/useBitriseYmlStore';
import StepService from '@/core/StepService';
import { useAlgoliaStep, useAlgoliaStepInputs } from '@/hooks/useAlgolia';
import { Step } from '@/core/Step';

type UseStepResult = {
  cvs: string;
  step?: Step;
  isLoading?: boolean;
  availableVersions?: string[];
};

const useStepFromYml = (workflowId: string, stepIndex: number): UseStepResult => {
  return useBitriseYmlStore(
    useShallow(({ yml }) => {
      const stepObjectFromYml = yml.workflows?.[workflowId]?.steps?.[stepIndex];

      if (!stepObjectFromYml) {
        return { cvs: '' };
      }

      const [cvs, step] = Object.entries(stepObjectFromYml)[0];

      if (!isStepLib(cvs, step) && !isGitStep(cvs, step) && !isLocalStep(cvs, step)) {
        return { cvs };
      }

      return { cvs, step };
    }),
  );
};

const useStepFromApi = (cvs = ''): UseStepResult => {
  const [id, version] = StepService.parseStepCVS(cvs);
  const { data: stepVersions, isLoading: isLoadingInfo } = useAlgoliaStep({
    id,
    filter: 'all_versions',
    enabled: Boolean(id && isStepLib(cvs)),
  });

  const versions = stepVersions?.map((s) => s.extras?.version ?? '');
  const latestVersion = stepVersions?.find((s) => s.extras?.isLatest)?.extras?.version;
  const selectedVersion = normalizeStepVersion(version ?? '');
  const resolvedVersion = !version ? latestVersion : maxSatisfying(versions ?? [], selectedVersion) || undefined;
  const resolvedStepInfo = stepVersions?.find((s) => s.extras?.version === resolvedVersion);

  const { data: inputs, isLoading: isLoadingInputs } = useAlgoliaStepInputs({
    cvs: resolvedStepInfo?.extras?.cvs ?? cvs,
    enabled: Boolean(resolvedStepInfo?.extras?.cvs),
  });

  return useMemo(() => {
    return {
      selectedVersion,
      resolvedVersion,
      availableVersions: versions,
      cvs: resolvedStepInfo?.extras?.cvs || cvs,
      step: { ...resolvedStepInfo, inputs },
      isLoading: isLoadingInfo || isLoadingInputs,
      icon: resolvedStepInfo?.asset_urls?.['icon.svg'] || resolvedStepInfo?.asset_urls?.['icon.png'],
      ...resolvedStepInfo.extras,
    };
  }, [cvs, inputs, isLoadingInfo, isLoadingInputs, resolvedStepInfo, resolvedVersion, selectedVersion, versions]);
};

const useStepFromLocalApi = (cvs = ''): UseStepResult => {
  const [id, version] = parseStepCVS(cvs);

  let library: string = '';
  if (isLocalStep(cvs)) {
    library = 'path';
  } else if (isGitStep(cvs)) {
    library = 'git';
  }

  const { data, isLoading } = useQuery({
    enabled: Boolean(id && library),
    queryKey: ['/api/step-info', id, library, version],
    queryFn: async ({ signal }) => {
      const response = await fetch('/api/step-info', {
        signal,
        method: 'POST',
        body: JSON.stringify({ id, library, version }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return (await response.json()) as {
        step?: Step;
        info?: { asset_urls?: { [x: string]: string } };
      };
    },
  });

  return useMemo(() => {
    return {
      cvs,
      isLoading,
      step: data?.step,
      selectedVersion: version,
      resolvedVersion: version,
      icon: data?.info?.asset_urls?.['icon.svg'] || data?.info?.asset_urls?.['icon.png'],
    };
  }, [cvs, isLoading, data, version]);
};

const useStep = (workflowId: string, stepIndex: number): UseStepResult | undefined => {
  const { cvs, step: stepFromYml } = useStepFromYml(workflowId, stepIndex);

  const stepFromAlgolia = useStepFromAlgolia(cvs);
  const stepFromLocalApi = useStepFromLocalApi(cvs);

  return useMemo(() => {
    if (!cvs) {
      return undefined;
    }

    const stepDefaults = stepFromAlgolia?.step || stepFromLocalApi?.step;

    const inputs = stepDefaults?.inputs?.map(({ opts, ...input }) => {
      const [inputName, defaultValue] = Object.entries(input)[0];

      const inputFromYml = stepFromYml?.inputs?.find(({ opts: _, ...inputObjectFromYml }) => {
        const inputNameFromYml = Object.keys(inputObjectFromYml)[0];
        return inputNameFromYml === inputName;
      });

      return { opts, [inputName]: inputFromYml?.[inputName] ?? defaultValue };
    });

    const mergedStep = { ...merge({}, stepDefaults, stepFromYml), inputs };

    return {
      cvs,
      step: mergedStep,
      maintainer: stepFromAlgolia?.maintainer,
      availableVersions: stepFromAlgolia?.availableVersions,
      isLoading: stepFromAlgolia?.isLoading || stepFromLocalApi?.isLoading,
      selectedVersion: stepFromAlgolia?.selectedVersion || stepFromLocalApi?.selectedVersion,
      resolvedVersion: stepFromAlgolia?.resolvedVersion || stepFromLocalApi?.resolvedVersion,
      icon:
        mergedStep?.asset_urls?.['icon.svg'] ||
        mergedStep?.asset_urls?.['icon.png'] ||
        stepFromAlgolia?.icon ||
        stepFromLocalApi?.icon ||
        defaultIcon,
    };
  }, [cvs, stepFromAlgolia, stepFromLocalApi, stepFromYml]);
};

export default useStep;
