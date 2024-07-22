import { Badge, Box, ExpandableCard, Select, Text } from '@bitrise/bitkit';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../WorkflowConfigPanel.types';
import useMachineTypeSelector from '../hooks/useMachineTypeSelector';
import useStackSelector from '../hooks/useStackSelector';

type ButtonContentProps = {
  stackName?: string;
  machineTypeName?: string;
  isDefault?: boolean;
};
const ButtonContent = ({ stackName, machineTypeName, isDefault }: ButtonContentProps) => {
  return (
    <Box display="flex" flex="1" alignItems="center" justifyContent="space-between" mr="16">
      <Box display="flex" flexDir="column" alignItems="flex-start" minW="0">
        <Text textStyle="body/lg/semibold">Stack & Machine</Text>
        <Text textStyle="body/md/regular" color="text/secondary" hasEllipsis>
          {[stackName, machineTypeName].filter(Boolean).join(' • ')}
        </Text>
      </Box>
      {isDefault && (
        <Badge variant="subtle" colorScheme="info">
          Default
        </Badge>
      )}
    </Box>
  );
};

const StackAndMachineCard = () => {
  const { watch, register } = useFormContext<FormValues>();

  const [
    appSlug = '',
    defaultStackId,
    defaultMachineTypeId,
    selectedStackId,
    selectedMachineTypeId,
    isMachineTypeSelectorAvailable,
  ] = watch([
    'appSlug',
    'defaultStackId',
    'defaultMachineTypeId',
    'configuration.stackId',
    'configuration.machineTypeId',
    'isMachineTypeSelectorAvailable',
  ]);

  const {
    isLoading: isStacksLoading,
    defaultStack,
    selectedStack,
    stackOptions,
    enabledMachineIds,
  } = useStackSelector({
    appSlug,
    defaultStackId,
    selectedStackId,
  });

  const {
    isLoading: isMachinesLoading,
    isDisabled: isMachineSelectorDisabled,
    defaultMachine,
    selectedMachine,
    isDedicatedMachine,
    isSelfHostedRunner,
    machineTypeOptions,
  } = useMachineTypeSelector({
    appSlug,
    enabledMachineIds,
    defaultMachineTypeId,
    selectedMachineTypeId,
    isMachineTypeSelectorAvailable,
  });

  const isDefault = !selectedStackId && !selectedMachineTypeId;

  if (!appSlug) {
    return null;
  }

  return (
    <ExpandableCard
      buttonContent={
        <ButtonContent stackName={selectedStack?.name} machineTypeName={selectedMachine?.name} isDefault={isDefault} />
      }
    >
      <Box display="flex" flexDir="column" gap="24">
        <Select label="Stack" isRequired isLoading={isStacksLoading} {...register('configuration.stackId')}>
          <option value="">Default ({defaultStack?.name})</option>
          {stackOptions.map(({ value, name }) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </Select>
        <Select
          isRequired
          label="Machine type"
          isLoading={isMachinesLoading}
          isDisabled={isMachineSelectorDisabled}
          {...register('configuration.machineTypeId')}
        >
          {isDedicatedMachine && <option value="">Dedicated Machine</option>}
          {isSelfHostedRunner && <option value="">Self-hosted Runner</option>}
          {!isDedicatedMachine && !isSelfHostedRunner && (
            <>
              <option value="">Default ({defaultMachine?.name})</option>
              {machineTypeOptions.map(({ value, title }) => (
                <option key={value} value={value}>
                  {title}
                </option>
              ))}
            </>
          )}
        </Select>
      </Box>
    </ExpandableCard>
  );
};

export default StackAndMachineCard;
