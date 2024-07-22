export function isUnique(items: string[], error: string = 'Field should be unique') {
  return (value: string) => {
    return items.some((item) => item === value) ? error : true;
  };
}

export function isNotEmpty(value: string, error: string = 'Field should not be empty') {
  const isEmpty = value === undefined || value === null || !value.trim();
  return isEmpty ? error : true;
}
