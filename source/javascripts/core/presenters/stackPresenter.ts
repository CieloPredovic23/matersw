import { Stack } from '@/core/domain/Stack';

export type StackOption = {
  value: string;
  name: string;
};

export const toStackOption = (model: Stack): StackOption => {
  const { id, name } = model;
  return {
    value: id,
    name,
  };
};
