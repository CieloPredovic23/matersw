import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dropdown,
  DropdownGroup,
  DropdownNoResultsFound,
  DropdownOption,
  DropdownSearch,
  EmptyState,
} from '@bitrise/bitkit';
import { useDebounceValue } from 'usehooks-ts';
import useWorkflowIds from '@/pages/WorkflowsPage/hooks/useWorkflowIds';
import { useWorkflowsPageStore } from '@/pages/WorkflowsPage/WorkflowsPage.store';
import useSelectedWorkflow from '@/pages/WorkflowsPage/hooks/useSelectedWorkflow';

const WorkflowSelector = () => {
  const workflowIds = useWorkflowIds();
  const { openCreateWorkflowDialog } = useWorkflowsPageStore();
  const [{ id: selectedWorkflowId }, setSelectedWorkflow] = useSelectedWorkflow();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounceValue('', 100);

  const [utilityWorkflows, runnableWorkflows] = useMemo(() => {
    const utility: string[] = [];
    const runnable: string[] = [];

    workflowIds.forEach((workflowName) => {
      if (workflowName.toLowerCase().includes(debouncedSearch.toLowerCase())) {
        if (workflowName.startsWith('_')) {
          utility.push(workflowName);
        } else {
          runnable.push(workflowName);
        }
      }
    });

    return [utility, runnable];
  }, [debouncedSearch, workflowIds]);

  const hasUtilityWorkflows = utilityWorkflows.length > 0;
  const hasNoSearchResults = debouncedSearch && utilityWorkflows.length === 0 && runnableWorkflows.length === 0;

  const onSearchChange = (value: string) => {
    setSearch(value);
    setDebouncedSearch(value);
  };

  return (
    <Box flex="1" __css={{ '--dropdown-floating-max': '359px' }}>
      <Dropdown
        size="md"
        value={selectedWorkflowId}
        onChange={({ target: { value } }) => setSelectedWorkflow(value)}
        search={<DropdownSearch placeholder="Filter by name..." value={search} onChange={onSearchChange} />}
      >
        {runnableWorkflows.map((id) => (
          <DropdownOption key={id} value={id}>
            {id}
          </DropdownOption>
        ))}

        {hasUtilityWorkflows && (
          <DropdownGroup label="utility workflows" labelProps={{ whiteSpace: 'nowrap' }}>
            {utilityWorkflows.map((id) => (
              <DropdownOption key={id} value={id}>
                {id}
              </DropdownOption>
            ))}
          </DropdownGroup>
        )}

        {hasNoSearchResults && (
          <DropdownNoResultsFound>
            <EmptyState
              iconName="Magnifier"
              backgroundColor="background/primary"
              title="No Workflows are matching your filter"
              description="Modify your search to get results"
            />
          </DropdownNoResultsFound>
        )}

        <Box
          w="100%"
          mt="8"
          py="12"
          mb="-12"
          bottom="-12"
          position="sticky"
          borderTop="1px solid"
          borderColor="border/regular"
          backgroundColor="background/primary"
        >
          <Button
            w="100%"
            border="none"
            fontWeight="400"
            borderRadius="0"
            variant="secondary"
            leftIconName="PlusAdd"
            justifyContent="flex-start"
            onClick={openCreateWorkflowDialog}
          >
            Create Workflow
          </Button>
        </Box>
      </Dropdown>
    </Box>
  );
};

export default WorkflowSelector;
