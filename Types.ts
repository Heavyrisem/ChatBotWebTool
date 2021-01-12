
export interface intentsT {
    intents: Array<intentT>
}

export interface intentT {
    [name: string]: string | Array<string> | undefined,
    tag: string,
    patterns: Array<string>,
    responses: Array<string>,
    context?: Array<string>
}