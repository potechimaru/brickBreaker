import React from "react";

const Player = ({ positionX, isBarrier }) => {
  return (
    <>
      <div
        className="player"
        style={{
          transform: `translateX(${positionX}px)`,
        }}
      ></div>
      <div
        className={`w-full h-1 bg-orange-300 mt-5 ${!isBarrier ? "invisible" : ""}`}
      ></div>
    </>
  );
};

export default Player;
