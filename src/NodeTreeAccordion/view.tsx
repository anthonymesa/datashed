// NodeTreeAccordion.tsx
import React, { memo, useMemo } from "react";
import { Accordion, Box } from "@mantine/core";
import type { AccordionProps } from '@mantine/core';

export type NodeID = string;

export type NodeKind = "leaf" | "parent" | "link";

export interface NodeRecord {
  id: NodeID;
  kind: NodeKind;
  name?: string;
  // Optional extras your store might keep:
  childIds?: NodeID[];   // for "parent"
  targetId?: NodeID;     // for "link"
  // any other fields you need...
  [k: string]: unknown;
}

/**
 * Functions you typically wire to your Zustand store.
 * - `useNode(id)` can be a selector hook or a plain function;
 *   if you use a hook, wrap it so it’s stable per id.
 * - `getChildren(id)` MUST return the list of child IDs to display,
 *   applying your "link shows only immediate children" rule if needed.
 */
export interface NodeDataAccess {
  useNode: (id: NodeID) => NodeRecord | undefined;
  getChildren: (id: NodeID) => NodeID[];
}

export interface NodeRenderProps {
  /** Render the clickable row/header. Keep it lightweight; it shows even when collapsed. */
  renderControl: (node: NodeRecord, ctx: { depth: number; isLeaf: boolean; isLink: boolean }) => React.ReactNode;
  /** Render the expanded content (and optionally extra info / actions). */
  renderPanel?: (node: NodeRecord, ctx: { depth: number; isLeaf: boolean; isLink: boolean }) => React.ReactNode;
}

export interface NodeTreeAccordionProps
  extends Omit<AccordionProps, "children">,
    NodeDataAccess,
    NodeRenderProps {
  /** Top-level node IDs to render as roots. */
  rootIds: NodeID[];

  /**
   * Limit recursion depth if desired (0 = only roots, 1 = roots + their children, etc.).
   * Leave undefined for unlimited.
   */
  maxDepth?: number;

  /** Generate the Accordion `value` per node (defaults to node.id). */
  valueFromId?: (id: NodeID) => string;
}

/** Internal recursive node component (also exported as `NodeTreeAccordion.Node`) */
interface NodeProps extends NodeRenderProps, NodeDataAccess {
  id: NodeID;
  depth: number;
  maxDepth?: number;
  valueFromId: (id: NodeID) => string;
  /** Optional slot to wrap nested accordions (for spacing, borders, etc.) */
  childrenWrapper?: (children: React.ReactNode, depth: number) => React.ReactNode;
}

const NodeImpl: React.FC<NodeProps> = memo((props) => {
  const {
    id,
    depth,
    maxDepth,
    useNode,
    getChildren,
    renderControl,
    renderPanel,
    valueFromId,
    childrenWrapper,
  } = props;

  const node = useNode(id);
  if (!node) return null;

  const isLeaf = node.kind === "leaf";
  const isLink = node.kind === "link";

  const childIds = useMemo(() => {
    if (maxDepth !== undefined && depth >= maxDepth) return [];
    return getChildren(id);
  }, [getChildren, id, depth, maxDepth]);

  const value = valueFromId(id);

  // When no panel or no children, we still render an Accordion.Item so user can keep a consistent UI.
  // You can choose to skip Accordion.Item entirely for true leaves if you’d prefer.
  return (
    <Accordion.Item value={value}>
      <Accordion.Control>
        {renderControl(node, { depth, isLeaf, isLink })}
      </Accordion.Control>

      <Accordion.Panel>
        {renderPanel?.(node, { depth, isLeaf, isLink })}

        {childIds.length > 0 && (
          (childrenWrapper ?? ((ch) => ch))(
            <Accordion multiple defaultValue={[]} variant="contained" radius="md">
              {childIds.map((childId) => (
                <NodeImpl
                  key={childId}
                  id={childId}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  useNode={useNode}
                  getChildren={getChildren}
                  renderControl={renderControl}
                  renderPanel={renderPanel}
                  valueFromId={valueFromId}
                  childrenWrapper={childrenWrapper}
                />
              ))}
            </Accordion>,
            depth + 1
          )
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
});
NodeImpl.displayName = "NodeTreeAccordion.Node";

/** Public wrapper component */
export const NodeTreeAccordion: React.FC<NodeTreeAccordionProps> & {
  Node: typeof NodeImpl;
} = (props => {
  const {
    rootIds,
    useNode,
    getChildren,
    renderControl,
    renderPanel,
    maxDepth,
    valueFromId = (id) => id,
    // Pass-through Accordion props:
    ...accordionProps
  } = props;

  // Optional visual wrapper for nested accordions (indent, border, etc.)
  const childrenWrapper = (children: React.ReactNode, depth: number) => (
    <Box pl={depth * 8}>{children}</Box>
  );

  return (
    <Accordion multiple defaultValue={[]} variant="contained" radius="md" {...accordionProps}>
      {rootIds.map((id) => (
        <NodeImpl
          key={id}
          id={id}
          depth={0}
          maxDepth={maxDepth}
          useNode={useNode}
          getChildren={getChildren}
          renderControl={renderControl}
          renderPanel={renderPanel}
          valueFromId={valueFromId}
          childrenWrapper={childrenWrapper}
        />
      ))}
    </Accordion>
  );
}) as any;

NodeTreeAccordion.Node = NodeImpl;

