


export interface Command {
    id: string
    comment: string
    command: string
    target: string
    targets: Array<Array<string>>
    value: string
}

export interface Replace {
    convSetting(key: string): string
    getSettings(): object
    getTemplate(key: string): string
}