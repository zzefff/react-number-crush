import React, { AnimationEvent } from 'react';
import { BlockProps } from './types/index';
import classNames from 'classnames';

function Block(props: BlockProps) {
    const {
        clickable,
        value,
        selected,
        onSelect,
        clear,
        showTip
    } = props;
    
    const onAnimationEnd = (e: AnimationEvent) => {
        console.log(e);
    }
    
    return (
        <div
        className={classNames({
            'block': true,
            'block_Disabled': !clickable,
            'block_Selected': selected,
            'block_Clear': clear,
            'block_Tip': showTip
        })}
        onClick={onSelect}
        onAnimationEndCapture={onAnimationEnd}
        >
        {value}
        </div>
    );
}
    
export default Block;
