import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; 
import { setUser } from '../utils/auth';

const MainWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handler = async () => {
            try {
                setLoading(true);
                await setUser();
            } catch (error) {
                console.error('Error in MainWrapper:', error);
            } finally {
                setLoading(false);
            }
        };

        handler();
    }, []);

    return <>{loading ? null : children}</>;
};

MainWrapper.propTypes = {
    children: PropTypes.node.isRequired, 
};

export default MainWrapper;
