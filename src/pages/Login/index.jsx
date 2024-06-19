import PageLayout from '../../layout/PageLayout';
import { TextField, Box, Typography, Button } from '@mui/material';
import { useIsAuthHook } from '../../hooks/useIsAuthHook';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useContext, useState } from 'react';
import { CurrentUserContext } from '../../context/currentUserContext';

export default function () {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const Navigate = useNavigate();
    const { fetchCurrentUser } = useContext(CurrentUserContext);

    const { decodedToken, userLogin } = useIsAuthHook();

    const onChangePasswordHandler = (value) => {
        console.log(value);
        if (value?.length > 10) {
            return;
        }
        setPassword(value);
    };

    const onSendEvent = async (e) => {
        e.preventDefault();
        const authData = { login, password };

        const { data } = await axios
            .post('http://localhost:9090/api/auth/signin', authData)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
        console.log('On send', data);
        if (data?.token) {
            localStorage.setItem('token', data.token);
            setMessage('Login is true');
            if(userLogin?.length) fetchCurrentUser();
            Navigate('/');
        }
    };

    return (
        <PageLayout>
            {!decodedToken ? (
                <Box
                    onSubmit={onSendEvent}
                    component="form"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        '& .MuiTextField-root': {
                            mb: 2,
                            // width: '25ch',
                        },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Typography
                        sx={{ mb: '12px' }}
                        variant="subtitle1"
                        component="h2"
                    >
                        Login
                    </Typography>
                    <Box sx={{ maxWidth: '315px' }}>
                        <TextField
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            id="outlined-basic"
                            label="Login:"
                            variant="outlined"
                            sx={{ width: '100%' }}
                        />
                        <TextField
                            value={password}
                            onChange={(e) =>
                                onChangePasswordHandler(e.target.value)
                            }
                            type="password"
                            id="outlined-basic"
                            label="Password:"
                            variant="outlined"
                            sx={{ width: '100%' }}
                        />
                        <Button
                            type="submit"
                            sx={{ width: '100%' }}
                            variant="contained"
                        >
                            Login
                        </Button>
                    </Box>
                    {message}
                </Box>
            ) : (
                <div>You already signed in, {userLogin}</div>
            )}
        </PageLayout>
    );
}
