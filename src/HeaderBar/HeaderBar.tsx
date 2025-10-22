import React from 'react';
import { Group } from '@mantine/core';
import styles from './HeaderBar.module.css';
import HeaderLeft from './HeaderLeft/HeaderLeft';
import HeaderCenter from './HeaderCenter/HeaderCenter';
import HeaderRight from './HeaderRight/HeaderRight';

function HeaderBar() {
  return (
    <Group>
      <HeaderLeft />
      <HeaderCenter />
      <HeaderRight />
    </Group>
  )
}

export default HeaderBar