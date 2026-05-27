import { describe, it, expect } from 'vitest'
import { deriveRelationshipType, lookupTerm } from '@/utils/term-lookup'
import { FAMILY_MEMBERS } from '@/data/family-tree'
import { KINSHIP_TERMS } from '@/data/kinship-terms'
import { RelationshipType } from '@/types/relationship'
import { SELF_TERM } from '@/types/kinship-term'

// Helper: find member by id
const m = (id: string) => {
  const member = FAMILY_MEMBERS.find((f) => f.id === id)
  if (!member) throw new Error(`Member not found: ${id}`)
  return member
}

// ─── deriveRelationshipType ───────────────────────────────────────────────────

describe('deriveRelationshipType', () => {
  it('ego → patGrandpa = PATERNAL_GRANDFATHER', () => {
    expect(deriveRelationshipType(m('ego'), m('patGrandpa'))).toBe(RelationshipType.PATERNAL_GRANDFATHER)
  })
  it('ego → patGrandma = PATERNAL_GRANDMOTHER', () => {
    expect(deriveRelationshipType(m('ego'), m('patGrandma'))).toBe(RelationshipType.PATERNAL_GRANDMOTHER)
  })
  it('ego → matGrandpa = MATERNAL_GRANDFATHER', () => {
    expect(deriveRelationshipType(m('ego'), m('matGrandpa'))).toBe(RelationshipType.MATERNAL_GRANDFATHER)
  })
  it('ego → matGrandma = MATERNAL_GRANDMOTHER', () => {
    expect(deriveRelationshipType(m('ego'), m('matGrandma'))).toBe(RelationshipType.MATERNAL_GRANDMOTHER)
  })
  it('ego → father = FATHER', () => {
    expect(deriveRelationshipType(m('ego'), m('father'))).toBe(RelationshipType.FATHER)
  })
  it('ego → mother = MOTHER', () => {
    expect(deriveRelationshipType(m('ego'), m('mother'))).toBe(RelationshipType.MOTHER)
  })
  it('ego → patUncle = PATERNAL_UNCLE', () => {
    expect(deriveRelationshipType(m('ego'), m('patUncle'))).toBe(RelationshipType.PATERNAL_UNCLE)
  })
  it('ego → patAunt = PATERNAL_AUNT', () => {
    expect(deriveRelationshipType(m('ego'), m('patAunt'))).toBe(RelationshipType.PATERNAL_AUNT)
  })
  it('ego → matUncle = MATERNAL_UNCLE', () => {
    expect(deriveRelationshipType(m('ego'), m('matUncle'))).toBe(RelationshipType.MATERNAL_UNCLE)
  })
  it('ego → matAunt = MATERNAL_AUNT', () => {
    expect(deriveRelationshipType(m('ego'), m('matAunt'))).toBe(RelationshipType.MATERNAL_AUNT)
  })
  it('ego → olderBro = OLDER_BROTHER', () => {
    expect(deriveRelationshipType(m('ego'), m('olderBro'))).toBe(RelationshipType.OLDER_BROTHER)
  })
  it('ego → olderSis = OLDER_SISTER', () => {
    expect(deriveRelationshipType(m('ego'), m('olderSis'))).toBe(RelationshipType.OLDER_SISTER)
  })
  it('ego → spouse = SPOUSE', () => {
    expect(deriveRelationshipType(m('ego'), m('spouse'))).toBe(RelationshipType.SPOUSE)
  })
  it('ego → youngerBro = YOUNGER_BROTHER', () => {
    expect(deriveRelationshipType(m('ego'), m('youngerBro'))).toBe(RelationshipType.YOUNGER_BROTHER)
  })
  it('ego → youngerSis = YOUNGER_SISTER', () => {
    expect(deriveRelationshipType(m('ego'), m('youngerSis'))).toBe(RelationshipType.YOUNGER_SISTER)
  })
  it('ego → patCousinM (older) = PATERNAL_COUSIN_MALE_OLDER', () => {
    expect(deriveRelationshipType(m('ego'), m('patCousinM'))).toBe(RelationshipType.PATERNAL_COUSIN_MALE_OLDER)
  })
  it('ego → patCousinF (older) = PATERNAL_COUSIN_FEMALE_OLDER', () => {
    expect(deriveRelationshipType(m('ego'), m('patCousinF'))).toBe(RelationshipType.PATERNAL_COUSIN_FEMALE_OLDER)
  })
  it('ego → matCousinM (older) = MATERNAL_COUSIN_MALE_OLDER', () => {
    expect(deriveRelationshipType(m('ego'), m('matCousinM'))).toBe(RelationshipType.MATERNAL_COUSIN_MALE_OLDER)
  })
  it('ego → matCousinF (older) = MATERNAL_COUSIN_FEMALE_OLDER', () => {
    expect(deriveRelationshipType(m('ego'), m('matCousinF'))).toBe(RelationshipType.MATERNAL_COUSIN_FEMALE_OLDER)
  })
  it('ego → son = SON', () => {
    expect(deriveRelationshipType(m('ego'), m('son'))).toBe(RelationshipType.SON)
  })
  it('ego → daughter = DAUGHTER', () => {
    expect(deriveRelationshipType(m('ego'), m('daughter'))).toBe(RelationshipType.DAUGHTER)
  })
  it('ego → nephew = NEPHEW', () => {
    expect(deriveRelationshipType(m('ego'), m('nephew'))).toBe(RelationshipType.NEPHEW)
  })
  it('ego → niece = NIECE', () => {
    expect(deriveRelationshipType(m('ego'), m('niece'))).toBe(RelationshipType.NIECE)
  })

  // Paternal grandfather's perspective
  it('patGrandpa → ego = GRANDSON', () => {
    expect(deriveRelationshipType(m('patGrandpa'), m('ego'))).toBe(RelationshipType.GRANDSON)
  })
  it('patGrandpa → olderSis = GRANDDAUGHTER', () => {
    // patGrandpa (gen-2) → olderSis (gen0): genDiff = +2
    expect(deriveRelationshipType(m('patGrandpa'), m('olderSis'))).toBe(RelationshipType.GRANDDAUGHTER)
  })
  it('patGrandpa → son = GREAT_GRANDSON', () => {
    // patGrandpa (gen-2) → son (gen+1): genDiff = +3
    expect(deriveRelationshipType(m('patGrandpa'), m('son'))).toBe(RelationshipType.GREAT_GRANDSON)
  })
  it('patGrandpa → daughter = GREAT_GRANDDAUGHTER', () => {
    expect(deriveRelationshipType(m('patGrandpa'), m('daughter'))).toBe(RelationshipType.GREAT_GRANDDAUGHTER)
  })
  it('father → son = GRANDSON', () => {
    // father (gen-1) → son (gen+1): genDiff = +2
    expect(deriveRelationshipType(m('father'), m('son'))).toBe(RelationshipType.GRANDSON)
  })
  it('son → patGrandpa = PATERNAL_GREAT_GRANDFATHER', () => {
    // son (gen+1) → patGrandpa (gen-2): genDiff = -3
    expect(deriveRelationshipType(m('son'), m('patGrandpa'))).toBe(RelationshipType.PATERNAL_GREAT_GRANDFATHER)
  })
  it('son → patGrandma = PATERNAL_GREAT_GRANDMOTHER', () => {
    expect(deriveRelationshipType(m('son'), m('patGrandma'))).toBe(RelationshipType.PATERNAL_GREAT_GRANDMOTHER)
  })
  it('son → matGrandpa = MATERNAL_GREAT_GRANDFATHER', () => {
    expect(deriveRelationshipType(m('son'), m('matGrandpa'))).toBe(RelationshipType.MATERNAL_GREAT_GRANDFATHER)
  })
  it('son → matGrandma = MATERNAL_GREAT_GRANDMOTHER', () => {
    expect(deriveRelationshipType(m('son'), m('matGrandma'))).toBe(RelationshipType.MATERNAL_GREAT_GRANDMOTHER)
  })
  it('son → father = PATERNAL_GRANDFATHER', () => {
    // son (gen+1) → father (gen-1): paternal grandfather
    expect(deriveRelationshipType(m('son'), m('father'))).toBe(RelationshipType.PATERNAL_GRANDFATHER)
  })
  it('son → mother = PATERNAL_GRANDMOTHER', () => {
    // mother has lineageSide maternal but is son's paternal grandmother
    expect(deriveRelationshipType(m('son'), m('mother'))).toBe(RelationshipType.PATERNAL_GRANDMOTHER)
  })
  it('son → ego = FATHER', () => {
    expect(deriveRelationshipType(m('son'), m('ego'))).toBe(RelationshipType.FATHER)
  })
  it('son → spouse = MOTHER', () => {
    expect(deriveRelationshipType(m('son'), m('spouse'))).toBe(RelationshipType.MOTHER)
  })
  it('nephew → olderBro = FATHER', () => {
    expect(deriveRelationshipType(m('nephew'), m('olderBro'))).toBe(RelationshipType.FATHER)
  })
  it('nephew → ego = PATERNAL_UNCLE', () => {
    // ego is nephew's paternal uncle (ego is olderBro's younger sibling)
    expect(deriveRelationshipType(m('nephew'), m('ego'))).toBe(RelationshipType.PATERNAL_UNCLE)
  })
  it('father → olderBro = SON', () => {
    // father is olderBro's parent — should return SON, not NEPHEW
    expect(deriveRelationshipType(m('father'), m('olderBro'))).toBe(RelationshipType.SON)
  })
  it('father → ego = SON', () => {
    expect(deriveRelationshipType(m('father'), m('ego'))).toBe(RelationshipType.SON)
  })
  it('patUncle → patCousinM = SON', () => {
    expect(deriveRelationshipType(m('patUncle'), m('patCousinM'))).toBe(RelationshipType.SON)
  })
})

// ─── lookupTerm — SELF ────────────────────────────────────────────────────────

describe('lookupTerm — self', () => {
  it('returns SELF_TERM when speaker === target', () => {
    expect(lookupTerm(m('ego'), m('ego'), KINSHIP_TERMS)).toBe(SELF_TERM)
  })
  it('returns SELF_TERM for any node when speaker === target', () => {
    expect(lookupTerm(m('patGrandma'), m('patGrandma'), KINSHIP_TERMS)).toBe(SELF_TERM)
  })
})

// ─── lookupTerm — gender-dependent sibling terms ──────────────────────────────

describe('lookupTerm — gender-dependent terms', () => {
  it('male ego calling olderBro returns 형 (hyeong)', () => {
    const term = lookupTerm(m('ego'), m('olderBro'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('형')
  })
  it('male ego calling olderSis returns 누나 (nuna)', () => {
    const term = lookupTerm(m('ego'), m('olderSis'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('누나')
  })
  it('female olderSis calling ego (younger brother) returns 남동생', () => {
    const term = lookupTerm(m('olderSis'), m('ego'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('남동생')
  })
  it('female olderSis calling olderBro returns 오빠 (oppa)', () => {
    const term = lookupTerm(m('olderSis'), m('olderBro'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('오빠')
  })
})

// ─── lookupTerm — multi-generation terms ─────────────────────────────────────

describe('lookupTerm — multi-generation', () => {
  it('patGrandpa calls ego 손자', () => {
    const term = lookupTerm(m('patGrandpa'), m('ego'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('손자')
  })
  it('patGrandma calls olderSis 손녀', () => {
    // patGrandma (gen-2) → olderSis (gen0): granddaughter
    const term = lookupTerm(m('patGrandma'), m('olderSis'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('손녀')
  })
  it('patGrandpa calls son 증손자', () => {
    const term = lookupTerm(m('patGrandpa'), m('son'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('증손자')
  })
  it('son calls patGrandpa 증조할아버지', () => {
    const term = lookupTerm(m('son'), m('patGrandpa'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('증조할아버지')
  })
  it('son calls matGrandpa 외증조할아버지', () => {
    const term = lookupTerm(m('son'), m('matGrandpa'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('외증조할아버지')
  })
  it('son calls father 할아버지', () => {
    const term = lookupTerm(m('son'), m('father'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('할아버지')
  })
  it('son calls mother 할머니 (not 외할머니)', () => {
    const term = lookupTerm(m('son'), m('mother'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('할머니')
  })
  it('son calls ego 아버지', () => {
    const term = lookupTerm(m('son'), m('ego'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('아버지')
  })
  it('son calls spouse 어머니', () => {
    const term = lookupTerm(m('son'), m('spouse'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('어머니')
  })
})

// ─── lookupTerm — paternal/maternal distinction ───────────────────────────────

describe('lookupTerm — paternal vs maternal', () => {
  it('ego calls patGrandpa 할아버지', () => {
    const term = lookupTerm(m('ego'), m('patGrandpa'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('할아버지')
  })
  it('ego calls matGrandpa 외할아버지', () => {
    const term = lookupTerm(m('ego'), m('matGrandpa'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('외할아버지')
  })
  it('ego calls patAunt 고모', () => {
    const term = lookupTerm(m('ego'), m('patAunt'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('고모')
  })
  it('ego calls matAunt 이모', () => {
    const term = lookupTerm(m('ego'), m('matAunt'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('이모')
  })
  it('ego calls matUncle 외삼촌', () => {
    const term = lookupTerm(m('ego'), m('matUncle'), KINSHIP_TERMS)
    expect(term).not.toBe(SELF_TERM)
    if (term === SELF_TERM) return
    expect(term.hangul).toBe('외삼촌')
  })
})
