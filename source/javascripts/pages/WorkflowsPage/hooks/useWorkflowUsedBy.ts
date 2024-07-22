import { useMemo } from 'react';
import useWorkflows from '../../../hooks/useWorkflows';
import { extractUsedByWorkflows } from '@/core/services/workflowService';

type Props = {
  id: string;
};

const useWorkflowUsedBy = ({ id }: Props) => {
  const workflows = useWorkflows();
  return useMemo(() => extractUsedByWorkflows(workflows, id), [workflows, id]);
};

export default useWorkflowUsedBy;
