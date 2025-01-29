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
            {appData?.aboutAppo ? (
                <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
                    <TextField
                        value={appData.aboutAppo}
                        multiline
                        rows={10} // Adjust the number of rows for large text
                        fullWidth
                        variant="outlined" // Choose a variant to make it visually pleasing
                        InputProps={{
                            style: { fontSize: '16px', lineHeight: '1.6' }, // Adjust typography for readability
                        }}
                    />
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px' }}>
                    No appointments and medical records
                </div>
            )}
        </PageLayout>
    );
};

export default Records1;
