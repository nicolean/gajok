import { useCallback } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  type NodeTypes,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import type { FamilyMember } from '@/types/family-member'
import type { KinshipTerm } from '@/types/kinship-term'
import { SELF_TERM } from '@/types/kinship-term'
import type { SpeakerPerspective } from '@/types/speaker'
import { FamilyNode } from '@/components/FamilyNode/FamilyNode'
import { EDGES } from './edges'

// Node positions: generation bands, paternal left / maternal right
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  // Generation -2 (y=0)
  patGrandpa:  { x: 80,  y: 0 },
  patGrandma:  { x: 210, y: 0 },
  matGrandpa:  { x: 760, y: 0 },
  matGrandma:  { x: 890, y: 0 },

  // Generation -1 (y=160)
  patUncle:    { x: 0,   y: 160 },
  father:      { x: 145, y: 160 },
  patAunt:     { x: 290, y: 160 },
  mother:      { x: 700, y: 160 },
  matUncle:    { x: 845, y: 160 },
  matAunt:     { x: 990, y: 160 },

  // Generation 0 (y=320)
  patCousinM:  { x: 0,   y: 320 },
  patCousinF:  { x: 130, y: 320 },
  olderBro:    { x: 265, y: 320 },
  olderSis:    { x: 395, y: 320 },
  ego:         { x: 490, y: 320 },
  spouse:      { x: 610, y: 320 },
  youngerBro:  { x: 710, y: 320 },
  youngerSis:  { x: 840, y: 320 },
  matCousinM:  { x: 940, y: 320 },
  matCousinF:  { x: 1070, y: 320 },

  // Generation +1 (y=480)
  son:         { x: 430, y: 480 },
  daughter:    { x: 560, y: 480 },
  nephew:      { x: 290, y: 480 },
  niece:       { x: 770, y: 480 },
}

interface NodeData extends Record<string, unknown> {
  member: FamilyMember
  term: KinshipTerm | typeof SELF_TERM
  isSelected: boolean
  onSelect: () => void
}

function FamilyNodeWrapper({ data }: { data: NodeData }) {
  return (
    <FamilyNode
      member={data.member}
      term={data.term}
      isSelected={data.isSelected}
      onSelect={data.onSelect}
    />
  )
}

const nodeTypes: NodeTypes = {
  familyNode: FamilyNodeWrapper,
}

interface KinshipTreeProps {
  members: FamilyMember[]
  speaker: SpeakerPerspective
  termFor: (targetId: string) => KinshipTerm | typeof SELF_TERM
  onSpeakerSelect: (memberId: string) => void
}

export function KinshipTree({ members, speaker, termFor, onSpeakerSelect }: KinshipTreeProps) {
  const handleSelect = useCallback(
    (memberId: string) => () => onSpeakerSelect(memberId),
    [onSpeakerSelect]
  )

  const nodes: Node[] = members.map((member) => ({
    id: member.id,
    type: 'familyNode',
    position: NODE_POSITIONS[member.id] ?? { x: 0, y: 0 },
    data: {
      member,
      term: termFor(member.id),
      isSelected: member.id === speaker.memberId,
      onSelect: handleSelect(member.id),
    } satisfies NodeData,
  }))

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--color-surface)' }}>
      <ReactFlow
        nodes={nodes}
        edges={EDGES}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: false }}
      >
        <Controls showInteractive={false} />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#E5E7EB" />
      </ReactFlow>
    </div>
  )
}
