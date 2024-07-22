import { useShallow } from 'zustand/react/shallow';
import useBitriseYmlStore from '@/hooks/useBitriseYmlStore';
import { Workflows } from '@/core/domain/Workflow';

const useWorkflows = () => {
  return useBitriseYmlStore(useShallow(({ yml }) => yml.workflows as Workflows));
};

export default useWorkflows;
