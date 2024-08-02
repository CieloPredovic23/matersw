import gtr from 'semver/ranges/gtr';
import YMLStepService from './BitriseYml.step';

function displayName({ cvs, title, id }: { cvs: string; title?: string; id?: string }) {
  if (YMLStepService.isStepBundle(cvs)) {
    return `Step bundle: ${cvs.replace('bundle::', '')}`;
  }
  if (YMLStepService.isWithGroup(cvs)) {
    return 'With group';
  }

  return title || id || cvs.split('/').pop() || cvs;
}

function isUpgradeableStep(resolvedVersion?: string, availableVersions?: string[]) {
  if (!availableVersions || !resolvedVersion) {
    return false;
  }

  return availableVersions.some((possibleVersion) => gtr(possibleVersion, resolvedVersion));
}

export default {
  isUpgradeableStep,
};
