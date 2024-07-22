import { useMemo } from 'react';
import { extractChainableWorkflows } from '@/core/domain/Workflow';
import useWorkflows from '@/hooks/useWorkflows';

type Props = {
  id: string;
};

const useChainableWorkflows = ({ id }: Props): string[] => {
  const workflows = useWorkflows();
  return useMemo(() => extractChainableWorkflows(workflows, id), [workflows, id]);
};

export default useChainableWorkflows;
