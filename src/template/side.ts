



export interface SideFile {
    name: string
    tests: Array<Test>
    suites: Array<Suite>
}

export interface Suite {
    id: string
    name: string
    persistSession: boolean
    parallel: boolean
    timeout: number
    tests: Array<string>
}

export interface Test {
    id: string
    name: string
    commands: Array<Command>
}

export interface Command {
    id: string
    comment: string
    command: string
    target: string
    targets: Array<Array<string>>
    value: string
}

export interface Replaceable {
    convSetting(key: string): string
    getSettings(): object
    getTemplate(key: string): string
}