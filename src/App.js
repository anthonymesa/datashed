import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Datashed from './Datashed/Datashed';
import Login from './Login/Login';
import backend from './utils/Backend';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    return backend.authStore.onChange((token, model) => {
      setUserLoggedIn(backend.authStore.isValid)
    });
  }, []);
  
  if (userLoggedIn) {
    return <Datashed />
  } else {
    return <Login />
  }
}

export default App;
