import { useMemo } from 'react';
import { machineIdsOfStack, stackById } from '@/core/services/stackService';
import { toStackOption } from '@/core/presenters/stackPresenter';
import useStacks from '@/hooks/api/useStacks';

type Props = {
  appSlug: string;
  defaultStackId: string;
  selectedStackId: string;
};

const useStackSelector = ({ appSlug, defaultStackId, selectedStackId }: Props) => {
  const { isLoading, data: stacks = [] } = useStacks({
    appSlug,
  });
  const defaultStack = useMemo(() => stackById(stacks, defaultStackId), [defaultStackId, stacks]);
  const selectedStack = useMemo(() => stackById(stacks, selectedStackId), [selectedStackId, stacks]);
  const stackOptions = useMemo(() => stacks.map(toStackOption), [stacks]);
  const enabledMachineIds = useMemo(() => machineIdsOfStack(stacks, selectedStackId), [stacks, selectedStackId]);

  return {
    isLoading,
    defaultStack,
    selectedStack,
    stackOptions,
    enabledMachineIds,
  };
};

export default useStackSelector;
