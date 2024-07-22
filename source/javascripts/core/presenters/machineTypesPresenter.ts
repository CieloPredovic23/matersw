import { MachineType } from '@/core/domain/MachineType';

export type MachineTypeOption = {
  value: string;
  name: string;
  title: string;
};

export const toMachineOption = (model: MachineType): MachineTypeOption => {
  const { id, name } = model;
  return {
    value: id,
    name,
    title: model.toString(),
  };
};
