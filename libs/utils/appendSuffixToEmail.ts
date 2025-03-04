export const appendSuffixToEmail = (
  email: string,
  suffix = '+blocktremp',
): string => {
  const [name, domain] = email.split('@');
  return `${name}${suffix}@${domain}`;
};
