import React, { useState, useEffect, useCallback } from 'react';
import './App.scss';
import Block from './Block';
import { BlockUnit, AppProps } from './types/index';
import useBlocks from './hooks/useBlocks';
// import useDarkMode from './hooks/useDarkMode';

function App(props: AppProps) {
  const {
    width = 8,
    height = 4
  } = props;
  const [allBlocks, setAllBlocks, resetBlocks] = useBlocks(width, height);
  // const [isDarkMode] = useDarkMode()
  const [result, setResult] = useState(-1); // -1 not yet 0 lose 1 win

  const checkPossibilities = useCallback(() => {
    // 检查是否还有可点击可配对的block
    const values = allBlocks.flat().filter(b => b.clickable && !b.clear).map(b => b.value);
    if (new Set(values).size === values.length) {
      return false;
    }
    return true;
  }, [allBlocks]);

  const checkSuccess = useCallback(() => {
    // 检查是否已经全部清空
    const blocks = allBlocks.flat();
    if(blocks.every(block => block.clear)) {
      setResult(1);
      // resetBlocks();
    } else if (!checkPossibilities()) {
      setResult(0);
      // resetBlocks();
    }
  }, [allBlocks, checkPossibilities]);

  useEffect(() => {
    // allBlocks 更新后检查当前可配对可能性
    checkSuccess()
  }, [allBlocks, resetBlocks, checkSuccess]);
  
  const [lastSelectedBlock, setLastSelectedBlock] = useState<BlockUnit | null>(null);

  // 选择后的判断
  const makeSelected = (block: BlockUnit) => {
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
      const v = block.value;
      if (m[v]) {
        target = v
      } else {
        m[v] = i;
      }
    });
    setTipValue(target)
  }

  const restart = () => {
    resetBlocks();
    setResult(-1);
  }

  const resultBanner = () => {
    switch(result) {
      case -1: return null;
      case 0: return <div className="stage_result">You Lose! <button onClick={restart}>restart</button></div>;
      case 1: return <div className="stage_result">You Win! <button onClick={restart}>restart</button></div>;
    }
  }

  return (
    <div className="App">
      {/* <h1>{ isDarkMode ? 'dark' : 'light'} </h1> */}
      <div className="tips">
        <label>可以消除的： <button onClick={ showClearable }>提示</button></label>
      </div>
      <div className={`stage ${result >= 0 ? 'stage_Disabled' : ''}`}>
        {
          allBlocks.map((row, index) => {
            return <div 
              className="row"
              key={`row-${index}`}
            >{
              row.map((block: BlockUnit) => {
                return <Block
                  key={`${block.x}-${block.y}-${block.value}`}
                  block={block}
                  showTip={ tipValue === block.value && block.clickable && !block.clear }
                  onSelect={makeSelected}
                ></Block>
              })
            }</div>
          })
        }
        { resultBanner() }
      </div>
    </div>
  );
}

export default App;
