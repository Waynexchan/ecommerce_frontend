import Cookie from 'js-cookie';
import jwtDecode from 'jwt-decode';

function UserData() {
    const access_token = Cookie.get('access_token');
    const refresh_token = Cookie.get('refresh_token');

    if (access_token && refresh_token) {
        try {
            const decoded = jwtDecode(refresh_token);  // to return user data
            return {
                user_id: decoded.user_id,
                username: decoded.username,
                vendor_id: decoded.vendor_id,
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    } else {
        return null;
    }
}

export default UserData;
