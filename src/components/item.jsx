import React, { useEffect, useState, useRef, useCallback } from 'react';

const Item = ({ itemPosX, itemPosY, itemColor, playerPositionX, ItemEffect }) => {
  const [itemPosition, setItemPosition] = useState(itemPosY);
  const [isInvisible, setIsInvisible] = useState(false);
  const [hasBeenInvisible, setHasBeenInvisible] = useState(false);
  const animationRef = useRef();

  useEffect(() => {
    const moduleScript = document.createElement('script');
    moduleScript.type = 'module';
    moduleScript.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
    document.body.appendChild(moduleScript);

    const noModuleScript = document.createElement('script');
    noModuleScript.noModule = true;
    noModuleScript.src = 'https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js';
    document.body.appendChild(noModuleScript);

    return () => {
      document.body.removeChild(moduleScript);
      document.body.removeChild(noModuleScript);
    };
  }, []);

  const animateItem = useCallback(() => {
    setItemPosition((prev) => prev - 2);

    if (!hasBeenInvisible && itemPosition >= -215 && itemPosition <= -180 && 
        itemPosX - playerPositionX < 155 && itemPosX - playerPositionX > -5) {
      setIsInvisible(true);
      setHasBeenInvisible(true);
      ItemEffect(itemColor);
    }

    if (itemPosition > -300) {
      animationRef.current = requestAnimationFrame(animateItem);
    }
  }, [itemPosition, playerPositionX, itemPosX, hasBeenInvisible, ItemEffect, itemColor]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animateItem);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animateItem]);

  const getIconName = (color) => {
    switch (color) {
      case 'cornflowerblue':
        return 'skull-outline';
      case 'mediumorchid':
        return 'bowling-ball-outline';
      case 'yellow':
        return 'star-outline';
      case 'darksalmon':
        return 'heart-outline';
      default:
        break;
    }
  };

  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${isInvisible ? 'invisible' : ''}`}
      style={{
        position: 'absolute',
        left: `${itemPosX}px`,
        bottom: `${itemPosition}px`,
        backgroundColor: itemColor,
      }}
    >
      <ion-icon name={getIconName(itemColor)}></ion-icon>
    </div>
  );
};

export default Item;
