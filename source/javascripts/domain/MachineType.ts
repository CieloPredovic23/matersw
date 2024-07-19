import { MachineTypeResponseModel } from '@/api/machineType';

export type MachineType = {
  id: string;
  name: string;
  osId: string;
  cpuCount: string;
  cpuDescription: string;
  ram: string;
  creditCost: number;
};

export type MachineTypeOption = {
  value: string;
  name: string;
  title: string;
};

export const fromApi = (dto: MachineTypeResponseModel, id: string, osId: string): MachineType => ({
  id,
  osId,
  name: dto.name || id,
  cpuCount: dto.cpu_count,
  cpuDescription: dto.cpu_description,
  ram: dto.ram,
  creditCost: dto.credit_per_min,
});

export const machesId = (id: string) => (model: MachineType) => model.id === id;
export const runsOn = (osId: string) => (model: MachineType) => model.osId === osId;

export const toString = (model: MachineType) => {
  const { name, cpuCount, cpuDescription, ram, creditCost } = model;
  return `${name} ${cpuCount} @ ${cpuDescription} ${ram} (${creditCost} credits/min)`;
};
