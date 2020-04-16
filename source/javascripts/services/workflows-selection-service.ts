import { Step, Workflow } from "../models";
import { WorkflowSelectionStore } from "./workflow-selection-store";

export type WfChainWrapper = {
	workflow: Workflow;
	isBeforeRunWorkflow?: boolean;
	isAfterRunWorkflow?: boolean;
	selectedWorkflowBeforeRunWorkflowIndex?: number;
	selectedWorkflowAfterRunWorkflowIndex?: number;
};

type WorkflowViewModel = {
	selectedWorkflow: Workflow;
	workflows: Array<Workflow>;
	editedWorkflow: Workflow;
	editWorkflowAtIndex: (arg0: number | null) => void;
	stepSelected: (arg0: Step, wfIndex: number | undefined, scrollToStep: boolean) => void;
	selectedWorkflowChain: Array<WfChainWrapper>;
};

type AngularLocationService = {
	search: () => { workflow_id: string };
};

const wfChainWrapper = (wrapper: WfChainWrapper): WfChainWrapper => ({
	workflow: null,
	isBeforeRunWorkflow: true,
	isAfterRunWorkflow: false,
	selectedWorkflowBeforeRunWorkflowIndex: -1,
	selectedWorkflowAfterRunWorkflowIndex: -1,
	...wrapper
});

class WorkflowsSelectionService {
	private store: WorkflowSelectionStore;
	private location: AngularLocationService;

	constructor(store: WorkflowSelectionStore, locationService: AngularLocationService) {
		this.store = store;
		this.location = locationService;
	}

	private verifySelectedIndex = <T>(
		potentialIndex: number | null,
		list: Array<T> | null,
		checker: (arg0: T) => boolean
	): number | null => {
		if (!potentialIndex) {
			return null;
		}

		const lastEditedWorkflow = list && list[potentialIndex];
		return lastEditedWorkflow && checker(lastEditedWorkflow) ? potentialIndex : null;
	};

	findSelectedWorkflow = (viewModel: WorkflowViewModel): Workflow => {
		const idsTotry = [
			viewModel.selectedWorkflow?.id,
			this.store.lastSelectedWorkflowID,
			this.location.search().workflow_id,
			"primary"
		];

		let selectedWf = null;
		let idIndex = 0;

		while (!selectedWf && idIndex < idsTotry.length) {
			selectedWf = viewModel.workflows.find(item => item.id === idsTotry[idIndex]);
			idIndex++;
		}

		return selectedWf || viewModel.workflows[0];
	};

	configureSelection = (viewModel: WorkflowViewModel): void => {
		this.selectWorkflow(viewModel, this.findSelectedWorkflow(viewModel));

		if (
			this.verifySelectedIndex(
				this.store.lastEditedWorkflowIndex,
				viewModel.selectedWorkflowChain,
				this.store.checkLastSelectedWorkflow
			)
		) {
			viewModel.editWorkflowAtIndex(this.store.lastEditedWorkflowIndex);
		}

		const editedWorkflow = viewModel.editedWorkflow;

		if (
			this.store.lastSelectedStepIndex &&
			this.verifySelectedIndex(
				this.store.lastSelectedStepIndex,
				editedWorkflow?.steps,
				this.store.checkLastSelectedstep
			)
		) {
			const step = editedWorkflow?.steps[this.store.lastSelectedStepIndex];
			const scrollToStep = !(this.store.lastEditedWorkflowIndex === 0 && this.store.lastSelectedStepIndex === 0);

			viewModel.stepSelected(step, undefined, scrollToStep);
		}
	};

	selectWorkflow = (viewModel: WorkflowViewModel, wf: Workflow): void => {
		viewModel.selectedWorkflow = wf;

		// save it to the store
		this.store.applyState({ lastSelectedWorkflow: wf });

		// update selection chain
		viewModel.selectedWorkflowChain = [];

		const constructWorkflowChain = (wfs: Array<Workflow>, before: boolean): Array<WfChainWrapper> =>
			wfs.flatMap((innerWf: Workflow, index: number) =>
				innerWf.workflowChain(viewModel.workflows).map((aWorkflow: Workflow) =>
					wfChainWrapper({
						workflow: aWorkflow,
						isBeforeRunWorkflow: before,
						isAfterRunWorkflow: !before,
						selectedWorkflowBeforeRunWorkflowIndex: before && aWorkflow == innerWf ? index : -1,
						selectedWorkflowAfterRunWorkflowIndex: !before && aWorkflow == innerWf ? index : -1
					})
				)
			);

		const beforeWfs = constructWorkflowChain(wf.beforeRunWorkflows(viewModel.workflows), true);
		const afterWfs = constructWorkflowChain(wf.afterRunWorkflows(viewModel.workflows), false);

		viewModel.selectedWorkflowChain.push(
			...beforeWfs,
			wfChainWrapper({ workflow: viewModel.selectedWorkflow }),
			...afterWfs
		);
	};
}

export default (store: WorkflowSelectionStore, location: AngularLocationService): WorkflowsSelectionService =>
	new WorkflowsSelectionService(store, location);
