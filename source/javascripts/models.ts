export type GetterSetter<T> = (value?: T) => T;
export type Getter<T> = () => T;

export interface StepCatalouge {
  steps: Record<string, Map<string, Record<string, any>>>;
  latestStepVersions: Record<string, string>;
}

export interface Workflow {
  id: string;
  steps: Array<Step>;
  beforeRunWorkflows: (arg0: Array<Workflow>) => Array<Workflow>;
  afterRunWorkflows: (arg0: Array<Workflow>) => Array<Workflow>;
  workflowChain: (arg0: Array<Workflow>) => Array<Workflow>;
}

export type VersionChangeDialogProps = {
  isMajorChange: boolean;
  releaseNotesUrl: string;
  removedInputs: Array<string>;
  newInputs: Array<string>;
};

export interface Step {
  $$hashKey: string;
  id: string;
  cvs: string;
  version: string;

  defaultStepConfig: {
    version: string;
    source_code_url: string;
    inputs: Array<object>;
  };

  displayName: Getter<string>;
  displayTooltip: Getter<string>;
  title: GetterSetter<string>;
  summary: GetterSetter<string>;
  description: GetterSetter<string>;
  sourceURL: GetterSetter<string>;
  iconURL: GetterSetter<string>;
  runIf: GetterSetter<string>;
  isAlwaysRun: GetterSetter<boolean>;
  isConfigured: Getter<boolean>;
  isVerified: Getter<boolean>;
  isOfficial: Getter<boolean>;
  isDeprecated: Getter<boolean>;
  isLibraryStep: Getter<boolean>;
  isVCSStep: Getter<boolean>;
  requestedVersion: Getter<string | null>;
}

export interface Variable {
  description: GetterSetter<string>;
  isDontChangeValue: GetterSetter<boolean>;
  isRequired: GetterSetter<boolean>;
  isSensitive: GetterSetter<boolean>;
  key: GetterSetter<string>;
  summary: GetterSetter<string>;
  title: GetterSetter<string>;
  value: GetterSetter<string>;
  valueOptions: GetterSetter<string[] | undefined>;
}

export interface InputCategory {
  name: string;
  inputs: Variable[];
}
