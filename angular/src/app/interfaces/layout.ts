export interface Layout {
    title: string
    type: string
    cols: number
    rows: number
    show: boolean
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

export interface plotlyLayout extends Layout {
    enableButtons: boolean
    data: object
    layout: object
}