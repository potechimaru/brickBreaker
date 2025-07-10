import Block from "./block";

const Blocks = ({ rowStatus, rowIndex, blockStatus, blockColors}) => {
  return (
    <div className="flex justify-center">
      {rowStatus.map((isVisible, colIndex) => (
        <Block
          key={`${rowIndex}-${colIndex}`} // 一意のキーを設定
          isVisible={isVisible} // 表示・非表示の状態を渡す
          rowIndex={rowIndex} // 行番号
          colIndex={colIndex} // 列番号
          blockStatus = {blockStatus}
          blockColors = {blockColors}
        />
      ))}
    </div>
  );
};

export default Blocks;
