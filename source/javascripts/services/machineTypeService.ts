import type { MachineTypeConfigsResponse } from "@/api/machineType";
import { fromApi, machesId, MachineType, runsOn } from "@/domain/MachineType";

export const getAll = (dto?: MachineTypeConfigsResponse): MachineType[] => {
  if (!dto) return [];

  return Object.entries(dto).flatMap(([os, osConfig]) => {
    return Object.entries(osConfig[os].machine_types).map(
      ([machineId, machineConfig]) => fromApi(machineConfig, machineId, os),
    );
  });
};

export const getAllFor = (
  os: string,
  dto: MachineTypeConfigsResponse,
): MachineType[] => {
  const machineTypes = getAll(dto);
  return machineTypes.filter(runsOn(os));
};

export const findByKey = (
  key: string,
  dto: MachineTypeConfigsResponse,
): MachineType | undefined => {
  const machineTypes = getAll(dto);
  return machineTypes.find(machesId(key));
};

export const defaultMachineFor = (
  os: string,
  dto: MachineTypeConfigsResponse,
): MachineType | undefined => {
  const key = dto.available_machine_type_configs[os].default_machine_type;
  return findByKey(key, dto);
};
