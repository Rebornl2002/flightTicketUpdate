import classNames from 'classnames/bind';
import styles from './MyFlight.module.scss';
import { useEffect } from 'react';

import { BOOKED_URL } from '../../utils/config';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import GetAllData from '../GetAllData';
import Header from '../DefaultPage/Header';

import { toast } from 'react-toastify';
import ToastCustom from '../../Toast';

const cx = classNames.bind(styles);

function MyFlight() {
    const [data, setData] = useState('');
    const [CodeTicket, setCodeTicket] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    async function fetchAPI() {
        try {
            let response = await fetch(`${BOOKED_URL}/search/getInfoBookedBySearch?CodeTicket=${CodeTicket}`);
            console.log(CodeTicket);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            let data1 = await response.json();

            if (!data1 || !data1.data || data1.data.length === 0) {
                setShowInfo(false);
                toast.error('Mã code không được tìm thấy');
                throw new Error('Not Found');
            }
            setData(data1.data[0]);
            console.log(data);
            setShowInfo(true);
            return data1;
        } catch (error) {
            // Handle the error here
            console.error(error);

            // You can also set an error state or show an error message to the user
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.target.id === 'code') {
            handleSearch();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [CodeTicket]);

    const handleSearch = () => {
        fetchAPI();
    };

    return (
        <div className={cx('wrapper')}>
            <Header />

            <span className={cx('search')}>
                {/* Nhập mã CODE của bạn:&nbsp;&nbsp;&nbsp; */}
                Nhập mã CODE của bạn:&nbsp;&nbsp;&nbsp;
                <input
                    type="text"
                    id="code"
                    onChange={(e) => {
                        setCodeTicket(e.target.value);
                        setShowInfo(false);
                    }}
                ></input>
                <button onClick={handleSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </span>

            {showInfo && (
                <div className={cx('show')}>
                    <GetAllData data={data} type="find" />
                </div>
            )}
            <ToastCustom />
        </div>
    );
}

export default MyFlight;
