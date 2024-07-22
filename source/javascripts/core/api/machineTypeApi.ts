import { get } from './client';

export type MachineTypeConfigsDTO = {
  available_machine_type_configs: {
    [key: string]: {
      default_machine_type: string;
      machine_types: {
        [key: string]: {
          ram: string;
          name: string;
          cpu_count: string;
          cpu_description: string;
          credit_per_min: number;
        };
      };
    };
  };
};

export type MachineTypeDTO = MachineTypeConfigsDTO['available_machine_type_configs'][string]['machine_types'][string];

export const GET_MACHINE_TYPE_CONFIGS_PATH = `/app/:appSlug/machine_type_configs`;

const getMachineTypeConfigsPath = (appSlug: string) => GET_MACHINE_TYPE_CONFIGS_PATH.replace(':appSlug', appSlug);

export const getMachineTypes = (appSlug: string, options?: RequestInit) =>
  get<MachineTypeConfigsDTO>(getMachineTypeConfigsPath(appSlug), options);
