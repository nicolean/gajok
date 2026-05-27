import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  type NodeTypes,
  type Node,
} from '@xyflow/react'

import type { FamilyMember } from '@/types/family-member'
import type { KinshipTerm } from '@/types/kinship-term'
import { SELF_TERM } from '@/types/kinship-term'
import type { SpeakerPerspective } from '@/types/speaker'
import { FamilyNode } from '@/components/FamilyNode/FamilyNode'
import { EDGES } from './edges'

// Node positions: generation bands, paternal left / maternal right
// Node width = 108px; minimum gap = 20px → pitch = 128px
const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  // Generation -2 (y=0)
  patGrandpa:  { x: 80,   y: 0 },
  patGrandma:  { x: 218,  y: 0 },
  matGrandpa:  { x: 860,  y: 0 },
  matGrandma:  { x: 990,  y: 0 },

  // Generation -1 (y=160)
  patUncle:    { x: 0,    y: 160 },
  father:      { x: 140,  y: 160 },
  patAunt:     { x: 278,  y: 160 },
  mother:      { x: 760,  y: 160 },
  matUncle:    { x: 1050, y: 160 },
  matAunt:     { x: 1192, y: 160 },

  // Generation 0: siblings/ego/spouse at y=300, cousins offset to y=375
  // Older/younger siblings are pushed outward 64px to create an 84px gap on each
  // side of the ego+spouse couple, visually grouping them as a married pair.
  patCousinM:  { x: 0,    y: 375 },
  patCousinF:  { x: 128,  y: 375 },
  olderBro:    { x: 212,  y: 300 },
  olderSis:    { x: 340,  y: 300 },
  ego:         { x: 532,  y: 300 },
  spouse:      { x: 660,  y: 300 },
  youngerBro:  { x: 852,  y: 300 },
  youngerSis:  { x: 980,  y: 300 },
  matCousinM:  { x: 1128, y: 375 },
  matCousinF:  { x: 1256, y: 375 },

  // Generation +1 (y=480)
  nephew:      { x: 212,  y: 480 },
  son:         { x: 480,  y: 480 },
  daughter:    { x: 610,  y: 480 },
  niece:       { x: 894,  y: 480 },
}

const HANDLE_STYLE: React.CSSProperties = { visibility: 'hidden' }

interface NodeData extends Record<string, unknown> {
  member: FamilyMember
  term: KinshipTerm | typeof SELF_TERM
  isSelected: boolean
}

function FamilyNodeWrapper({ data }: { data: NodeData }) {
  return (
    <>
      <Handle type="target" position={Position.Top}    id="top"     style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Top}    id="top-src" style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Bottom} id="bottom"  style={HANDLE_STYLE} />
      <Handle type="target" position={Position.Left}   id="left"    style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Right}  id="right"   style={HANDLE_STYLE} />
      <FamilyNode
        member={data.member}
        term={data.term}
        isSelected={data.isSelected}
      />
    </>
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
  const nodes: Node[] = members.map((member) => ({
    id: member.id,
    type: 'familyNode',
    position: NODE_POSITIONS[member.id] ?? { x: 0, y: 0 },
    data: {
      member,
      term: termFor(member.id),
      isSelected: member.id === speaker.memberId,
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
        panOnDrag={false}
        panOnScroll
        onNodeClick={(_event, node) => onSpeakerSelect(node.id)}
        proOptions={{ hideAttribution: false }}
      >
        <Controls showInteractive={false} />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#E5E7EB" />
      </ReactFlow>
    </div>
  )
}
