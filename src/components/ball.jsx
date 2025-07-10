import React, { useState, useRef, useEffect, useCallback } from "react";

const Ball = ({
  initialX,
  initialY,
  isFired,
  boxDimensions,
  playerPositionX,
  checkBlockCollision,
  collisionDirection,
  checkBallFalling,
  isSpeed,
  isCollisionNone,
  isBarrier,
  setIsBarrier
}) => {
  const [ballX, setBallX] = useState(initialX);
  const [ballY, setBallY] = useState(initialY);
  const [evenX, setEvenX] = useState(false);
  const [evenY, setEvenY] = useState(false);

  let ballSpeedX = (isSpeed ? -10 : -5) * Math.pow(-1, evenX + 2);
  let ballSpeedY = (isSpeed ? -10 : -5) * Math.pow(-1, evenY + 2);

  const vectorXRef = useRef(ballSpeedX);
  const vectorYRef = useRef(ballSpeedY);
  const animationRef = useRef();

  const updateBallPosition = useCallback(() => {
    if (!isFired) {
      setBallX(initialX);
      setBallY(initialY);
      return;
    }

    vectorXRef.current = ballSpeedX;
    vectorYRef.current = ballSpeedY;

    let nextX = ballX + vectorXRef.current;
    let nextY = ballY + vectorYRef.current;

    checkBlockCollision(nextX, nextY, 5);
    checkBallFalling(nextX, nextY);

    if ((collisionDirection.left || collisionDirection.right) && !isCollisionNone) {
      vectorXRef.current *= -1;
      setEvenX((even) => !even);
    }
    if ((collisionDirection.up || collisionDirection.down) && !isCollisionNone) {
      vectorYRef.current *= -1;
      setEvenY((even) => !even);
    }

    if ((nextX <= 0 || nextX >= boxDimensions.width - 16) && nextY < 300) {
      vectorXRef.current *= -1;
      setEvenX((even) => !even);
    }

    const isWithinPlayer =
      nextY > 160 &&
      nextY <= 170 &&
      nextX >= playerPositionX &&
      nextX <= playerPositionX + 150;
    if (isWithinPlayer) {
      nextY = 160;
      vectorYRef.current *= -1;
      setEvenY((even) => !even);
    }

    if (nextY <= -boxDimensions.height || nextY >= boxDimensions.height) {
      vectorYRef.current *= -1;
      setEvenY((even) => !even);
    }

    if(isBarrier && nextY > 175){
      vectorYRef.current *= -1;
      setEvenY((even) => !even);
      setIsBarrier(false);
    }

    setBallX(nextX);
    setBallY(nextY);

    animationRef.current = requestAnimationFrame(updateBallPosition);
  }, [
    isFired,
    boxDimensions,
    ballX,
    ballY,
    playerPositionX,
    initialX,
    initialY,
    checkBlockCollision,
    collisionDirection,
    checkBallFalling,
    ballSpeedX,
    ballSpeedY,
    isCollisionNone,
    isBarrier,
    setIsBarrier
  ]);

  useEffect(() => {
    if (isFired) {
      animationRef.current = requestAnimationFrame(updateBallPosition);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isFired, updateBallPosition]);

  return (
    <div
      className={`w-4 h-4 rounded-full ${
        isSpeed ? "bg-red-500" : isCollisionNone ? "bg-green-400" : "bg-white"
      }`}
      style={{
        transform: `translate(${ballX}px, ${ballY}px)`,
      }}
    ></div>
  );
};

export default Ball;
