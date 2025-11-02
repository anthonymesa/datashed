import { 
  Stack
  // Stack, Text, Group, Badge
} from '@mantine/core';
import HeaderBar from '@/HeaderBar'
import { NodeTree } from '@/NodeTreeAccordion';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow'
import type { AppState } from '@/types';
import { dummyData } from '@/dummyData';

export const useAppState = create<AppState>()((set) => dummyData);

const useNodeTree = () => useAppState(
    useShallow((state) => ({ 
      rootIds: state.rootIds, 
      nodes: state.nodes 
    }))
);

function App() {
  const { rootIds, nodes } = useNodeTree();

  return (
    <Stack gap={0}>
      <HeaderBar />
      <NodeTree rootIds={rootIds} nodes={nodes} />
    </Stack>
)}

export default App
