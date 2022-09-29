import { useLocation, Navigate } from 'react-router-dom';
import { store } from './redux/store';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  let location = useLocation();
  const tokens = store.getState().user.tokens.token;
  const token = localStorage.getItem('token');

  if (!token && !tokens) {
    return <Navigate to='/' state={{ from: location }} replace />;
  } else {
    return children;
  }
};