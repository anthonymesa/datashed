

import useStore from '../store'
import { useShallow } from 'zustand/react/shallow'
import type { StreamStore } from '../types'
import { Accordion } from '@mantine/core'

export default function AccordionItem({ 
  datumId 
}: { 
  datumId: string 
}) {
  const datum = useStore(useShallow(
    (state: StreamStore) => state.data[datumId] 
  ));

  return (
    <Accordion.Item key={datumId} value={datumId}>
      <Accordion.Control>
        {datumId}
      </Accordion.Control>
      <Accordion.Panel>
        {datum.description}
      </Accordion.Panel>
    </Accordion.Item>
  )
}
