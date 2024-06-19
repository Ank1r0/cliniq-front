import { Link, Outlet } from 'react-router-dom';
import PageLayout from '../../layout/PageLayout';

import axios from 'axios';

import { Paper, Skeleton } from '@mui/material';

import { useContext, useEffect, useState } from 'react';
import { useIsAuthHook } from '../../hooks/useIsAuthHook';
import { CurrentUserContext } from '../../context/currentUserContext';
import { Button, Box } from '@mui/material';

const MedicalRecords = () => {
    const value = useContext(CurrentUserContext);
    const { token, userLogin } = useIsAuthHook();

    useEffect(() => {
        if (userLogin && value.fetchCurrentUser()) value.fetchCurrentUser();
    }, [userLogin]);

    const paperStyle = {
        padding: '50px 20px',
        width: 600,
        margin: '20px auto',
    };
    const [appointments, setAppointments] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);

    const [isNoAppointments, setIsNoAppointments] = useState(false);

    useEffect(() => {
        if (!value?.currentUser?.id) return;
        try {
            // TODO get user info => assigned apppintments
            fetch(
                `http://localhost:9090/api/user/getUserById/${value?.currentUser?.id}/appointments`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                    },
                    'Content-Type': 'application/json',
                }
            )
                .then((res) => res.json())
                .catch((err) => console.log('err: ', err))
                .then((data) => {
                    // відділили свої зустрічі
                    let newData = data?.length
                        ? data.filter((appointment) =>
                              appointment.assignedUsers
                                  ? appointment.assignedUsers.find(
                                        (user) => user.login === userLogin
                                    )
                                  : []
                          )
                        : [];

                    if (!newData?.length) {
                        setIsNoAppointments(true);
                        return;
                    }

                    newData = newData.map((app) => {
                        return {
                            // взяли всі властивості крім assignedUsers
                            ...app,
                            // обрізали юзерів до імені та прізвища
                            assignedUsers: app.assignedUsers
                                ? app.assignedUsers.map((user) => {
                                      return {
                                          name: user.name,
                                          surname: user.surname,
                                      };
                                  })
                                : [],
                        };
                    });

                    console.log('newData: ', newData);
                    const medRecords = newData
                        .filter((item) => item.medicalRecord)
                        ?.map((item) => item.medicalRecord);

                    setAppointments(newData);
                    setMedicalRecords(medRecords);
                });
        } catch (err) {
            console.log('err: ', err);
        }
    }, [value]);

    return (
        <PageLayout>
            <div>Medical records</div>

            <Paper elevation={3} style={paperStyle}>
                {!medicalRecords?.length > 0 && !isNoAppointments ? (
                    <div
                        style={{
                            width: '200px',
                            height: '300px',
                        }}
                    >
                        {/* For variant="text", adjust the height via font-size */}
                        <Skeleton
                            variant="text"
                            sx={{
                                fontSize: '1rem',
                            }}
                        />

                        {/* For other variants, adjust the size with `width` and `height` */}
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton
                            variant="rectangular"
                            width={210}
                            height={60}
                        />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </div>
                ) : (
                    <div>
                        {medicalRecords?.length > 0 &&
                            medicalRecords.map((medRecord, idx) => (
                                <>
                                    <Paper
                                        key={idx}
                                        style={{ background: '#ccccfc' }}
                                    >
                                        <Link
                                            to={`${medRecord?.id?.toString()}`}
                                            elevation={6}
                                            style={{
                                                display: 'block',
                                                margin: '10px',
                                                padding: '15px',
                                                textAlign: 'left',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            Id:
                                            {medRecord?.id}
                                            <br />
                                            About:
                                            {medRecord?.aboutAppo}
                                        </Link>
                                        <Link
                                            elevation={6}
                                            style={{
                                                display: 'block',
                                                margin: '10px',
                                                padding: '15px',
                                                textAlign: 'left',
                                                textDecoration: 'underline',
                                            }}
                                            to={`/appointments/${medRecord?.appointment}`}
                                        >
                                            Show appointment
                                        </Link>
                                    </Paper>
                                </>
                            ))}
                    </div>
                )}
            </Paper>
        </PageLayout>
    );
};

export default MedicalRecords;
