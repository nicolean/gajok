import { describe, it, expect } from 'vitest'
import { KINSHIP_TERMS } from '@/data/kinship-terms'
import { FAMILY_MEMBERS } from '@/data/family-tree'
import { RelationshipType } from '@/types/relationship'

describe('KinshipTerm field compliance', () => {
  const terms = Object.entries(KINSHIP_TERMS)

  it('every term has non-empty hangul', () => {
    for (const [key, term] of terms) {
      expect(term.hangul, `${key} hangul`).toBeTruthy()
    }
  })

  it('every term has non-empty romanization', () => {
    for (const [key, term] of terms) {
      expect(term.romanization, `${key} romanization`).toBeTruthy()
    }
  })

  it('every term has non-empty englishGloss', () => {
    for (const [key, term] of terms) {
      expect(term.englishGloss, `${key} englishGloss`).toBeTruthy()
    }
  })

  it('every term has speechRegister === 존댓말', () => {
    for (const [key, term] of terms) {
      expect(term.speechRegister, `${key} register`).toBe('존댓말')
    }
  })

  it('usageNote is string or null (never undefined)', () => {
    for (const [key, term] of terms) {
      expect(term.usageNote === null || typeof term.usageNote === 'string', `${key} usageNote`).toBe(true)
    }
  })
})

describe('RelationshipMapping coverage', () => {
  it('every RelationshipType has at least one entry in the mapping', () => {
    for (const type of Object.values(RelationshipType)) {
      const maleKey = `male:${type}`
      const femaleKey = `female:${type}`
      const hasMale = maleKey in KINSHIP_TERMS
      const hasFemale = femaleKey in KINSHIP_TERMS
      expect(hasMale || hasFemale, `No entry for ${type}`).toBe(true)
    }
  })
})

describe('FamilyMember data integrity', () => {
  it('all 24 members are present', () => {
    expect(FAMILY_MEMBERS).toHaveLength(24)
  })

  it('all member ids are unique', () => {
    const ids = FAMILY_MEMBERS.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all gen-0 members have defined ageOrder (not n/a except ego and spouse)', () => {
    const gen0 = FAMILY_MEMBERS.filter((m) => m.generation === 0)
    for (const m of gen0) {
      if (m.id === 'ego' || m.id === 'spouse') {
        expect(m.ageOrder).toBe('n/a')
      } else if (m.lineageSide === 'self') {
        expect(['older', 'younger']).toContain(m.ageOrder)
      }
    }
  })

  it('non-gen-0 members have ageOrder n/a', () => {
    const nonGen0 = FAMILY_MEMBERS.filter((m) => m.generation !== 0)
    for (const m of nonGen0) {
      expect(m.ageOrder, `${m.id} ageOrder`).toBe('n/a')
    }
  })
})
