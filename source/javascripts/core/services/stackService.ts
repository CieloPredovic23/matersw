import { AllStackInfoDTO, StackDTO } from '@/core/api/stackApi';
import { Stack } from '@/core/domain/Stack';

const getDefaultStacksForProjects = (dto: AllStackInfoDTO): Record<string, Set<string>> => {
  return Object.entries(dto.project_types_with_default_stacks).reduce(
    (acc, [projectType, { default_stack }]) => {
      if (!acc[default_stack]) {
        acc[default_stack] = new Set();
      }
      acc[default_stack].add(projectType);
      return acc;
    },
    {} as Record<string, Set<string>>,
  );
};

type FromAPIParams = {
  id: string;
  dto: StackDTO;
  defaultFor: Array<string>;
};
const fromApi = ({ id, dto, defaultFor }: FromAPIParams): Stack => {
  const { title: name, project_types: projectTypes = [], available_machines: machineTypes = [] } = dto;

  return {
    id,
    name,
    defaultForProjectTypes: defaultFor,
    projectTypes,
    machineTypes,
  };
};

export const fromApiCollection = (dto: AllStackInfoDTO): Stack[] => {
  const defaultStacksForProjects = getDefaultStacksForProjects(dto);
  return Object.entries(dto.available_stacks).map<Stack>(([id, stack]) =>
    fromApi({
      id,
      dto: stack,
      defaultFor: Array.from(defaultStacksForProjects[id] ?? []),
    }),
  );
};

export const stackById = (stacks: Stack[], id: string): Stack | undefined => {
  return stacks.find((s) => s.id === id);
};

export const machineIdsOfStack = (stacks: Stack[], id: string): string[] => {
  const stack = stackById(stacks, id);
  return stack?.machineTypes ?? [];
};
