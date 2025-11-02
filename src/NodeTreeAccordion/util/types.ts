
export type NodeId = string;
type NodeType = 'leaf' | 'link' | 'branch'

export interface Node {
  id: NodeId;
  type: NodeType;
  parent: NodeId | null;
  title: string;

  content?: any;
  children?: NodeId[];
  linkId?: NodeId;
}

type RootIds = NodeId[]
type Nodes = Record<NodeId, Node>;

export type NodeContentProps = React.HTMLAttributes<HTMLDivElement> & {
  expanded: boolean;
  node: Node,
  nodes: Nodes
};

export type NodeTitleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {

};

export type NodeItemProps = React.HTMLAttributes<HTMLDivElement> & {
  node: Node,
  nodes: Nodes
};

export type NodeTreeProps = React.HTMLAttributes<HTMLDivElement> & {
  rootIds: RootIds,
  nodes: Nodes
};