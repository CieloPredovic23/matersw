import { useMemo } from 'react';
import useStacks from './useStacks';
import useMachineTypes from './useMachineTypes';

type Props = {
  appSlug: string;
  stackId: string;
  canChangeMachineType: boolean;
};

const useMachineTypeOptions = ({ appSlug, canChangeMachineType, stackId }: Props) => {
  const { isLoading: isStackLoading, data: allStackInfo } = useStacks({
    appSlug,
  });
  const { isLoading: isMachineTypeLoading, data: machineTypeConfigs } = useMachineTypes({
    appSlug,
    canChangeMachineType,
  });

  const isLoading = isStackLoading || isMachineTypeLoading;

  const machineTypeOptions = useMemo(() => {
    const availableMachinesOfStack = allStackInfo?.available_stacks?.[stackId]?.available_machines ?? [];
    const availableMachineTypes = availableMachinesOfStack.map((key) => ({
      key,
      ...findMachineTypeByKey(key, machineTypeConfigs),
    }));

    return availableMachineTypes.map((machineType) => ({
      value: machineType.key,
      name: machineType.name || machineType.key,
      title: buildMachineTypeLabel(machineType),
    }));
  }, [allStackInfo?.available_stacks, machineTypeConfigs, stackId]);

  return {
    isLoading,
    machineTypeOptions,
  };
};

export default useMachineTypeOptions;
