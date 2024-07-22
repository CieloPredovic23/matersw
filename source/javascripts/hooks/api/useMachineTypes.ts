import { DefaultError, useQuery, UseQueryResult } from '@tanstack/react-query';
import { getMachineTypes, MachineTypeConfigsDTO } from '@/core/api/machineTypeApi';
import { MachineType } from '@/core/domain/MachineType';
import { fromApiCollection } from '@/core/services/machineTypeService';

export const queryKey = (appSlug: string) => ['app', appSlug, 'machine_types'];

type Props = {
  appSlug: string;
  canChangeMachineType: boolean;
};

const useMachineTypes = ({ appSlug, canChangeMachineType }: Props): UseQueryResult<MachineType[]> => {
  return useQuery<MachineTypeConfigsDTO, DefaultError, MachineType[]>({
    queryKey: queryKey(appSlug),
    queryFn: ({ signal }) => getMachineTypes(appSlug, { signal }),
    select: (data) => fromApiCollection(data),
    enabled: Boolean(appSlug && canChangeMachineType),
    staleTime: Infinity,
  });
};

export default useMachineTypes;
