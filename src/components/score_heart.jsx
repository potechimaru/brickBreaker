import React, { useEffect, useState } from 'react';
import heart from "../image/heart.png";

const Score_heart = ({ score, heartNumber, CountHeal, setHeartNumber, setCountHeal }) => {
  const [heartWidth, setHeartWidth] = useState(0);
  const [heartPosition, setHeartPosition] = useState(0);

  useEffect(() => {
    if(heartNumber < 5){
      if (CountHeal === 1) {
        setHeartWidth(20);
        setHeartPosition(10);
      } else if (CountHeal === 2) {
        setHeartWidth(30);
        setHeartPosition(4);
      } else if (CountHeal === 3) {
        setHeartNumber(() => heartNumber + 1);
        setHeartWidth(0); 
        setCountHeal(0); 
      } else if (CountHeal === 0) {
        setHeartWidth(0);
      }
    }
    else{
      setCountHeal(0);
    }
  }, [CountHeal, setHeartNumber, setCountHeal, heartNumber]);

  return (
    <div className="flex mb-3">
      <div className="score">Score: {score}</div>
      <div className="heart_container">
        <img 
          style={{
            width: `${heartWidth}px`, 
            height: `${heartWidth}px`, 
            marginTop: `${heartPosition}px`
          }} 
          alt="heart-outline" 
          src={heart} 
        />
        {Array.from({ length: heartNumber }).map((_, index) => (
          <img key={index} alt="heart-outline" src={heart} className="heart" />
        ))}
      </div>
    </div>
  );
};

export default Score_heart;
