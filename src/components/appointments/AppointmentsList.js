import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Paper, Skeleton, Modal, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { useIsAuthHook } from '../../hooks/useIsAuthHook';
import { CurrentUserContext } from '../../context/currentUserContext';
import { Button, Box } from '@mui/material';
import { dataMlsc, dateStr } from '../../constants/timeline';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { parse, format } from 'date-fns';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function AppointmentsList() {
    const value = useContext(CurrentUserContext);
    const { token, userLogin } = useIsAuthHook();
    const [isCalendarModal, setCalendarModal] = useState(false);
    const [calendarValue, setCalendarValue] = useState();

    useEffect(() => {
        if (userLogin?.length && value.fetchCurrentUser())
            value.fetchCurrentUser();
    }, [userLogin]);

    const paperStyle = {
        padding: '50px 20px',
        width: 600,
        margin: '20px auto',
    };
    const [appointments, setAppointments] = useState([]);
    const [isNoAppointments, setIsNoAppointments] = useState(false);

    const getUserAppointments = () => {
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
                    setAppointments(newData);
                });
        } catch (err) {
            console.log('err: ', err);
        }
    };

    useEffect(() => {
        if (!value?.currentUser?.id) return;
        getUserAppointments();
    }, [value]);

    const assignCurrentUserToNewAppointment = async (newAppo) => {
        try {
            const { data } = await axios.patch(
                `http://localhost:9090/api/user/updateUserWithAppoById/${value?.currentUser?.id}/appo/${newAppo?.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Data of assignCurrentUserToNewAppointment: ', data);
            getUserAppointments();
        } catch (err) {
            console.log(err);
        }
    };

    const addAppo = async (e) => {
        const searchedDate =
            appointments?.length &&
            appointments.find((app) => {
                return +app.createdDate === +dataMlsc;
            });

        if (searchedDate) {
            const question =
                'You have already have an appointment for today. You can edit it. Do you want to create an appointment for some next day?';
            const result = window.confirm(question);
            if (result) {
                setCalendarModal(true);
            }
            return;
        } else {
            saveAppointment();
        }
    };

    const formatDate = (dateString) => {
        console.log('dateString: ', dateString);
        const parsedDate = parse(dateString, 'MM/dd/yyyy', new Date());
        return format(parsedDate, 'yyyy-MM-dd');
    };

    const saveAppointment = async () => {
        const newData = {
            videoCallCode: uuidv4()?.split('-')?.[0],
            medicalRecord: {
                aboutAppo:
                    'The information about you appointment will be added after the call',
            },
            // createdDate: +dataMlsc,
        };

        if (calendarValue) {
            const searchedDate =
                appointments?.length &&
                appointments.find((app) => {
                    console.log('app.createdDate: ' + app.createdDate);
                    console.log(
                        '+new Date(calendarValue).getTime(): ' +
                            +new Date(calendarValue).getTime()
                    );

                    return (
                        +app.createdDate === +new Date(calendarValue).getTime()
                    );
                });

            console.log('searchedDate: ', searchedDate);

            if (searchedDate) {
                alert('Data already busy');
                // setCalendarValue(undefined);
                return;
            } else {
                const d = new Date(calendarValue.toString());
                // const year = d.getFullYear();
                // const month = d.getMonth() + 1;
                // const day = d.getDate();

                newData.createdDate = d.getTime();
                setCalendarModal(false);
            }
        } else {
            newData.createdDate = +dataMlsc;
        }

        try {
            const { data } = await axios
                .post(
                    `http://localhost:9090/api/appointment/addAppo`,
                    newData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                )
                .catch(function (error) {
                    console.log(error);
                });

            await assignCurrentUserToNewAppointment(data);
        } catch (err) {
            console.log(err);
        }
    };

    const chooseDateHandler = () => {
        saveAppointment();
    };

    const onDeleteAppo = async (e, id) => {
        e.preventDefault();

        const userId = value?.currentUser?.id;
        const appId = id;

        if (!userId && !appId) {
            return;
        }
        try {
            await axios
                .delete(
                    `http://localhost:9090/api/user/deleteAppoFromUserById/${userId}/appo/${appId}`,
                    {}
                )
                .then(function (response) {
                    return response;
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (err) {
            console.log(err);
        } finally {
            window.location.reload();
        }
    };

    return (
        <>
            <Box sx={{ textAlign: 'right' }}>
                <Button variant="contained" onClick={addAppo}>
                    Create appointment
                </Button>
            </Box>
            <Paper elevation={3} style={paperStyle}>
                {
                    <div>
                        You have {appointments.length}{' '}
                        {appointments.length != 1
                            ? 'appointments'
                            : 'appointment'}
                    </div>
                }

                {!appointments?.length > 0 && !isNoAppointments ? (
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
                        {appointments?.length > 0 &&
                            appointments.map((appointment, idx) => (
                                <Link to={`${appointment?.id?.toString()}`}>
                                    <Paper
                                        elevation={6}
                                        style={{
                                            margin: '10px',
                                            padding: '15px',
                                            textAlign: 'left',
                                            position: 'relative',
                                        }}
                                        key={appointment.id}
                                    >
                                        Created date:{' '}
                                        {dateStr(appointment.createdDate)}
                                        <br />
                                        Number: {appointment.id}
                                        <br />
                                        Video call code:{' '}
                                        {appointment.videoCallCode}
                                        <br />
                                        Members:
                                        {appointment?.assignedUsers?.length >
                                            0 &&
                                            appointment.assignedUsers.map(
                                                (user, index) => (
                                                    <div>
                                                        {index + 1}.{' '}
                                                        {user?.name}{' '}
                                                        {user?.surname}
                                                    </div>
                                                )
                                            )}
                                        <Button
                                            style={{
                                                position: 'absolute',
                                                right: 0,
                                                top: '15px',
                                            }}
                                            onClick={(e) =>
                                                onDeleteAppo(e, appointment.id)
                                            }
                                        >
                                            X
                                        </Button>
                                    </Paper>
                                </Link>
                            ))}
                    </div>
                )}
            </Paper>

            <Modal
                open={isCalendarModal}
                onClose={() => setCalendarModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Choose date
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            minDate={dayjs(+dataMlsc)}
                            maxDate={dayjs(+dataMlsc)
                                .set('day', 13)
                                .startOf('hour')}
                            // value={value}
                            onChange={(newValue) => setCalendarValue(newValue)}
                        />
                        <Button onClick={chooseDateHandler}>Choose date</Button>
                    </LocalizationProvider>
                </Box>
            </Modal>
        </>
    );
}
