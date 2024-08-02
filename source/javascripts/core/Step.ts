import { YmlStepObject } from '@/core/BitriseYml.step';

enum Maintainer {
  Bitrise = 'bitrise',
  Verified = 'verified',
  Community = 'community',
}

type StepInputOptions = Partial<{
  title: string;
  summary: string;
  category: string;
  description: string;
  value_options: string[];
  unset: boolean;
  is_expand: boolean;
  is_template: boolean;
  is_required: boolean;
  is_sensitive: boolean;
  skip_if_empty: boolean;
  is_dont_change_value: boolean;
}>;

type StepOutputOptions = StepInputOptions;

type Step = YmlStepObject & {
  info?: {
    id: string;
    cvs: string;
    icon?: string;
    isOfficial: boolean;
    isVerified: boolean;
    isCommunity: boolean;
    isDeprecated: boolean;
  };
  versionInfo?: {
    availableVersions?: string[];
    version: string; // 2
    selectedVersion?: string; // 2.x.x
    resolvedVersion?: string; // 2.1.9
    latestVersion?: string; // 2.1.9
    isLatest: boolean;
  };
  inputs?: { [x: string]: unknown; opts?: StepInputOptions }[];
  outputs?: { [x: string]: unknown; opts?: StepOutputOptions }[];
};

export { Maintainer, Step, StepInputOptions, StepOutputOptions };
