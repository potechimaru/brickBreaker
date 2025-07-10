import React from 'react';

const Block = ({ blockStatus, blockColors, rowIndex, colIndex }) => {
  const isVisible = blockStatus[rowIndex][colIndex];
  const bgColor = blockColors[rowIndex][colIndex];

  return (
    <div
      className={`block ${!isVisible ? 'invisible' : ''}`}
      style={{
        backgroundColor: bgColor
      }}
    ></div>
  );
};

export default Block;
