import React, { useState, useCallback, useRef, useEffect } from "react";
import "../scss/start/start.css";
import "../scss/content/content.css";
import Player from "../components/player";
import SCORE_HEART from "../components/score_heart";
import Ball from "../components/ball";
import Blocks from "../components/blocks";
import Item from "../components/item";

const BlockColliderLeftRight = [
  [5, 68, 129, 190, 251, 312, 373, 434], // left(x座標)
  [67, 128, 189, 250, 311, 372, 433, 494], // right(x座標)
];

const BlockColliderUpDown = [
  [-596, -562, -528, -494, -460, -426, -392, -358, -324, -290, -256, -222, -188, -154, -120, -86, -52, -18], // up (y座標)
  [-563, -529, -495, -461, -427, -393, -359, -325, -291, -257, -223, -189, -155, -121, -87, -53, -19, 15] // down (y座標)
];

const ItemPositionXY = [
  [563,529,495,461,427,393,359,325,291,257,223,189,155,121,87,53,19,-15],//-15*i+34
  [16,77,138,199,260,321,382,443]//16+61*i
];

const initializeBlocks = () => {
  return Array.from({ length: 18 }, () => 
    Array.from({ length: 8 }, () => Math.random() > 0.5)
  );
};


const Game_contents = () => {
  const playBoxRef = useRef(null);

  const [ballX, setBallX] = useState(243);
  const [ballY, setBallY] = useState(155);
  const [isFired, setIsFired] = useState(false);
  const [playBoxDimensions, setPlayBoxDimensions] = useState({ width: 0, height: 0 });
  const [playerPositionX, setPlayerPositionX] = useState(175);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [blockStatus, setBlockStatus] = useState(initializeBlocks);
  const [score, setScore] = useState(0);
  const [isBall, setIsBall] = useState(true);
  const [heartNumber, setHeartNumber] = useState(3);
  const [items, setItems] = useState([]);
  const [isSpeed, setIsSpeed] = useState(false);
  const [isCollisionNone, setIsCollisionNone] = useState(false);
  const [isBarrier,setIsBarrier] = useState(false);
  const [CountHeal,setCountHeal] = useState(0);
  
  


  const getColor = () => {
    const colors = ['orange', 'aquamarine', 'hotpink', 'chartreuse'];
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  };

  const getColor2 = () => {
    const colors = ['cornflowerblue', 'mediumorchid', 'yellow', 'darksalmon'];
    const index = Math.floor(Math.random() * colors.length);
    return colors[index];
  };

  // useCallbackでブロックの色を生成
  const initializeBlockColors = useCallback((blockStatus) => {
    return blockStatus.map((row) =>
      row.map((isVisible) => (isVisible ? getColor() : 'transparent'))
    );
  }, []);

  const initialBlockColors = useRef(initializeBlockColors(blockStatus)).current;

  // console.log(blockStatus);
  // console.log(initialBlockColors);

  useEffect(() => {
    if (playBoxRef.current) {
      const { offsetWidth, offsetHeight } = playBoxRef.current;
      setPlayBoxDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, []);

  const resetBallPosition = () => {
    setBallX(243); 
    setBallY(155); 
    setIsFired(false); 
    setPlayerPositionX(175);
    setIsDragging(false);
    setIsSpeed(false);
    setIsCollisionNone(false);
    setCountHeal(0);
  };

  useEffect(() => {
    if (!isBall && heartNumber > 0) {
      resetBallPosition(); 
      setIsBall(true); 
    }
  }, [isBall, heartNumber]);

  const checkBallFalling = (ballPosX, ballPosY) => {
    if (ballPosX < -10 || ballPosY > 300) {
      setHeartNumber((prev) => prev - 1); 
      setIsBall(false); 
      resetBallPosition(); 
    }
  };

  const generateItem = (rowIndex, colIndex) => {
    if (Math.random() < 0.03) {  // 3%の確率でアイテム生成
      const itemX = ItemPositionXY[1][colIndex];
      const itemY = ItemPositionXY[0][rowIndex];
      const itemColor = getColor2();
  
      setItems((prevItems) => [
        ...prevItems,
        { x: itemX, y: itemY, color: itemColor, id: `${rowIndex}-${colIndex}`}
      ]);
    }
  };

  const [collisionDirection, setCollisionDirection] = useState({
    left: false,
    right: false,
    up: false,
    down: false
  });

  const checkBlockCollision = (ballPosX, ballPosY, ballRadius) => {
    let updatedCollisionDirection = {
      left: false,
      right: false,
      up: false,
      down: false,
    };
  
    setBlockStatus((prevStatus) =>
      prevStatus.map((row, rowIndex) =>
        row.map((isVisible, colIndex) => {
          if (!isVisible) return false;
  
          const left = BlockColliderLeftRight[0][colIndex];
          const right = BlockColliderLeftRight[1][colIndex];
          const up = BlockColliderUpDown[0][rowIndex];
          const down = BlockColliderUpDown[1][rowIndex];
  
          if (
            ballPosX + ballRadius + 7 >= left &&
            ballPosX - ballRadius - 7 <= right &&
            ballPosY + ballRadius + 7 >= up &&
            ballPosY - ballRadius - 7 <= down
          ) {
            if (ballPosX + ballRadius + 7 > left && ballPosX - ballRadius < left + 10 && ballPosY >= up && ballPosY < down ){
              updatedCollisionDirection.left = true;
              setScore(score + 50)
              generateItem(rowIndex, colIndex);
              return false; 
            }
            if (ballPosX - ballRadius -7 < right && ballPosX + ballRadius > right - 10 && ballPosY > up && ballPosY <= down ) {
              updatedCollisionDirection.right = true;
              setScore(score + 50 )
              generateItem(rowIndex, colIndex);
              return false; 
            }
            if (ballPosY + ballRadius + 7> up && ballPosY - ballRadius < up + 10 && ballPosX >= left && ballPosX < right ) {
              updatedCollisionDirection.up = true;
              setScore(score + 50 )
              generateItem(rowIndex, colIndex);
              return false; 
            }
            if (ballPosY - ballRadius - 7< down && ballPosY + ballRadius > down - 10 && ballPosX > left && ballPosX <= right) {
              updatedCollisionDirection.down = true;
              setScore(score + 50 )
              generateItem(rowIndex, colIndex);
              return false; 
            }
  
          }
          return true;
        })
      )
    );
  
    setCollisionDirection(updatedCollisionDirection);
  };

  const updateRandomBlocks = useCallback(() => {
    setBlockStatus((prevStatus) => {
     
      const falseBlocks = prevStatus.flatMap((row, rowIndex) =>
        row.map((isVisible, colIndex) => 
          !isVisible ? { rowIndex, colIndex } : null
        ).filter(Boolean)
      );
  
     
      const newTrueCount = Math.min(30, falseBlocks.length); //最大30個 
  
      const selectedBlocks = [];
      while (selectedBlocks.length < newTrueCount) {
        const randomIndex = Math.floor(Math.random() * falseBlocks.length);
        selectedBlocks.push(falseBlocks.splice(randomIndex, 1)[0]);
      }
  
      const updatedStatus = prevStatus.map((row, rowIndex) =>
        row.map((isVisible, colIndex) =>
          selectedBlocks.some(
            (block) => block.rowIndex === rowIndex && block.colIndex === colIndex
          )
            ? true
            : isVisible
        )
      );
  
      selectedBlocks.forEach(({ rowIndex, colIndex }) => {
        initialBlockColors[rowIndex][colIndex] = getColor();
      });
  
      return updatedStatus;
    });
  }, [initialBlockColors]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setBlockStatus((prevStatus) => {
        const trueCount = prevStatus.flat().filter((block) => block).length;
  
        if (trueCount <= 20) {//20個以下
          updateRandomBlocks();
        }
  
        return prevStatus;
      });
    }, 3000); //3秒
  
    return () => clearInterval(timer);
  }, [updateRandomBlocks]);

  const toggleSpeed = () => {
    setIsSpeed((prev) => {
      if (!prev) {
        setIsCollisionNone(false); 
      }
      return true;
    });
  };

  const toggleCollisionNone = () => {
    setIsCollisionNone((prev) => {
      if (!prev) {
        setIsSpeed(false); 
      }
      return true;
    });
  };

  const ItemEffect = (color) => {
    switch (color) {
      case 'cornflowerblue':
        toggleSpeed();
        setTimeout(() => {
          setIsSpeed(false);
        }, 10000); // 10秒
        break;
      case 'mediumorchid':
        toggleCollisionNone();
        setTimeout(() => {
          setIsCollisionNone(false);
        }, 10000); // 10秒
        break;
      case 'yellow':
        setIsBarrier(true);
        break;
      case 'darksalmon':
        setCountHeal((count) => count + 1);
        break;
      default:
        break;
    }
  }
  

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    if (!isFired) setIsFired(true);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const newPosition = Math.max(0, Math.min(playerPositionX + deltaX, 350));
        setPlayerPositionX(newPosition);
        setStartX(e.clientX);
      }
    },
    [isDragging, startX, playerPositionX]
  );

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'r' || event.key === 'R') {
        window.location.reload();//リセット
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); 

  return (
    <div className="App">
      <div>
        <SCORE_HEART
         score = {score} 
         heartNumber = {heartNumber} 
         CountHeal = {CountHeal} 
         setHeartNumber = {setHeartNumber}
         setCountHeal = {setCountHeal}
        />
        <div className="play_box" ref={playBoxRef}>
          {/*各行ごとに Blocks コンポーネントを配置*/}
          {blockStatus.map((row, rowIndex) => (
            <Blocks
              key={rowIndex}
              rowStatus={row}
              rowIndex={rowIndex}
              blockStatus={blockStatus}
              blockColors={initialBlockColors} //初期化した色を渡す
            />
          ))}
          {items.map((item) => (
            <Item
              key={item.id}
              itemPosX={item.x}
              itemPosY={item.y}
              itemColor={item.color}
              playerPositionX={playerPositionX}
              ItemEffect={ItemEffect}
            />
          ))}
        </div>
        <div className="player_side" onMouseDown={handleMouseDown}>
          <div className="flex">
            {isBall && <Ball
            initialX={ballX}
            initialY={ballY}
            isFired={isFired}
            boxDimensions={playBoxDimensions}
            playerPositionX={playerPositionX}
            checkBlockCollision={checkBlockCollision} // 衝突判定関数を渡す
            collisionDirection={collisionDirection} // 衝突方向情報を渡す
            checkBallFalling={checkBallFalling}//ボール落下情報を渡す
            isSpeed = {isSpeed}
            isCollisionNone = {isCollisionNone}
            isBarrier = {isBarrier}
            setIsBarrier = {setIsBarrier}
          />}
            {/* ボールが消えた時にplayerが動かないようにするための要素*/}
            <div className="w-4 h-4"></div>
          </div>
          <Player positionX={playerPositionX} isBarrier = {isBarrier}/>
        </div>
      </div>
      {heartNumber === 0 && <div className="game_over">
              <div className="game_over_para">
                GAME_OVER
                <div className="game_over_para_restart">
                  Press R to restart
                </div>
              </div>
      </div>}
    </div>
  );
};

export default Game_contents;
