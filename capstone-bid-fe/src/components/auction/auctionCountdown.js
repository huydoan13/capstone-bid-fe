import React, { useEffect, useState } from 'react';

const AuctionCountdown = ({ endTime, beginTime }) => {
  const calculateTimeLeft = () => {
    const currentTime = new Date().getTime();
    const endTimestamp = new Date(endTime).getTime();
    const beginTimestamp = new Date(beginTime).getTime();

    if (currentTime < beginTimestamp) {
      // Auction has not started yet
      return beginTimestamp - currentTime;
    }

    // Auction is ongoing or has ended
    return Math.max(0, endTimestamp - currentTime);
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, beginTime]);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <p style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
        Thời Gian Đấu Giá Còn Lại: <br/>{formatTime(timeLeft)}
      </p>
    </div>
  );
};

export default AuctionCountdown;
