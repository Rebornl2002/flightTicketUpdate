import Header from '../DefaultPage/Header';
import classNames from 'classnames/bind';
import styles from './CancelTicket.module.scss';

import { useState } from 'react';

import { toast } from 'react-toastify';
import ToastCustom from '../../Toast';
import * as React from 'react';

import MenuItem from '@mui/material/MenuItem';

import CancelIcon from '@mui/icons-material/Cancel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import axios from 'axios';

const cx = classNames.bind(styles);

function CancelTicket() {
    const selectCustomer = [
        {
            value: 'Adult',
            label: 'Người lớn',
        },
        {
            value: 'Children',
            label: 'Trẻ em',
        },
        {
            value: 'Baby',
            label: 'Em bé',
        },
    ];

    const [data, setData] = useState({
        Customer: 'Adult',
        CodeTicket: '',
        ID_Card: '',
        UserName: '',
        Email: '',
        FlightNumber: '',
        Phone: '',
        ID_Info: '',
    });

    const [ID_Info, setID_Info] = useState();

    const [errors, setErrors] = useState({});
    const newErrors = { ...errors };

    const handleChangeCommon = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setData({ ...data, [name]: value });

        if (value.trim() === '') {
            newErrors[name] = 'Trường này không được bỏ trống';
        } else {
            delete newErrors[name];
        }
        setErrors(newErrors);
    };

    const handleChangeAdult = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setData({ ...data, [name]: value });

        if (value.trim() === '') {
            newErrors[name] = 'Trường này không được bỏ trống';
        } else {
            delete newErrors[name];
        }
        setErrors(newErrors);
    };
    const handleChangeAnother = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setData({ ...data, [name]: value });

        if (value.trim() === '') {
            newErrors[name] = 'Trường này không được bỏ trống';
        } else {
            delete newErrors[name];
        }
        setErrors(newErrors);
    };
    const handleClear = () => {
        setData({
            Customer: 'Adult',
            CodeTicket: '',
            ID_Card: '',
            UserName: '',
            Email: '',
            FlightNumber: '',
            Phone: '',
            ID_Info: '',
        });
    };

    const handleCancel = async () => {
        if (data.Customer === 'Adult') {
            validateAdult();
            console.log('cahy vao day chu');
        } else validateAnother();

        console.log('xem loi', errors);
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        console.log('Lấy data:', data);
        const fetchResult = await fetchAPICheck(data);
        const fetchCheckExist = await checkExist(data);

        console.log('in ra id info', fetchResult);

        if (!fetchResult) {
            toast.error('Thông tin không chính xác');
        } else {
            if (fetchCheckExist) {
                toast.warning('Yêu cầu của quý khách đang trong quá trình xử lý, vui lòng chờ đợi');
            } else {
                toast.success('Yêu cầu hủy vé đã được gửi đi, sẽ có thông báo sau vài phút');
                handleClear();

                const dataPost = {
                    Customer: data.Customer,
                    CodeTicket: data.CodeTicket,
                    FlightNumber: data.FlightNumber,
                    UserName: data.UserName,
                    ID_Info: fetchResult[0]._id,
                };

                console.log('dataPost', dataPost);

                if (data.Email && data.ID_Card) {
                    dataPost.Email = data.Email;
                    dataPost.ID_Card = data.ID_Card;
                }
                if (data.Phone) {
                    dataPost.Phone = data.Phone;
                }

                if (data) {
                    axios
                        .post('http://localhost:4000/cancel', dataPost)
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((res) => {
                            console.log(res);
                        });
                }
            }
        }
    };
    const fetchAPICheck = async (data) => {
        console.log(data);
        try {
            let response = await fetch(
                `http://localhost:4000/info/search/fetchAPICancelInfoTicket?CodeTicket=${data.CodeTicket}&FlightNumber=${data.FlightNumber}&UserName=${data.UserName}&ID_Card=${data.ID_Card}&Email=${data.Email}`,
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            let data1 = await response.json();
            setID_Info(data1.data[0]._id);
            console.log('Lay id', data1.data[0]);

            return data1.data;
        } catch (error) {
            console.error(error);
        }
    };

    const checkExist = async (data) => {
        console.log(data);
        try {
            let response = await fetch(
                `http://localhost:4000/cancel/getCancel?Customer=${data.Customer}&CodeTicket=${data.CodeTicket}&ID_Card=${data.ID_Card}`,
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            let data1 = await response.json();
            // console.log(data1.data);

            return data1.data;
        } catch (error) {
            console.error(error);
        }
    };

    const validateAdult = () => {
        if (data.CodeTicket.trim() === '') {
            newErrors['CodeTicket'] = 'Trường này không được bỏ trống';
        }
        if (data.ID_Card.trim() === '') {
            newErrors['ID_Card'] = 'Trường này không được bỏ trống';
        }

        if (data.UserName.trim() === '') {
            newErrors['UserName'] = 'Trường này không được bỏ trống';
        }

        if (data.Email.trim() === '') {
            newErrors['Email'] = 'Trường này không được bỏ trống';
        }

        if (data.FlightNumber.trim() === '') {
            newErrors['FlightNumber'] = 'Trường này không được bỏ trống';
        }
    };

    const validateAnother = () => {
        if (data.CodeTicket.trim() === '') {
            newErrors['CodeTicket'] = 'Trường này không được bỏ trống';
        }
        if (data.UserName.trim() === '') {
            newErrors['UserName'] = 'Trường này không được bỏ trống';
        }
        if (data.FlightNumber.trim() === '') {
            newErrors['FlightNumber'] = 'Trường này không được bỏ trống';
        }
        if (data.Phone.trim() === '') {
            newErrors['Phone'] = 'Trường này không được bỏ trống';
        }
    };
    return (
        <>
            <div className={cx('wrapper')}>
                <Header />

                <div className={cx('content')}>
                    <div>
                        <TextField
                            name="Customer"
                            select
                            label="Khách hàng"
                            value={data.Customer}
                            onChange={handleChangeCommon}
                            sx={{ width: '300px', marginRight: '20px' }}
                            margin="normal"
                        >
                            {selectCustomer.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            name="UserName"
                            label="Họ và tên"
                            variant="outlined"
                            margin="normal"
                            value={data.UserName}
                            helperText={errors['UserName'] || ''}
                            onChange={handleChangeCommon}
                            sx={{
                                width: '300px',
                                '& .MuiFormHelperText-root': {
                                    color: errors['UserName'] ? 'red' : 'inherit',
                                },
                            }}
                        />
                    </div>

                    {data.Customer === 'Adult' && (
                        <>
                            <div>
                                {' '}
                                <TextField
                                    name="ID_Card"
                                    label="Số CCCD"
                                    variant="outlined"
                                    margin="normal"
                                    value={data.ID_Card}
                                    helperText={errors['ID_Card'] || ''}
                                    onChange={handleChangeAdult}
                                    sx={{
                                        width: '300px',
                                        marginRight: '20px',
                                        '& .MuiFormHelperText-root': {
                                            color: errors['ID_Card'] ? 'red' : 'inherit',
                                        },
                                    }}
                                />
                                <TextField
                                    name="Email"
                                    label="Email"
                                    variant="outlined"
                                    margin="normal"
                                    value={data.Email}
                                    helperText={errors['Email'] || ''}
                                    onChange={handleChangeAdult}
                                    sx={{
                                        width: '300px',
                                        '& .MuiFormHelperText-root': {
                                            color: errors['Email'] ? 'red' : 'inherit',
                                        },
                                    }}
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <TextField
                            name="CodeTicket"
                            label="Mã vé"
                            variant="outlined"
                            margin="normal"
                            value={data.CodeTicket}
                            helperText={errors['CodeTicket'] || ''}
                            onChange={handleChangeCommon}
                            sx={{
                                width: '300px',
                                marginRight: '20px',
                                '& .MuiFormHelperText-root': {
                                    color: errors['CodeTicket'] ? 'red' : 'inherit',
                                },
                            }}
                        />
                        <TextField
                            name="FlightNumber"
                            label="Số hiệu chuyến bay"
                            variant="outlined"
                            margin="normal"
                            value={data.FlightNumber}
                            helperText={errors['FlightNumber'] || ''}
                            onChange={handleChangeCommon}
                            sx={{
                                width: '300px',
                                '& .MuiFormHelperText-root': {
                                    color: errors['FlightNumber'] ? 'red' : 'inherit',
                                },
                            }}
                        />
                    </div>

                    {data.Customer !== 'Adult' && (
                        <div>
                            <TextField
                                name="Phone"
                                label="Số điện thoại người giám hộ"
                                variant="outlined"
                                margin="normal"
                                value={data.Phone}
                                helperText={errors['Phone'] || ''}
                                onChange={handleChangeAnother}
                                sx={{
                                    width: '300px',
                                    '& .MuiFormHelperText-root': {
                                        color: errors['Phone'] ? 'red' : 'inherit',
                                    },
                                }}
                            />
                        </div>
                    )}
                </div>

                <div className={cx('button')}>
                    <Button variant="outlined" sx={{ fontWeight: 600, marginRight: '30px' }} onClick={handleClear}>
                        <CleaningServicesIcon sx={{ marginRight: '10px' }} />
                        Xóa bỏ
                    </Button>
                    <Button variant="outlined" color="error" sx={{ fontWeight: 600 }} onClick={handleCancel}>
                        <CancelIcon sx={{ marginRight: '10px' }} />
                        Hủy vé
                    </Button>
                </div>
                <ToastCustom />
            </div>
        </>
    );
}

export default CancelTicket;
