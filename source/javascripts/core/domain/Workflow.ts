import { BitriseYml, Meta } from './BitriseYml';

export type Workflows = Required<BitriseYml>['workflows'];
export type Workflow = Workflows[string] & {
  meta?: Meta;
  run_if?: string;
};

export const WORKFLOW_NAME_REQUIRED = 'Workflow name is required';
export const WORKFLOW_NAME_PATTERN = {
  value: /^[A-Za-z0-9-_.]+$/,
  message: 'Workflow name must only contain letters, numbers, dashes, underscores or periods',
};
