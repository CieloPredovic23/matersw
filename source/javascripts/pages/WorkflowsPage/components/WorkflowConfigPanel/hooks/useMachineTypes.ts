import { DefaultError, useQuery, UseQueryResult } from '@tanstack/react-query';
import { getConfigs, getMachineTypeConfigsPath, MachineTypeConfigsResponse } from '@/api/machineType';
import { MachineType } from '@/domain/MachineType';
import { getAll } from '@/services/machineTypeService';

type Props = {
  appSlug: string;
  canChangeMachineType: boolean;
};

const useMachineTypes = ({ appSlug, canChangeMachineType }: Props): UseQueryResult<MachineType[]> => {
  return useQuery<MachineTypeConfigsResponse, DefaultError, MachineType[]>({
    staleTime: Infinity,
    enabled: !!(appSlug && canChangeMachineType),
    queryKey: [getMachineTypeConfigsPath(appSlug)],
    queryFn: ({ signal }) => getConfigs(appSlug, signal),
    select: (data) => getAll(data),
  });
};

export default useMachineTypes;
