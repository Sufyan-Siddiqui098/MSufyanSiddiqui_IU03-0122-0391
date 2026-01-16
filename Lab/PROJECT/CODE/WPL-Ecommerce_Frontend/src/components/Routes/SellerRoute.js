import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SellerRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'SELLER') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default SellerRoute;
