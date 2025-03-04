export function censorName(name: string) {
  const [firstName, secondName] = name.split(' ');
  return `${firstName} ${secondName ? secondName[0].toUpperCase() : ''}`;
}
