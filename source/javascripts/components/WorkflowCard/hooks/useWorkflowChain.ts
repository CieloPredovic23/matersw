import { useShallow } from 'zustand/react/shallow';
import { BitriseYml } from '@/models/BitriseYml';
import useBitriseYmlStore from '@/hooks/useBitriseYmlStore';

type Props = {
  id: string;
};

type Result = {
  id: string;
  index: number;
  parentId: string;
};

const extractBeforeRunChain = (yml: BitriseYml, id: string): Result[] => {
  const ids = yml.workflows?.[id]?.before_run ?? [];

  return ids.reduce<Result[]>((results, currentId, index) => {
    return [
      ...results,
      ...extractBeforeRunChain(yml, currentId),
      { id: currentId, index, parentId: id },
      ...extractAfterRunChain(yml, currentId),
    ];
  }, []);
};

const extractAfterRunChain = (yml: BitriseYml, id: string): Result[] => {
  const ids = yml.workflows?.[id]?.after_run ?? [];

  return ids.reduce<Result[]>((results, currentId, index) => {
    return [
      ...results,
      ...extractBeforeRunChain(yml, currentId),
      { id: currentId, index, parentId: id },
      ...extractAfterRunChain(yml, currentId),
    ];
  }, []);
};

export const useBeforeRunWorkflows = ({ id }: Props) => {
  return useBitriseYmlStore(useShallow(({ yml }) => extractBeforeRunChain(yml, id)));
};

export const useAfterRunWorkflows = ({ id }: Props) => {
  return useBitriseYmlStore(useShallow(({ yml }) => extractAfterRunChain(yml, id)));
};
