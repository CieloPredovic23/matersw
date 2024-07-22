import { useMemo } from 'react';
import { machineById, machinesWithIds } from '@/core/services/machineTypeService';
import { toMachineOption } from '@/core/presenters/machineTypePresenter';
import useMachineTypes from '@/hooks/api/useMachineTypes';

type Props = {
  appSlug: string;
  defaultMachineTypeId: string;
  selectedMachineTypeId: string;
  enabledMachineIds: string[];
  isMachineTypeSelectorAvailable: boolean;
};

const useMachineTypeSelector = ({
  appSlug,
  enabledMachineIds,
  defaultMachineTypeId,
  selectedMachineTypeId,
  isMachineTypeSelectorAvailable,
}: Props) => {
  const { isLoading, data: machineTypes = [] } = useMachineTypes({
    appSlug,
    canChangeMachineType: isMachineTypeSelectorAvailable,
  });

  const isDedicatedMachine = !isMachineTypeSelectorAvailable;
  const isSelfHostedRunner = !defaultMachineTypeId;
  const isDisabled = isLoading || isDedicatedMachine || isSelfHostedRunner;

  const defaultMachine = useMemo(
    () => machineById(machineTypes, defaultMachineTypeId),
    [defaultMachineTypeId, machineTypes],
  );
  const selectedMachine = useMemo(
    () => machineById(machineTypes, selectedMachineTypeId),
    [selectedMachineTypeId, machineTypes],
  );
  const machineTypeOptions = useMemo(
    () => machinesWithIds(machineTypes, enabledMachineIds).map(toMachineOption),
    [enabledMachineIds, machineTypes],
  );

  return {
    isLoading,
    isDisabled,
    isDedicatedMachine,
    isSelfHostedRunner,
    defaultMachine,
    selectedMachine,
    machineTypeOptions,
  };
};

export default useMachineTypeSelector;
