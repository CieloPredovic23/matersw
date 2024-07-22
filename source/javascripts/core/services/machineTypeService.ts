import { MachineType, matchesId } from '@/core/domain/MachineType';
import { MachineTypeConfigsDTO, MachineTypeDTO } from '@/core/api/machineTypeApi';

type FromApiParams = {
  id: string;
  os: string;
  dto: MachineTypeDTO;
  isDefault: boolean;
};
export const fromApi = ({ id, os, dto, isDefault }: FromApiParams): MachineType => ({
  id,
  os,
  name: dto.name || id,
  cpuCount: dto.cpu_count,
  cpuDescription: dto.cpu_description,
  ram: dto.ram,
  creditCost: dto.credit_per_min,
  isDefault,
});

export const fromApiCollection = (dto: MachineTypeConfigsDTO): MachineType[] => {
  return Object.entries(dto).flatMap(([os, osConfig]) => {
    return Object.entries(osConfig[os].machine_types).map(([machineId, machineConfig]) =>
      fromApi({
        id: machineId,
        os,
        dto: machineConfig,
        isDefault: osConfig[os].default_machine_type === machineId,
      }),
    );
  });
};

export const machineById = (machineTypes: MachineType[], id: string): MachineType | undefined => {
  return machineTypes.find(matchesId(id));
};

export const machinesWithIds = (machineTypes: MachineType[], ids: string[]): MachineType[] => {
  return machineTypes.filter((m) => ids.includes(m.id));
};
