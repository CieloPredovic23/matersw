export type Secret = {
  key: string;
  value: string;
  isProtected: boolean;
  isExpand: boolean;
  isExpose: boolean;
  isKeyChangeable: boolean;
  isShared?: boolean;
};

export type SecretWithState = Secret & {
  isEditing: boolean;
  isSaved?: boolean;
};

export const KEY_IS_REQUIRED = 'Key is required';
export const VALUE_IS_REQUIRED = 'Value is required';

export const KEY_PATTERN = {
  value: /^[a-zA-Z_]([a-zA-Z0-9_]+)?$/i,
  message: 'Key should contain letters, numbers, underscores, should not begin with a number.',
};
