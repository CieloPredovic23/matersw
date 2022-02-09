import {
	PlacementManager,
	PlacementReference,
	Text,
	Icon,
	Placement,
	Flex,
	Input,
	InputContainer,
	InputContent,
} from "@bitrise/bitkit";
import React, { useState, useMemo, useEffect } from "react";
import { Workflow } from "../../models";
import WorkflowSelectorItem from "./WorkflowSelectorItem/WorkflowSelectorItem";
import "./WorkflowSelector.scss";

export type WorkflowSelectorProps = {
	selectedWorkflow: Workflow;
	workflows: Workflow[];
	selectWorkflow: (workflow: Workflow) => void;
	renameWorkflowConfirmed: (workflow: Workflow, newWorkflowID: string) => void;
}

const WorkflowSelector: React.FC<WorkflowSelectorProps> = ({
	selectedWorkflow,
	workflows,
	selectWorkflow,
	renameWorkflowConfirmed,
}: WorkflowSelectorProps) => {
	const [visible, setVisible] = useState(false);
	const [search, setSearch] = useState("");

	const onItemClick = (workflow: Workflow): void => {
		selectWorkflow(workflow);
		setVisible(false);
		setSearch("");
	};

	const onEscPress = ({ key }: KeyboardEvent): void => {
		if (key === "Escape") {
			setVisible(false);
			setSearch("");
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", onEscPress, false);
		return () => {
			document.removeEventListener("keydown", onEscPress, false);
		};
	}, []);

	const filteredWorkflows = useMemo(() => {
		let result = [...workflows];
		if (search) {
			const regExp = new RegExp(search, "i");
			result = workflows.filter((workflow) => regExp.test(workflow.id));
		}

		return result;
	}, [workflows, search]);

	const workflowIds = useMemo(() => {
		return workflows.map((workflow) => workflow.id);
	}, [workflows]);

	const onClearSearch = (): void => {
		setTimeout(() => setSearch(""), 0);
	};

	const onClose = (): void => {
		setVisible(false);
		setSearch("");
	};

	return (
		<PlacementManager>
			<PlacementReference>
				{({ ref }) => (
					<Flex
						height="47px"
						borderRadius="x1"
						borderColor="gray-3"
						innerRef={ref}
						overflow="hidden"
						direction="horizontal"
						data-e2e-tag="workflow-selector"
						shrink
					>
						<Flex
							backgroundColor="gray-6"
							textColor='white'
							padding='x4'
							direction="horizontal"
							alignChildrenHorizontal="middle"
							alignChildrenVertical="middle"
						>
							<Text size='2' uppercase>
								Workflow
							</Text>
						</Flex>
						<Flex
							className="WorkflowSelectorDropdown"
							padding="x3"
							direction="horizontal"
							grow
							clickable
							alignChildrenVertical="middle"
							alignChildrenHorizontal="between"
							onClick={() => setVisible(true)}
							data-e2e-tag="workflow-selector-dropdown"
						>
							<Text
								textColor="grape-5"
								width="114px"
								overflow="hidden"
								ellipsis
								data-e2e-tag="workflow-selector-selected-workflow-name"
							>
								{selectedWorkflow.id}
							</Text>
							<Icon size="24px" name="ChevronDown" />
						</Flex>
					</Flex>
				)}
			</PlacementReference>

			<Placement onClose={onClose} visible={visible}>
				{() => (
					<Flex width="560px">
						<Flex padding="x3">
							<InputContainer>
								<InputContent>
									<Icon name="Magnifier" />
									<Input
										autoFocus
										placeholder="Search workflows..."
										value={search}
										onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setSearch(ev.target.value)}
									/>
									{search && (
										<Text className="SearchField_reset" config="8" uppercase clickable onClick={onClearSearch}>
											Reset
										</Text>
									)}
								</InputContent>
							</InputContainer>
						</Flex>
						{filteredWorkflows.length ? (
							<Flex maxHeight="360px" overflow="scroll" data-e2e-tag="workflow-selector-list">
								{filteredWorkflows.map((workflow) => (
									<WorkflowSelectorItem
										key={workflow.id}
										workflow={workflow}
										selectWorkflow={onItemClick}
										selectedWorkflowId={selectedWorkflow.id}
										workflowIds={workflowIds}
										renameWorkflowConfirmed={renameWorkflowConfirmed}
										data-e2e-tag="workflow-selector-option"
									/>
								))}
							</Flex>
						) : (
							<Flex textColor="gray-6" gap="x3" direction="vertical" alignChildren="middle" padding="x5">
								<Icon name="BitbotFailed" size="2.5rem" />
								<Flex direction="vertical" alignChildren="middle" gap="x1">
									<Text weight="bold">No workflows found.</Text>
									<Text>Modify or reset the search.</Text>
								</Flex>
							</Flex>
						)}
					</Flex>
				)}
			</Placement>
		</PlacementManager>
	);
};

export default WorkflowSelector;
