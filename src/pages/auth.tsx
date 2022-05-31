import { createContext, useContext } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import database from '../database/database';

const ProtectedRoute = ({ children }: any) => {
  const UserContext = createContext('user-test');
  const value = useContext(UserContext);

  const user = null;
  const [cookies, setCookie] = useCookies(['username', 'password']);

  const userData = database.find((user) => user.username === cookies.username);
  if (userData) {
    if (userData.password === cookies.password) {
      return children;
    }
  }
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
