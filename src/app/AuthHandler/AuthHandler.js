import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { LoggedInSelector, logIn } from '../SessionManager/SessionManagerSlice';

const AuthHandler = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const loggedIn = useSelector(LoggedInSelector)
  const navigate = useNavigate()

  // useEffect(() => {
  //   const query = new URLSearchParams(location.search);
  //   const token = query.get('sub');
    
  //   if (token) {
  //     dispatch(logIn(token))
  //   }
  // }, [location]);

  useEffect(() => {
    // if(loggedIn) {
      navigate('/');
    // }
  }, [ loggedIn ])

  return <Center h={"100vh"}><Loader /></Center>;
};

export default AuthHandler;
