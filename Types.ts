
export interface intentsT {
    intents: Array<intentT>
}

export interface intentT {
    [name: string]: string | Array<string> | undefined,
    tag: string,
    patterns: Array<string> | string,
    responses: Array<string> | string,
    context?: Array<string> | string
}