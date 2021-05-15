export interface Layout {
    title: string
    type: string
    cols: number
    rows: number
    show: boolean
}

export interface IconLayout extends Layout {
    icon: string
    class: string
    value: object
}

export interface plotlyLayout extends Layout {
    enableButtons: boolean
    data: object
    layout: object
}