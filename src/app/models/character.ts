export interface Character {
    id: string;
    name: string;
    description: string;
    thumbnail?: string;
    resourceUri: string;
    comics:
    {
        items: {
            resourceURI: string;
            name: string;
            prices: { type: string, price: number }[],
        }[]
    };
}
