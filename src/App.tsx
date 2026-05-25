import { useState, useCallback } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import type { SpeakerPerspective } from '@/types/speaker'
import type { KinshipTerm } from '@/types/kinship-term'
import { SELF_TERM } from '@/types/kinship-term'
import { FAMILY_MEMBERS, FAMILY_MEMBER_MAP } from '@/data/family-tree'
import { KINSHIP_TERMS } from '@/data/kinship-terms'
import { lookupTerm } from '@/utils/term-lookup'
import { KinshipTree } from '@/components/KinshipTree/KinshipTree'

const DEFAULT_SPEAKER: SpeakerPerspective = { memberId: 'ego', gender: 'male' }

export function App() {
  const [speaker, setSpeaker] = useState<SpeakerPerspective>(DEFAULT_SPEAKER)

  const handleSpeakerSelect = useCallback((memberId: string) => {
    if (memberId === speaker.memberId) return
    const member = FAMILY_MEMBER_MAP.get(memberId)
    if (!member) return
    setSpeaker({ memberId, gender: member.gender })
  }, [speaker.memberId])

  const termFor = useCallback(
    (targetId: string): KinshipTerm | typeof SELF_TERM => {
      const speakerMember = FAMILY_MEMBER_MAP.get(speaker.memberId)
      const targetMember = FAMILY_MEMBER_MAP.get(targetId)
      if (!speakerMember || !targetMember) return SELF_TERM
      return lookupTerm(speakerMember, targetMember, KINSHIP_TERMS)
    },
    [speaker.memberId]
  )

  return (
    <ReactFlowProvider>
      <KinshipTree
        members={FAMILY_MEMBERS}
        speaker={speaker}
        termFor={termFor}
        onSpeakerSelect={handleSpeakerSelect}
      />
    </ReactFlowProvider>
  )
}
