import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // 導入 prop-types
import { setUser } from '../utils/auth';

const MainWrapper = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handler = async () => {
            setLoading(true);
            await setUser();
            setLoading(false);
        };

        handler();
    }, []);

    return <>{loading ? null : children}</>;
};

// 添加 propTypes 驗證
MainWrapper.propTypes = {
    children: PropTypes.node.isRequired, // 確保 children 是一個 node 並且是必需的
};

export default MainWrapper;
