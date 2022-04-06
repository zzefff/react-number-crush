import { useState } from 'react';
import { BlockUnit } from '../types/index'

const useBlocks = (width = 8, height = 4) => {  
  // 这里需要保证产生的每个值都是偶数，否则游戏无法进行
  const randomValues = (() => {
    const max = width * height;
    const VALUES = Array.from({length: max * .8}, (e, i)=> i + '');
    const resArr = [];
    while(resArr.length < max) {
      const val = VALUES[Math.floor(Math.random() * VALUES.length)];
      resArr.push(val, val)
    }
    return resArr.sort((a,b) => {return Math.random() - 0.5 < 0 ? 1: -1});
  })();
  
  // someNode = DEFAULT[y][x]
  const DEFAULT = new Array(height).fill(0).map((item, y) => {
    return new Array(width).fill(0).map((item, x): BlockUnit => {
      return {
        x,
        y,
        value: randomValues[y * width + x],
        selected: false,
        clear: false,
        clickable: false
      }
    })
  })
  
  const updateBlocksClickable = (blocks: BlockUnit[][]): BlockUnit[][] => {
    const DIRECTIONS = [
      [-1, 0],
      [1, 0],
    ];
    const newBlocks = blocks.slice(0);
    newBlocks.forEach((row, y) => {
      row.forEach((block,x) => {
        if (x === 0 || x === width - 1) {
          block.clickable = true;
          return;
        }
        if(DIRECTIONS.every(dir => {
          const newX = x + dir[0];
          const newY = y + dir[1];
          return !newBlocks[newY][newX].clear;
        })) {
          block.clickable = false;
        } else {
          block.clickable = true;
        }
      });
    });
    return newBlocks;
  }
  
  const [blocks, setBlocks] = useState(updateBlocksClickable(DEFAULT));

  const updateBlocks = (blocks: BlockUnit[][]) => {
    setBlocks(updateBlocksClickable(blocks));
  }

  const resetBlocks = () => {
    setBlocks(updateBlocksClickable(DEFAULT));
  }

  return [blocks, updateBlocks, resetBlocks] as const;
}

export default useBlocks