import React, { useState, useEffect, useRef } from 'react';
import { Transition, ActionIcon, Menu, Divider, Button } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { FiMenu } from 'react-icons/fi';
import ModalActionEditSlice, { setParentId, openModal as openNewActionModal, openedSelector } from '../ModalActionAdd/ModalActionAddSlice';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { openModalLoginCaution } from '../ModalLoginCaution/ModalLoginCautionSlice';
import Cookies from 'js-cookie';
import { logOut, setLoggedIn } from '../../app/SessionManager/SessionManagerSlice';
import { useNavigate } from 'react-router-dom';
import { DatastreamCountSelector, DatashedEmpty, addDatastream } from '../Datashed/DatashedSlice';
import { openModal as openDatastreamAddModal } from '../ModalDatastreamAdd/ModalDatastreamAddSlice';
import BackendConnector from '../../app/BackendConnector';

function MenuIcon() {
  const [isScrolling, setIsScrolling] = useState(false);
  const iconRef = useRef();
  const dispatch = useDispatch();
  const addModalOpened = useSelector(store => store.ui.modals.actionAdd.opened);
  const editModalOpened = useSelector(store => store.ui.modals.actionEdit.opened);
  const [scroll, scrollTo] = useWindowScroll();
  const prevScroll = useRef(scroll);
  const navigate = useNavigate();
  const datashedEmpty = useSelector(DatashedEmpty)
  const connector = BackendConnector()

  // When scroll starts
  useEffect(() => {
    if (Math.abs(scroll.y - prevScroll.current.y) / 100 > 1)
      setIsScrolling(true);
    prevScroll.current = scroll
  }, [scroll]);

  // Using debounce to detect when scrolling has stopped
  const handleScrollEnd = debounce(() => {
    if (Math.abs(scroll.y - prevScroll.current.y) / 1000 < 1)
      setIsScrolling(false);
    prevScroll.current = scroll
  }, 1000);

  useEffect(() => {
    handleScrollEnd();
    // Cleanup to avoid memory leaks
    return () => {
      handleScrollEnd.cancel();
    };
  }, [scroll]);

  const handleNewActionClick = () => {
    dispatch(setParentId({ value: '' }));
    dispatch(openNewActionModal({}));
  };

  const handleLogOutclick = () => {
    connector.logOut(() => {
      dispatch(setLoggedIn({value: false}))
    })
  }

  const handleNewDatastreamClick = () => {
    dispatch(openDatastreamAddModal())
  }

  return (
    <Transition
      mounted={!isScrolling && !addModalOpened && !editModalOpened}
      transition="slide-up"
      duration={500}
      timingFunction='ease'
    >
      {(transitionStyles) => (
        <div style={{
          ...transitionStyles,
          position: 'fixed',
          bottom: 0,
          left: '50%',              // Add this line
          transform: 'translateX(-50%)',  // Add this line
          paddingBottom: "2rem",
          zIndex: 100
        }}>
          <Menu zIndex={1000} width={"14rem"} position={"top"}>
            <Menu.Target>
              <ActionIcon
                style={{ boxShadow: "0px 0px 5px 1px rgba(0, 0, 0, .25)" }}
                color="green" size="3rem" radius="xl" variant="filled">
                <FiMenu size="1.5rem" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Create new...</Menu.Label>
              <Menu.Item onClick={handleNewDatastreamClick}>Datastream</Menu.Item>
              <Menu.Item onClick={handleNewActionClick} disabled={datashedEmpty}>Action</Menu.Item>
              <Divider />
              <Menu.Label>Misc.</Menu.Label>
              <Menu.Item disabled>Settings</Menu.Item>
              {/* <Menu.Item onClick={handleLogin}>Log In</Menu.Item> */}
              <Menu.Item onClick={handleLogOutclick}>Log out</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      )}
    </Transition>
  );
}

export default MenuIcon;
