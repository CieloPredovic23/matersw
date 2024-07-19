import * as Client from './client';

export type MachineTypeConfigsResponse = {
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
export type MachineTypeResponseModel =
  MachineTypeConfigsResponse['available_machine_type_configs'][string]['machine_types'][string];

export const GET_MACHINE_TYPE_CONFIGS_PATH = `/app/:appSlug/machine_type_configs`;

export const getMachineTypeConfigsPath = (appSlug: string) =>
  GET_MACHINE_TYPE_CONFIGS_PATH.replace(':appSlug', appSlug);

export const getConfigs = async (appSlug: string, signal: AbortSignal) =>
  Client.get<MachineTypeConfigsResponse>(getMachineTypeConfigsPath(appSlug), {
    signal,
  });
