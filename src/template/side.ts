



export interface SideFile {
    name: string;
    tests: Array<Test>;
    suites: Array<Suite>;
}

export interface Suite {
    tests: Array<string>;
}

export interface Test {
    id: string;
    commands: Array<Command>;
}

export interface Command {
    id: string;
    command: string;
    target: string;
    targets: Array<Array<string>>;
    value: string;
}

export interface Replaceable {
    convSetting(key: string): string;
    getSettings(): object;
    getTemplate(key: string): string;
}