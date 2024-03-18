import { Meta, StoryObj } from "@storybook/react";

import TriggersPage from "./TriggersPage";

export default {
	component: TriggersPage,
	args: {
		pipelineables: ["foo", "bar"],
		onTriggerMapChange: console.log,
	},
} as Meta<typeof TriggersPage>;

export const TriggersPageEmptyState: StoryObj<typeof TriggersPage> = {};

export const TriggersPageWithTriggerMap: StoryObj<typeof TriggersPage> = {
	args: {
		triggerMap: [
			{
				push_branch: "*",
				enabled: false,
				workflow: "foo",
			},
			{
				pull_request_target_branch: "*",
				pull_request_source_branch: "*",
				workflow: "bar",
			},
		],
	},
};
