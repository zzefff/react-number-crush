import { SyntheticEvent } from "react";

export interface BlockUnit {
    x: number;
    y: number;
    clickable: boolean;
    value: string;
    selected: boolean;
    clear: boolean;
}

export interface BlockProps {
    block: Block;
    showTip?: boolean;
    onSelect: (block: Block) => void;
}

export interface AppProps {
    width?: number;
    height?: number;
}