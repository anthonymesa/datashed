
import type { Node, NodeId } from './NodeTreeAccordion'

export interface AppState {
  rootIds: Node['id'][],
  nodes: Record<NodeId, Node>
}