import { 
  Stack, Text
} from '@mantine/core';
import HeaderBar from './HeaderBar'
import Stream from './Stream'

const content="lorem ipsum etc dolor"

function App() {

  return (
    <Stack>
      <HeaderBar />
      <Stream /> 
    </Stack>
)}

export default App
