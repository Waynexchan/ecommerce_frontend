import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auths';
import UserData from '../views/plugin/UserData';
import PropTypes from 'prop-types';

const VendorPrivateRoute = ({ children }) => {
    const loggedIn = useAuthStore((state) => state.isLoggedIn)();
    const vendorId = UserData()?.vendor_id;

    if (!loggedIn) {
        return <Navigate to="/login" />;
    }

    if (loggedIn && (vendorId === 0 || !vendorId)) {
        return <Navigate to="/vendor/register/" />;
    }

    return <>{children}</>;
};

VendorPrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default VendorPrivateRoute;
