import {
	Box,
	Button,
	Card,
	Checkbox,
	DefinitionTooltip,
	Dialog,
	DialogBody,
	DialogFooter,
	Divider,
	Icon,
	Input,
	ProgressIndicator,
	ProgressIndicatorProps,
	Select,
	Text,
	Tooltip,
} from "@bitrise/bitkit";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";

import { Condition, FormItems, PushConditionType, TriggerItem } from "./TriggersPage.types";

type DialogProps = {
	isOpen: boolean;
	onClose: () => void;
	pipelineables: string[];
	onSubmit: (action: "add" | "edit", trigger: TriggerItem) => void;
	editedItem?: TriggerItem;
};

const PLACEHOLDER_MAP: Record<PushConditionType, string> = {
	push_branch: "Push branch",
	commit_message: "Commit message",
	changed_files: "Path",
};

const getLabelText = (isRegex: boolean, type: PushConditionType): string => {
	if (isRegex) {
		return "Regex pattern";
	}
	return PLACEHOLDER_MAP[type];
};

type ConditionCardProps = {
	children: ReactNode;
	conditionNumber: number;
};

const OPTIONS_MAP: Record<PushConditionType, string> = {
	push_branch: "Push branch",
	commit_message: "Commit message",
	changed_files: "File change",
};

const ConditionCard = (props: ConditionCardProps) => {
	const { children, conditionNumber } = props;
	const { register, watch } = useFormContext();
	const { conditions } = watch();
	const { isRegex, type } = conditions[conditionNumber] || {};

	return (
		<Card key={conditionNumber} marginBottom="16" padding="16px 16px 24px 16px">
			<Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="12">
				<Text textStyle="heading/h5">Condition {conditionNumber + 1}</Text>
				{children}
			</Box>
			<Select
				marginBottom="16"
				placeholder="Select a condition type"
				{...register(`conditions.${conditionNumber}.type`)}
			>
				{Object.entries(OPTIONS_MAP).map(([type, text]) => {
					const isConditionTypeUsed = conditions.some((condition: Condition) => condition.type === type);
					const isTypeOfCurrentCard = type === conditions[conditionNumber].type;

					if (isConditionTypeUsed && !isTypeOfCurrentCard) {
						return undefined;
					}

					return (
						<option key={type} value={type}>
							{text}
						</option>
					);
				})}
			</Select>
			{!!type && (
				<>
					<Checkbox marginBottom="8" {...register(`conditions.${conditionNumber}.isRegex`)}>
						Use regex pattern
					</Checkbox>
					<Tooltip label="Regular Expression (regex) is a sequence of characters that specifies a match pattern in text.">
						<Icon name="Info" size="16" marginLeft="5" />
					</Tooltip>
					<Input
						{...register(`conditions.${conditionNumber}.value`)}
						isRequired
						label={getLabelText(isRegex, type)}
						placeholder="*"
					></Input>
				</>
			)}
		</Card>
	);
};

const AddPushTriggerDialog = (props: DialogProps) => {
	const { isOpen, onClose, pipelineables, onSubmit, editedItem } = props;
	const [activeStageIndex, setActiveStageIndex] = useState<0 | 1>(0);

	const isEditMode = !!editedItem;

	const dialogStages: ProgressIndicatorProps["stages"] = [
		{ action: activeStageIndex === 1 ? { onClick: () => setActiveStageIndex(0) } : undefined, label: "Conditions" },
		{ label: "Target" },
	];

	const defaultValues: FormItems = useMemo(() => {
		return {
			conditions: [
				{
					isRegex: false,
					type: "push_branch",
					value: "*",
				},
			],
			id: crypto.randomUUID(),
			pipelineable: "",
			source: "push",
			isActive: true,
			...editedItem,
		};
	}, [editedItem]);

	const formMethods = useForm<FormItems>({
		defaultValues,
	});

	const { control, register, reset, handleSubmit, watch } = formMethods;

	useEffect(() => {
		reset(defaultValues);
	}, [reset, defaultValues, isOpen, editedItem]);

	const { append, fields, remove } = useFieldArray({
		control,
		name: "conditions",
	});

	const onFormCancel = () => {
		onClose();
		reset(defaultValues);
		setActiveStageIndex(0);
	};

	const onFormSubmit = (data: FormItems) => {
		const filteredData = data;
		filteredData.conditions = data.conditions
			.filter(({ type }) => !!type)
			.map((condition) => {
				if (condition.value === "") {
					condition.value = "*";
				}
				return condition;
			});
		onSubmit(isEditMode ? "edit" : "add", filteredData as TriggerItem);
		onFormCancel();
	};

	const onAppend = () => {
		append({
			isRegex: false,
			type: undefined,
			value: "*",
		});
	};

	const { conditions, pipelineable } = watch();

	return (
		<FormProvider {...formMethods}>
			<Dialog
				as="form"
				isOpen={isOpen}
				onClose={onFormCancel}
				title={isEditMode ? "Edit trigger" : "Add push trigger"}
				maxWidth="480"
				onSubmit={handleSubmit(onFormSubmit)}
			>
				<DialogBody>
					<Box marginBottom="24">
						<ProgressIndicator variant="horizontal" stages={dialogStages} activeStageIndex={activeStageIndex} />
					</Box>
					<Divider marginBottom="24" />
					{activeStageIndex === 0 ? (
						<>
							<Text color="text/primary" textStyle="heading/h3" marginBottom="4">
								Set up trigger conditions
							</Text>
							<Text color="text/secondary" marginBottom="24">
								Configure the{" "}
								<DefinitionTooltip label="Configure the conditions that should all be met to execute the targeted Pipeline or Workflow.">
									conditions
								</DefinitionTooltip>{" "}
								that should all be met to execute the targeted Pipeline or Workflow.
							</Text>
							{fields.map((item, index) => {
								return (
									<ConditionCard conditionNumber={index} key={item.id}>
										{conditions.length > 1 && (
											<Button leftIconName="MinusRemove" onClick={() => remove(index)} size="sm" variant="tertiary">
												Remove
											</Button>
										)}
									</ConditionCard>
								);
							})}

							<Button
								variant="secondary"
								leftIconName="PlusAdd"
								width="100%"
								onClick={onAppend}
								isDisabled={fields.length >= Object.keys(OPTIONS_MAP).length}
							>
								Add condition
							</Button>
						</>
					) : (
						<>
							<Text color="text/primary" textStyle="heading/h3" marginBottom="4">
								Targeted Pipeline or Workflow
							</Text>
							<Text color="text/secondary" marginBottom="24">
								Select the Pipeline or Workflow you want Bitrise to run when trigger conditions are met.
							</Text>
							<Select placeholder="Select a Pipeline or Workflow" {...register("pipelineable")}>
								{pipelineables.map((p) => (
									<option key={p} value={p}>
										{p}
									</option>
								))}
							</Select>
						</>
					)}
				</DialogBody>
				<DialogFooter display="flex" justifyContent="flex-end">
					<Button onClick={onFormCancel} variant="tertiary" marginInlineEnd="auto">
						Cancel
					</Button>
					{activeStageIndex === 0 ? (
						<Button rightIconName="ArrowRight" onClick={() => setActiveStageIndex(1)}>
							Next
						</Button>
					) : (
						<>
							<Button leftIconName="ArrowLeft" variant="secondary" onClick={() => setActiveStageIndex(0)}>
								Previous
							</Button>
							<Button type="submit" isDisabled={!pipelineable}>
								{isEditMode ? "Done" : "Add trigger"}
							</Button>
						</>
					)}
				</DialogFooter>
			</Dialog>
		</FormProvider>
	);
};

export default AddPushTriggerDialog;
