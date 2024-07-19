import { useShallow } from 'zustand/react/shallow';
import useBitriseYmlStore from '@/hooks/useBitriseYmlStore';
import { Workflows } from '@/models/Workflow';

const useWorkflows = () => {
  return useBitriseYmlStore(useShallow(({ yml }) => yml.workflows as Workflows));
};

export default useWorkflows;
