import { Text } from '@mantine/core';
import styles from './index.module.css';

const content = "Loren Ipsum";

function Helmet() {
  return (
    <Text className={styles.root}>
      {content}
    </Text>
  )
}

export default Helmet
