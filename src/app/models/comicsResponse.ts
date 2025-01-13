export interface ComicsResponse {
    data: {
        total: number,
        results: ComicResponse[]
    }
}

export interface ComicResponse {
    id: number,
    title: string,
    description: string,
    textObjects: {text: string}[]
    resourceURI: string,
    prices: { type: string, price: number }[],
    thumbnail: { path: string, extension: string }
}