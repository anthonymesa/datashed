
// store.ts (example sketch)
import { create } from "zustand";
import type { NodeRecord, NodeID } from "./view";

type State = {
  rootIds: NodeID[];
  nodes: Record<NodeID, NodeRecord>;
};

export const useTreeStore = create<State>()(() => ({
  rootIds: [],
  nodes: {
    'default': {
      id: 'default',
      kind: 'leaf',
      name: 'lorem ipsum',
    }
  },
}));

// Selectors you’ll pass into NodeTreeAccordion:
export const useNode = (id: NodeID) =>
  useTreeStore((s) => s.nodes[id]);

// Child resolver that enforces your "link shows only immediate children" rule:
export const getChildren = (id: NodeID): NodeID[] => {
  const s = useTreeStore.getState();
  const n = s.nodes[id];
  if (!n) return [];
  if (n.kind === "parent") return n.childIds ?? [];
  if (n.kind === "link") {
    const t = n.targetId ? s.nodes[n.targetId] : undefined;
    if (t?.kind === "parent") return t.childIds ?? [];
    return [];
  }
  return []; // leaf
};

