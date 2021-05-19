export interface Layout {
    title: string
    type: string
    cols: number
    rows: number
    show: boolean
    enableButtons?: boolean
    layout?: object
}

export interface sentiment {
    label: number;
    sentiment: string;
    values: number
}

export interface IconLayout extends Layout {
    icon: string
    selector: string
    class: string
}