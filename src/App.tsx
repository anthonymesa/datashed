import { 
  Stack, Text
} from '@mantine/core';
import HeaderBar from './HeaderBar/HeaderBar'

const content="lorem ipsum etc dolor"

function App() {

  return (
    <Stack>
      <HeaderBar />
      <Text>
        {content}
      </Text>
    </Stack>
)}

export default App
