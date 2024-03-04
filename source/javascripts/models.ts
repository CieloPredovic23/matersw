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

export interface Step {
	id: string;
	cvs: string;
	version: string;
	requestedVersion(): string;
	displayName(): string;
	displayTooltip(): string;
	isVerified(): boolean;
	isOfficial(): boolean;
	isConfigured(): boolean;
	isDeprecated(): boolean;
	isLibraryStep(): boolean;
	iconURL(): string;
	summary(): string;
	defaultStepConfig: {
		version: string;
	};
}
