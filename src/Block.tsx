import React, { SyntheticEvent, useRef } from 'react';
import { BlockProps } from './types/index';
import classNames from 'classnames';

function Block(props: BlockProps) {
    const {
        block,
        onSelect,
        showTip
    } = props;

    const {
        clickable,
        value,
        selected,
        clear,
    } = block;

    const ref = useRef<HTMLDivElement>(null);

    const handleSelect = (e: SyntheticEvent) => {
        console.log(e)
        onSelect(block);
    }
    
    return (
        <div
        ref={ref}
        className={classNames({
            'block': true,
            'block_Disabled': !clickable,
            'block_Selected': selected,
            'block_Clear': clear,
            'block_Tip': showTip
        })}
        onClick={handleSelect}
        >
        {value}
        </div>
    );
}
    
export default Block;
