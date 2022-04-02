export interface BlockProps {
    x: number;
    y: number;
    clickable: boolean;
    value: string;
    selected: boolean;
    clear: boolean;
    showTip?: boolean;
    onSelect?: () => void
}

export interface AppProps {
    width?: number;
    height?: number;
}