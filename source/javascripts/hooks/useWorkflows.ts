import { useShallow } from 'zustand/react/shallow';
import useBitriseYmlStore from '@/hooks/useBitriseYmlStore';
import { Workflows } from '@/models/Workflow';

export const useWorkflows = () => {
  return useBitriseYmlStore(useShallow(({ yml }) => yml.workflows as Workflows));
};
