import { Workflow } from '@/core/Workflow';

type YmlWorkflowSteps = Required<Workflow>['steps'];
type YmlWorkflowStepItem = YmlWorkflowSteps[number][string];
type YmlStepObject = Extract<YmlWorkflowStepItem, { inputs?: unknown[] }>;
type YmlStepBundleObject = {};
type YmlWithGroupObject = Extract<
  YmlWorkflowStepItem,
  {
    container?: string;
    services?: string[];
    steps: string;
  }
>;

const STEP_BUNDLE_PATTERN = /^bundle::/g;
const WITH_GROUP_PATTERN = /^with$/g;
const GIT_STEP_PATTERN = /^git::/g;
const LOCAL_STEP_PATTERN = /^path::/g;

function parseStepCVS({ cvs }: { cvs: string }) {
  const cleaned = cvs.replace(/^(git::|path::|bundle::|with)/g, '');
  const parts = cleaned.split('@');
  return [parts[0], parts[1] || undefined] as const;
}

function isStepLib(cvs: string, _item?: YmlWorkflowStepItem): _item is YmlStepObject {
  return !isStepBundle(cvs) && !isWithGroup(cvs) && !isGitStep(cvs) && !isLocalStep(cvs);
}

function isGitStep(cvs: string, _item?: YmlWorkflowStepItem): _item is YmlStepObject {
  return GIT_STEP_PATTERN.test(cvs);
}

function isLocalStep(cvs: string, _item?: YmlWorkflowStepItem): _item is YmlStepObject {
  return LOCAL_STEP_PATTERN.test(cvs);
}

function isStepBundle(cvs: string, _item?: YmlWorkflowStepItem): _item is YmlStepBundleObject {
  return STEP_BUNDLE_PATTERN.test(cvs);
}

function isWithGroup(cvs: string, _item?: YmlWorkflowStepItem): _item is YmlWithGroupObject {
  return WITH_GROUP_PATTERN.test(cvs);
}

export { YmlWorkflowSteps, YmlStepObject, YmlStepBundleObject, YmlWithGroupObject };
export default {
  parseStepCVS,
  isStepLib,
  isGitStep,
  isLocalStep,
  isStepBundle,
  isWithGroup,
};
