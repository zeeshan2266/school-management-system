import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';

export const Logout = ({setFlag}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        // Clear all session cookies
        document.cookie.split(";").forEach((cookie) => {
            const name = cookie.trim().split("=")[0];
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        });

        // Clear local storage
        localStorage.clear();

        // Clear all data from the Redux store
        //  dispatch(clearStore());

        // Set flag and navigate to the home page
        setFlag(true);
        navigate('/');
    }, [navigate, dispatch, setFlag]);

    return null;  // No need to render anything
};
