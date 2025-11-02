import type { NodeTreeProps } from "./util/types";
import { NodeItem } from "./NodeItem";

export const NodeTree = ({nodes, rootIds}: NodeTreeProps) => {
  return rootIds.map((nodeId) => (
    <NodeItem 
      key={nodeId} 
      node={nodes[nodeId]}
      nodes={nodes}
    />
  ))
};