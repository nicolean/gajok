export type Gender = 'male' | 'female'
export type LineageSide = 'paternal' | 'maternal' | 'self' | 'spouse'
export type AgeOrder = 'older' | 'younger' | 'n/a'
export type Generation = -2 | -1 | 0 | 1

export interface FamilyMember {
  id: string
  gender: Gender
  generation: Generation
  lineageSide: LineageSide
  ageOrder: AgeOrder
  roleLabel: string
}
