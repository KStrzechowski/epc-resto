export const isEnumValue = <T extends Record<string, unknown>>(
  enumObj: T,
  value: unknown,
) => {
  return Object.values(enumObj).includes(value);
};
