type EnvVar = {
  key: string;
  value: unknown;
  source: string;
  isExpand: boolean;
};

const KEY_IS_REQUIRED = 'Key is required.';
const VALUE_IS_REQUIRED = 'Value is required.';
const KEY_PATTERN = {
  value: /^[a-zA-Z_]([a-zA-Z0-9_]+)?$/i,
  message: 'Key should contain letters, numbers, underscores, should not begin with a number.',
};

function parseYmlValue(value: unknown): unknown {
  if (typeof value === 'string') {
    if (['true', 'false'].includes(value)) {
      return Boolean(value === 'true');
    }

    if (value && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }

  return value;
}

export function parseEnvVarFromYml({ opts, ...env }: { [key: string]: any }, source = ''): EnvVar {
  return {
    source,
    key: Object.keys(env)[0],
    value: parseYmlValue(Object.values(env)[0]),
    isExpand: Boolean(opts?.is_expand),
  };
}

export { EnvVar };
export default {
  KEY_IS_REQUIRED,
  VALUE_IS_REQUIRED,
  KEY_PATTERN,
  parseYmlValue,
  parseEnvVarFromYml,
};
