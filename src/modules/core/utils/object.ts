type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export function deepMerge<T extends object>(
  current: T,
  updates: DeepPartial<T>,
): T {
  const result = { ...current };

  for (const [key, value] of Object.entries(updates)) {
    if (value && typeof value === 'object' && key in result) {
      result[key] = deepMerge(result[key], value);
    } else if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}
