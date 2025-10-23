
import { Accordion } from '@mantine/core';
import useStore from './store';
import AccordionItem from './AccordionItem'

export default function Stream() {
  const rootIds = useStore((store) => store.rootIds);

  return (
    <Accordion>
      { rootIds.map((datumId) => (
        <AccordionItem key={datumId} datumId={datumId} />
      )) }
    </Accordion>
  )
}
