import {
	Button,
	Checkbox,
	Dialog,
	DialogBody,
	DialogFooter,
	Icon,
	Input,
	Select,
	Text,
	Tooltip,
} from "@bitrise/bitkit";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { FormItems, TriggerItem } from "./TriggersPage.types";

type DialogProps = {
	isOpen: boolean;
	onClose: () => void;
	editedItem?: TriggerItem;
	pipelines: string[];
	onSubmit: (action: "add" | "edit", trigger: TriggerItem) => void;
	workflows: string[];
};

const AddTagTriggerDialog = (props: DialogProps) => {
	const { isOpen, onClose, editedItem, pipelines, onSubmit, workflows } = props;

	const defaultValues: FormItems = useMemo(() => {
		return {
			conditions: [
				{
					isRegex: false,
					type: "tag",
					value: "",
				},
			],
			id: crypto.randomUUID(),
			pipelineable: "",
			source: "tag",
			isActive: true,
			...editedItem,
		};
	}, [editedItem, isOpen]);

	const formMethods = useForm<FormItems>({
		defaultValues,
	});

	const { register, reset, handleSubmit, watch } = formMethods;

	useEffect(() => {
		reset(defaultValues);
	}, [reset, defaultValues, isOpen, editedItem]);

	const conditionNumber: number = 0;

	const { conditions } = watch();
	const { isRegex } = conditions[conditionNumber] || {};

	const isEditMode = !!editedItem;

	const getLabelText = (isRegex: boolean) => (isRegex ? "Enter a regex pattern" : "Enter a tag");

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

	const onFormCancel = () => {
		onClose();
		reset(defaultValues);
	};

	const pipelineable = watch("pipelineable");

	return (
		<FormProvider {...formMethods}>
			<Dialog
				title={isEditMode ? "Edit trigger" : "Add tag trigger"}
				as="form"
				maxWidth="480"
				isOpen={isOpen}
				onClose={onFormCancel}
				onSubmit={handleSubmit(onFormSubmit)}
			>
				<DialogBody>
					<Text marginBottom="4" textStyle="heading/h3">
						Set up trigger
					</Text>
					<Text marginBottom="24" color="text/secondary">
						Define a tag and select a Pipeline or Workflow for execution on Bitrise whenever the tag is pushed to your
						repository.
					</Text>
					<Text marginBottom="16" textStyle="body/md/semibold">
						Tag
					</Text>
					<Checkbox marginBottom="8" {...register(`conditions.${conditionNumber}.isRegex`)}>
						Use regex pattern
					</Checkbox>
					<Tooltip label="Regular Expression (regex) is a sequence of characters that specifies a match pattern in text.">
						<Icon name="Info" size="16" marginLeft="5" />
					</Tooltip>
					<Input
						marginBottom="24"
						label={getLabelText(isRegex)}
						isRequired
						placeholder="*"
						{...register(`conditions.${conditionNumber}.value`)}
					></Input>
					<Text color="text/primary" textStyle="body/md/semibold" marginBottom="4">
						Targeted Pipeline or Workflow
					</Text>
					<Select placeholder="Select a Pipeline or Workflow" {...register("pipelineable")}>
						{pipelines.length && (
							<optgroup label="Pipelines">
								{pipelines.map((p) => (
									<option key={p} value={p}>
										{p}
									</option>
								))}
							</optgroup>
						)}
						{workflows.length && (
							<optgroup label="Workflows">
								{workflows.map((p) => (
									<option key={p} value={p}>
										{p}
									</option>
								))}
							</optgroup>
						)}
					</Select>
				</DialogBody>
				<DialogFooter display="flex" justifyContent="space-between">
					<Button variant="tertiary" onClick={onFormCancel}>
						Cancel
					</Button>
					<Button type="submit" isDisabled={!pipelineable}>
						{isEditMode ? "Done" : "Add trigger"}
					</Button>
				</DialogFooter>
			</Dialog>
		</FormProvider>
	);
};

export default AddTagTriggerDialog;
