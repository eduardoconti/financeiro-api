export function calculateResidual(value: number, instalment: number): number {
  return value % instalment;
}

export function descriptionOfInstalment(
  instalment: number,
  instalments: number,
  description: string,
): string {
  return `${instalment}${'/'}${instalments}${' '}${description}`;
}
