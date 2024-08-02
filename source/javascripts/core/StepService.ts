import gtr from 'semver/ranges/gtr';
import defaultStepIcon from '../../images/step/icon-default.svg';
import YMLStepService from './BitriseYml.step';

function resolveIcon(obj?: { icon?: string }) {
  return obj?.icon || defaultStepIcon;
}

function resolveName(title?: string, info: { cvs: string; id?: string } = { cvs: '' }) {
  if (YMLStepService.isStepBundle(info?.cvs)) {
    return `Step bundle: ${info.cvs.replace('bundle::', '')}`;
  }
  if (YMLStepService.isWithGroup(info.cvs)) {
    return 'With group';
  }

  return title || info.id || info.cvs.split('/').pop() || info.cvs;
}

function isUpgradeableStep(resolvedVersion?: string, availableVersions?: string[]) {
  if (!availableVersions || !resolvedVersion) {
    return false;
  }

  return availableVersions.some((possibleVersion) => gtr(possibleVersion, resolvedVersion));
}

export default {
  resolveIcon,
  resolveName,
  isUpgradeableStep,
};
