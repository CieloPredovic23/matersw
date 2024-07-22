import { FromSchema } from 'json-schema-to-ts';
import { bitriseYmlSchema } from '@/core/domain/BitriseYml.schema';

export type BitriseYml = FromSchema<typeof bitriseYmlSchema>;
export type Meta = Required<BitriseYml>['meta'] & {
  'bitrise.io'?: { stack: string; machine_type_id: string };
};
