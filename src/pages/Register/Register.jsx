import { useState } from 'react';
import PageLayout from '../../layout/PageLayout';
import { TextField, Box, Typography, Button } from '@mui/material';
import { useIsAuthHook } from '../../hooks/useIsAuthHook';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function () {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [message, setMessage] = useState('');
    const Navigate = useNavigate();

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
        const authData = { name, surname, login, password };

        try {
            const { data } = await axios
                .post('http://localhost:9090/api/auth/signup', authData)
                .then(function (response) {
                    return response;
                })
                .catch(function (error) {
                    console.log(error);
                });
            console.log('On send', data);
            if (data?.token) {
                localStorage.setItem('token', data.token);
                setMessage('Register is true');
            }
        } catch (err) {
            console.log(err);
        } finally {
            Navigate('/login');
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
                            width: '25ch',
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
                        Register
                    </Typography>
                    <Box sx={{ maxWidth: '315px' }}>
                        <TextField
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id="outlined-basic"
                            label="Name:"
                            variant="outlined"
                        />
                        <TextField
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            id="outlined-basic"
                            label="Surname:"
                            variant="outlined"
                        />
                        <TextField
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            id="outlined-basic"
                            label="Login:"
                            variant="outlined"
                        />
                        <TextField
                            value={password}
                            onChange={(e) =>
                                onChangePasswordHandler(e.target.value)
                            }
                            id="outlined-basic"
                            label="Password:"
                            variant="outlined"
                        />
                        <Button
                            type="submit"
                            sx={{ width: '100%' }}
                            variant="contained"
                        >
                            Register
                        </Button>
                    </Box>
                    {message}
                </Box>
            ) : (
                <div>You are already signed in, {userLogin}</div>
            )}
        </PageLayout>
    );
}
