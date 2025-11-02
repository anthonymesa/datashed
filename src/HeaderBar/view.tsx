
import { Group } from '@mantine/core';
import styles from './view.module.css';
import Helmet from './Helmet';
import HeaderCenter from './HeaderCenter';
import OpenSettingsButton from './OpenSettingsButton';

function HeaderBar() {
  return (
    <Group className={styles.root} >
      <Helmet />
      <HeaderCenter />
      <OpenSettingsButton />
    </Group>
  )
}

export default HeaderBar
