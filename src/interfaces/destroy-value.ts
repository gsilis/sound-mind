export interface DestroyValue {
  get hp(): number
  get destroyValue(): number
  damageBy(amount: number): void
}