import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import StepConfigDrawer from './StepConfigDrawer';
import { mockYml } from './StepConfigDrawer.mocks';
import { withBitriseYml } from '@/contexts/BitriseYmlProvider';

type Story = StoryObj<typeof StepConfigDrawer>;

const meta: Meta<typeof StepConfigDrawer> = {
  component: StepConfigDrawer,
  args: {
    isOpen: true,
    workflowId: 'wf1',
    stepIndex: 0,
  },
  argTypes: {
    onClose: {
      type: 'function',
    },
    stepIndex: {
      control: 'inline-radio',
      options: ['git-clone', 'script'],
      mapping: { 'git-clone': 0, script: 1 },
    },
  },
  decorators: [
    (Story) => withBitriseYml(mockYml, Story),
    (Story, { args }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isOpen, setIsOpen] = useState(args.isOpen);
      return <Story args={{ ...args, isOpen, onClose: () => setIsOpen(false) }} />;
    },
  ],
};

export default meta;

export const Default: Story = {};
