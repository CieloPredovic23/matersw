import semver from 'semver/preload';
import semverService from '../services/semver-service';

function normalizeVersion({ version }: { version?: string }) {
  if (!version) {
    return version;
  }

  if (/^(\d+)(\.\d+)?$/g.test(version)) {
    const match = version.split('.');
    const major = match[0];
    const minor = match[1] || 'x';
    return `${major}.${minor}.x`;
  }

  return version;
}

function resolveVersion({ version }: { version?: string }, latestVersion: string, availableVersions: string[] = []) {
  const normalizedVersion = normalizeVersion({ version });

  if (!normalizedVersion) {
    return latestVersion;
  }

  return semver.maxSatisfying(availableVersions, normalizedVersion) || normalizedVersion;
}

const getVersionRemark = ({ version }: { version: string }) => {
  if (semverService.checkVersionPartsLocked(version, 2)) {
    return 'Minor and patch updates';
  }
  if (semverService.checkVersionPartsLocked(version, 1)) {
    return 'Patch updates only';
  }

  return 'Version in bitrise.yml';
};

export default {
  normalizeVersion,
  resolveVersion,
  getVersionRemark,
};
