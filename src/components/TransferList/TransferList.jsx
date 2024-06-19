import * as React from 'react';
import { useState } from 'react';

import axios from 'axios';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Typography, Modal } from '@mui/material';
import { useIsAuthHook } from '../../hooks/useIsAuthHook';
import { times, dataMlsc } from '../../constants/timeline';

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

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function TransferList({
    saveDoctorsCallback,
    users,
    createdDate,
}) {
    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([]);
    const [right, setRight] = React.useState([]);

    const [open, setOpen] = useState(false);

    const { token } = useIsAuthHook();

    const [doctorTimes, setDoctorTimes] = useState([]);

    const getDoctors = async () => {
        try {
            const { data } = await axios.get(
                `http://localhost:9090/api/user/getAllDoctor`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            // щоб лікарі не дублювалися
            let arr = data.filter(
                (item) => !users.find((item2) => item2.id === item.id) && item
            );

            arr = arr.filter((item) => {
                let hours = 0;
                for (let i = 0; i < item.calendarList.length; i++) {
                    console.log(
                        'item.calendarList[i].date',
                        item.calendarList[i].date
                    );
                    console.log('createdDate', createdDate);
                    if (+item.calendarList[i].date === +createdDate) {
                        hours += 1;
                    }
                }

                console.log('hours', hours);
                console.log('times?.length', times?.length);
                return hours !== times?.length;
            });

            console.log('arr', arr);

            setLeft(arr);
        } catch (err) {
            console.log(err);
        }
    };

    React.useEffect(() => {
        if (token && users) getDoctors();
    }, [token, users]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const infoDoctorHandler = (item) => {
        setDoctorTimes(item?.calendarList || []);
        setOpen(true);
    };

    const createTimeLine = () => {
        const doctorTimess = doctorTimes?.map((time) => time.visit);

        const currentDateItem = doctorTimes?.filter((item) => {
            console.log('item.date', item.date);
            console.log('dataMlsc', dataMlsc);
            return item.date === dataMlsc;
        })?.[0];

        const timess = times.map((time) => Object.values(time)?.[0]);

        return (
            <div>
                {new Date(Number(currentDateItem?.date)).toDateString()}
                {timess.map((item1) =>
                    doctorTimess.find((item2) => {
                        return item1 === item2;
                    })?.[0] ? (
                        <div style={{ textDecoration: 'line-through' }}>
                            {item1}
                        </div>
                    ) : (
                        <div>{item1}</div>
                    )
                )}
            </div>
        );
    };

    const customList = (items) => (
        <Paper sx={{ width: 300, height: 600, overflow: 'auto' }}>
            <List dense component="div" role="list">
                {items.map((value, idx) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItemButton
                            key={idx}
                            role="listitem"
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                id={labelId}
                                primary={`${value.specialisation} ${value.name} ${value.surname}`}
                            />
                            <Button onClick={() => infoDoctorHandler(value)}>
                                Info
                            </Button>
                            <Modal
                                open={open}
                                onClose={() => setOpen(false)}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <Typography
                                        id="modal-modal-title"
                                        variant="h6"
                                        component="h2"
                                    >
                                        Text in a modal
                                    </Typography>
                                    <Typography
                                        id="modal-modal-description"
                                        sx={{ mt: 2 }}
                                    >
                                        {createTimeLine()}
                                        {/* {times.map((time) => (
                                            <div>
                                                {Object.values(time)?.[0]}
                                            </div>
                                        ))} */}
                                    </Typography>
                                </Box>
                            </Modal>
                        </ListItemButton>
                    );
                })}
            </List>
        </Paper>
    );

    return (
        <>
            <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
            >
                <Grid item>{customList(left)}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label="move all right"
                        >
                            ≫
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="small"
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList(right)}</Grid>
            </Grid>
            <Box sx={{ textAlign: 'right' }}>
                <Button
                    variant="outlined"
                    onClick={() => saveDoctorsCallback(right)}
                >
                    Save doctors
                </Button>
            </Box>
        </>
    );
}
