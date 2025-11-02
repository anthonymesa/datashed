import { forwardRef } from "react";
import { NodeTitle } from "./NodeTitle";
import { NodeContent } from "./NodeContent";
import type { NodeItemProps } from "./util/types";
import { useToggle } from "./util/hooks";
import classes from './NodeItem.module.css'
import { dummyDetails, dummyTitle } from "@/Utils/Hooks/dummyContent";

function stringToHexColor(str: any) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).slice(-2);
  }
  return color;
}

declare module "react" {
  interface CSSProperties {
    "--left-color"?: string;
  }
}

export const NodeItem = forwardRef<HTMLDivElement, NodeItemProps>(
  ({ className = "", node, nodes, ...props }, ref) => {
    const [ expanded, toggleExpanded ] = useToggle()

    return (
      <div 
        ref={ref}
        {...props}
        className={classes.root}
      >
        <NodeTitle 
          onClick={toggleExpanded}
          style={{
            '--left-color': stringToHexColor(node.parent ?? '')
          }}
        >
          {/* {node.title} */}
          {dummyTitle()}
        </NodeTitle>
        <NodeContent 
          expanded={expanded}
          node={node} 
          nodes={nodes}
        >
          {/* {node.content} */}
          {dummyDetails()}
        </NodeContent>
      </div>
    );
  }
);
NodeItem.displayName = "NodeItem";