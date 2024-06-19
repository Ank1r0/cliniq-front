import { TextField } from '@mui/material';
import PageLayout from '../../layout/PageLayout';
import { useParams, useNavigate } from 'react-router-dom/dist';
import { useIsAuthHook } from '../../hooks/useIsAuthHook';
import { useContext, useEffect, useState } from 'react';

import axios from 'axios';

const Records1 = () => {
    const params = useParams();
    const { token, userLogin } = useIsAuthHook();
    const [appData, setAppData] = useState(null);

    const fetchData = async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:9090/api/medicalRecord/getMedRecord/${params?.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAppData(data);
            console.log('Data: ', data);
        } catch (err) {
            navigator('/404');
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <PageLayout>
            {appData != null ? (
                <TextField value={appData.aboutAppo} />
            ) : (
                'No appointments and medical records'
            )}
        </PageLayout>
    );
};

export default Records1;
