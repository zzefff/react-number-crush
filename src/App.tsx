import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import Block from './Block';
import { BlockProps, AppProps } from './types/index';
import useBlocks from './hooks/useBlocks';
// import useDarkMode from './hooks/useDarkMode';

function App(props: AppProps) {
  const {
    width = 8,
    height = 4
  } = props;
  const [allBlocks, setAllBlocks, resetBlocks] = useBlocks(width, height);
  // const [isDarkMode] = useDarkMode()

  const checkPossibilities = useCallback(() => {
    // 检查是否还有可点击可配对的block
    const values = allBlocks.flat().filter(b => b.clickable && !b.clear).map(b => b.value);
    console.log('checkPosibilities', values);
    if (new Set(values).size === values.length) {
      return false;
    }
    return true;
  }, [allBlocks]);

  const checkSuccess = useCallback(() => {
    // 检查是否已经全部清空
    const blocks = allBlocks.flat();
    if(blocks.every(block => block.clear)) {
      alert('You Win!');
      resetBlocks();
    } else if (!checkPossibilities()) {
      alert('You Lose!');
      resetBlocks();
    }
  }, [allBlocks, checkPossibilities, resetBlocks]);

  useEffect(() => {
    // allBlocks 更新后检查当前可配对可能性
    checkSuccess()
  }, [allBlocks, resetBlocks, checkSuccess]);
  
  const [lastSelectedBlock, setLastSelectedBlock] = useState<BlockProps | null>(null);

  // 选择后的判断
  const makeSelected = (block: BlockProps) => {
    if (block.selected) return;
    const newBlocks = allBlocks.slice(0);
    const selectedBlock = newBlocks[block.y][block.x];
    selectedBlock.selected = true;
    // 这里应该判断已经选了几个，够两个了就开始比较，如果匹配了则更新block的clear值在更新allBlocks
    if (lastSelectedBlock) {
      // 之前选了一个，可以比较了
      if (lastSelectedBlock.value === block.value) {
        // 匹配了, 更新clear标志，刷新allBlocks，清空lastSelected
        selectedBlock.clear = true;
        newBlocks[lastSelectedBlock.y][lastSelectedBlock.x].clear = true;
        setLastSelectedBlock(null);
        setTipValue('')
      } else {
        // 不匹配，更新lastSelected
        setLastSelectedBlock(selectedBlock);
        newBlocks[lastSelectedBlock.y][lastSelectedBlock.x].selected = false;
      }
    } else {
      // 之前不存在，记录一下lastSelected
      setLastSelectedBlock(selectedBlock);
    }

    setAllBlocks(newBlocks);
  }

  const [tipValue, setTipValue] = useState('')

  const showClearable = () => {
    const blocks = allBlocks.slice(0);
    const m: Record<string, number> = {}
    let target = '';
    blocks.flat().filter(block => block.clickable && !block.clear).forEach((block, i) => {
      console.log('looking:', block.value)
      const v = block.value;
      if (m[v]) {
        target = v
      } else {
        m[v] = i;
      }
    });
    setTipValue(target)
  }

  return (
    <div className="App">
      {/* <h1>{ isDarkMode ? 'dark' : 'light'} </h1> */}
      <div className="tips">
        <label>可以消除的： <button onClick={ showClearable }>提示</button></label>
      </div>
      <div className='stage'>
        {
          allBlocks.map((row, index) => {
            return <div 
              className="row"
              key={`row-${index}`}
            >{
              row.map((block: BlockProps) => {
                return <Block
                  key={`${block.x}-${block.y}-${block.value}`}
                  {...block}
                  showTip={ tipValue === block.value && block.clickable && !block.clear }
                  onSelect={() => makeSelected(block)}
                ></Block>
              })
            }</div>
          })
        }
      </div>
    </div>
  );
}

export default App;
