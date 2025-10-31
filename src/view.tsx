import { 
  Stack, Text, Group, Badge
} from '@mantine/core';
import HeaderBar from '@/HeaderBar'
import NodeTreeAccordion, { useNode, getChildren } from '@/NodeTreeAccordion'

function App() {

  const rootIds: string[] = [];

  return (
    <Stack>
      <HeaderBar />
      <NodeTreeAccordion
        rootIds={rootIds}
        useNode={useNode}
        getChildren={getChildren}
        // optional: control which items can be open simultaneously, defaultValue, etc.
        //multiple
        renderControl={(node, { isLeaf, isLink, depth }) => (
          <Group gap="sm">
            {isLink && <Badge variant="light">link</Badge>}
            <Text fw={500}>{node.name ?? node.id}</Text>
            {isLeaf && <Text c="dimmed" size="sm">(leaf)</Text>}
          </Group>
        )}
        renderPanel={(node, { isLeaf }) =>
          isLeaf ? (
            <Text size="sm" c="dimmed">No children</Text>
          ) : (
            <Text size="sm" c="dimmed">Children listed below…</Text>
          )
        }
      />
    </Stack>
)}

export default App
