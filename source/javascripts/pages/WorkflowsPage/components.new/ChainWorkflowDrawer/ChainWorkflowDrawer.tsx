import { Box, Icon, Notification, SearchInput, Text, useDisclosure } from '@bitrise/bitkit';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  UseDisclosureProps,
} from '@chakra-ui/react';
import useSelectedWorkflow from '../../hooks/useSelectedWorkflow';
import { ChainWorkflowCallback, InitialValues, SearchFormValues } from './ChainWorkflowDrawer.types';
import ChainableWorkflowList from './components/ChainableWorkflowList';

type Props = UseDisclosureProps & {
  onChainWorkflow: ChainWorkflowCallback;
};

const ChainWorkflowDrawer = ({ onChainWorkflow, ...disclosureProps }: Props) => {
  const [{ id: selectedWorkflowId }] = useSelectedWorkflow();
  const { isOpen, onClose } = useDisclosure(disclosureProps);

  const form = useForm<SearchFormValues>({
    defaultValues: {
      ...InitialValues,
    },
  });

  if (!selectedWorkflowId) {
    return null;
  }

  return (
    <FormProvider {...form}>
      <Drawer isFullHeight isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay
          top="0px"
          bg="linear-gradient(to left, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0) 100%);"
        />
        <DrawerContent
          top="0px"
          display="flex"
          flexDir="column"
          maxWidth={['100%', '50%']}
          borderRadius={[0, 12]}
          margin={[0, 32]}
          boxShadow="large"
        >
          <DrawerCloseButton size="md">
            <Icon name="CloseSmall" />
          </DrawerCloseButton>
          <DrawerHeader color="inherit" textTransform="inherit" fontWeight="inherit">
            <Box display="flex" flexDir="column" gap="16">
              <Text as="h3" textStyle="heading/h3" fontWeight="bold">
                Chain Workflows to '{selectedWorkflowId}'
              </Text>
              <Text size="3">
                Add Workflows before or after the Steps of the selected Workflow. Each linked Workflow executes on the
                same VM, ensuring a cohesive build process.
              </Text>
              <Notification status="info" flexShrink="0">
                Changes to a chained Workflow affect all other Workflows using it.
              </Notification>
              <Controller<SearchFormValues>
                name="search"
                render={({ field: { ref, onChange, ...rest } }) => (
                  <SearchInput
                    inputRef={ref}
                    placeholder="Filter by name "
                    onChange={(value) => onChange({ target: { value } })}
                    {...rest}
                  />
                )}
              />
            </Box>
          </DrawerHeader>
          <DrawerBody flex="1" overflow="auto" mt="16">
            <ChainableWorkflowList workflowId={selectedWorkflowId} onChainWorkflow={onChainWorkflow} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  );
};

export default ChainWorkflowDrawer;
