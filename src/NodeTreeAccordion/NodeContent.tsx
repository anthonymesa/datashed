import { forwardRef } from "react";
import classes from './NodeContent.module.css'
import type { NodeContentProps } from "./util/types";
import { NodeTree } from "./NodeTree";

export const NodeContent = forwardRef<HTMLDivElement, NodeContentProps>(
  ({ className = "", node, nodes, expanded, ...props }, ref) => {

    let styleClasses = `${className} ${classes.root}`
    if (expanded) styleClasses += `${classes.expanded}`

    const showSubTree = ['leaf','branch'].includes(node.type) && ((node.children?.length ?? -1) > 0)

    return (
      <div className={styleClasses}>
        <div  
          ref={ref} 
          {...props} 
          className={classes.content}
        />
        { showSubTree && <NodeTree rootIds={node.children ?? []} nodes={nodes} /> }
      </div>
    );
  }
);
NodeContent.displayName = "NodeContent";