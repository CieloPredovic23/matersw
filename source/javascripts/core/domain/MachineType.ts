export type MachineType = {
  id: string;
  name: string;
  os: string;
  cpuCount: string;
  cpuDescription: string;
  ram: string;
  creditCost: number;
  isDefault: boolean;
};

export const matchesId = (id: string) => (model: MachineType) => model.id === id;

export const toString = (model: MachineType) => {
  const { name, cpuCount, cpuDescription, ram, creditCost } = model;
  return `${name} ${cpuCount} @ ${cpuDescription} ${ram} (${creditCost} credits/min)`;
};
