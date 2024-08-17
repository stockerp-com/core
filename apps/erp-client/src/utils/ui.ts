export function getNameShorthand(fullName: string) {
  return fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .slice(0, 2);
}
