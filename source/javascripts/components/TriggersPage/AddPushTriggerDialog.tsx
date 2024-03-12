import {
	Box,
	Button,
	Card,
	Checkbox,
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
	Toggletip,
	Tooltip,
} from "@bitrise/bitkit";
import { ReactNode, useState } from "react";
import { FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form";
import { ConditionType, TriggerItem } from "./TriggersPage.types";

type DialogProps = {
	isOpen: boolean;
	onClose: () => void;
	pipelineables: string[];
	onSubmit: (trigger: TriggerItem) => void;
};

const PLACEHOLDER_MAP: Record<ConditionType, string> = {
	push_branch: "Enter a push branch",
	commit_message: "Enter a commit message",
	file_change: "Enter a path",
};

const getPlaceholderText = (checkbox: boolean, type: ConditionType): string => {
	if (checkbox) {
		return "Enter a regex pattern";
	}
	return PLACEHOLDER_MAP[type];
};

type ConditionCardProps = {
	children: ReactNode;
	conditionNumber: number;
};

const ConditionCard = (props: ConditionCardProps) => {
	const { children, conditionNumber } = props;
	const { register, watch } = useFormContext();
	const { conditions } = watch();
	const { checkbox, type } = conditions[conditionNumber];

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
				<option value="push_branch">Push branch</option>
				<option value="commit_message">Commit message</option>
				<option value="file_change">File change</option>
			</Select>
			{!!type && (
				<>
					<Checkbox marginBottom="8" {...register(`conditions.${conditionNumber}.checkbox`)}>
						Use regex pattern
					</Checkbox>
					<Toggletip label="Regular Expression (regex) is a sequence of characters that specifies a match pattern in text.">
						<Icon name="Info" size="16" marginLeft="5" />
					</Toggletip>
					<Input
						{...register(`conditions.${conditionNumber}.value`)}
						placeholder={getPlaceholderText(checkbox, type)}
					></Input>
				</>
			)}
		</Card>
	);
};

interface FormItems extends Omit<TriggerItem, "conditions"> {
	conditions: {
		isRegex: boolean;
		type?: ConditionType;
		value: string;
	}[];
}

const AddPushTriggerDialog = (props: DialogProps) => {
	const { isOpen, onClose, pipelineables, onSubmit } = props;
	const [activeStageIndex, setActiveStageIndex] = useState<0 | 1>(0);

	const dialogStages: ProgressIndicatorProps["stages"] = [
		{ action: activeStageIndex === 1 ? { onClick: () => setActiveStageIndex(0) } : undefined, label: "Conditions" },
		{ label: "Target" },
	];

	const formMethods = useForm<FormItems>({
		defaultValues: {
			conditions: [
				{
					isRegex: false,
					type: "push_branch",
					value: "",
				},
			],
		},
	});
	const { control, register, reset, handleSubmit, watch } = formMethods;

	const { append, fields, remove } = useFieldArray({
		control,
		name: "conditions",
	});

	const onFormCancel = () => {
		onClose();
		reset();
		setActiveStageIndex(0);
	};

	const onFormSubmit = (data: FormItems) => {
		onSubmit(data as TriggerItem);
		onFormCancel();
	};

	const onAppend = () => {
		append({
			isRegex: false,
			type: undefined,
			value: "",
		});
	};

	const pipelineable = watch("pipelineable");

	return (
		<FormProvider {...formMethods}>
			<Dialog
				as="form"
				isOpen={isOpen}
				onClose={onFormCancel}
				title="Add push trigger"
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
								<Tooltip label="Configure the conditions that should all be met to execute the targeted Pipeline or Workflow.">
									conditions
								</Tooltip>{" "}
								that should all be met to execute the targeted Pipeline or Workflow.
							</Text>
							{fields.map(({ id }, index) => {
								return (
									<ConditionCard conditionNumber={index} key={id}>
										{index > 0 && (
											<Button leftIconName="MinusRemove" onClick={() => remove(index)} size="sm" variant="tertiary">
												Remove
											</Button>
										)}
									</ConditionCard>
								);
							})}

							<Button variant="secondary" leftIconName="PlusAdd" width="100%" onClick={onAppend}>
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
								Add trigger
							</Button>
						</>
					)}
				</DialogFooter>
			</Dialog>
		</FormProvider>
	);
};

export default AddPushTriggerDialog;
