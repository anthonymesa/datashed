import { ActionIcon } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react'; 
import styles from './view.module.css';

function OpenSettingsButton() {
  return (
    <ActionIcon className={styles.root}>
      <IconAdjustments />
    </ActionIcon>
  )
}

export default OpenSettingsButton

