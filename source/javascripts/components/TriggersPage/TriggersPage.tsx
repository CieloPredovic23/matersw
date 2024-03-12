import {
	Button,
	EmptyState,
	Link,
	Notification,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useDisclosure,
} from "@bitrise/bitkit";
import { useState } from "react";

import AddPushTriggerDialog from "./AddPushTriggerDialog";
import TriggerCard from "./TriggerCard";
import { TriggerItem } from "./TriggersPage.types";

type TriggersPageProps = {
	pipelineables: string[];
};

const TriggersPage = (props: TriggersPageProps) => {
	const { pipelineables } = props;
	const { isOpen: isNotificationOpen, onClose: closeNotification } = useDisclosure({ defaultIsOpen: true });
	const { isOpen: isDialogOpen, onOpen: openDialog, onClose: closeDialog } = useDisclosure();
	const [triggers, setTriggers] = useState<TriggerItem[]>([]);
	const [editedItem, setEditedItem] = useState<TriggerItem | undefined>();

	const onCloseDialog = () => {
		closeDialog();
		setEditedItem(undefined);
	};

	const onTriggersChange = (action: "add" | "remove" | "edit", trigger: TriggerItem) => {
		let newTriggers = [...triggers];
		if (action === "add") {
			newTriggers.push(trigger);
		}
		if (action === "remove") {
			newTriggers = triggers.filter(({ id }) => id !== trigger.id);
		}
		if (action === "edit") {
			const index = triggers.findIndex(({ id }) => id === trigger.id);
			console.log(index);
			newTriggers[index] = trigger;
		}
		setTriggers(newTriggers);
	};

	const onTriggerEdit = (trigger: TriggerItem) => {
		setEditedItem(trigger);
		openDialog();
	};

	return (
		<>
			<Text as="h2" textStyle="heading/h2" marginBottom="4">
				Triggers
			</Text>
			<Text color="text/secondary">
				Triggers help you start builds automatically.{" "}
				<Link
					colorScheme="purple"
					href="https://devcenter.bitrise.io/en/builds/starting-builds/triggering-builds-automatically.html"
					isExternal
				>
					Learn more
				</Link>
			</Text>
			{isNotificationOpen && (
				<Notification status="info" onClose={closeNotification} action={{ label: "Set up webhooks" }} marginTop="32">
					<Text fontWeight="bold">Configure webhooks</Text>
					<Text>Enable Bitrise to interact with third-party services and are necessary for triggers to work.</Text>
				</Notification>
			)}
			<Tabs marginTop="24" marginBottom="24">
				<TabList>
					<Tab id="push">Push</Tab>
					<Tab id="pullRequest">Pull request</Tab>
					<Tab id="tag">Tag</Tab>
				</TabList>
				<TabPanels paddingTop="24">
					<TabPanel>
						<Button marginBottom="24" variant="secondary" onClick={openDialog} leftIconName="PlusAdd">
							Add push trigger
						</Button>
						{triggers.length === 0 && (
							<EmptyState iconName="Trigger" title="Your push triggers will appear here" maxHeight="208">
								<Text marginTop="8">
									A push based trigger automatically starts builds when commits are pushed to your repository.
								</Text>
								<Link
									colorScheme="purple"
									href="https://devcenter.bitrise.io/en/builds/starting-builds/triggering-builds-automatically.html"
								>
									Learn more
								</Link>
							</EmptyState>
						)}
						{triggers.length > 0 &&
							triggers.map((triggerItem) => (
								<TriggerCard
									key={triggerItem.id}
									triggerItem={triggerItem}
									onRemove={(trigger) => onTriggersChange("remove", trigger)}
									onEdit={(trigger) => onTriggerEdit(trigger)}
								/>
							))}
					</TabPanel>
					<TabPanel>2</TabPanel>
					<TabPanel>3</TabPanel>
				</TabPanels>
			</Tabs>
			{triggers.length > 1 && (
				<Notification status="info" marginTop="12">
					<Text fontWeight="bold">Order of triggers</Text>
					<Text>
						The first matching trigger is executed by the system, so make sure that the order of triggers is configured
						correctly.{" "}
						<Link
							href="https://devcenter.bitrise.io/en/builds/starting-builds/triggering-builds-automatically.html"
							isUnderlined
						>
							Learn more
						</Link>
					</Text>
				</Notification>
			)}
			<AddPushTriggerDialog
				pipelineables={pipelineables}
				onClose={onCloseDialog}
				isOpen={isDialogOpen}
				onSubmit={onTriggersChange}
				editedItem={editedItem}
			/>
		</>
	);
};

export default TriggersPage;
