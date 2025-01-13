export interface Comic {
    id: number;
    title: string;
    description: string;
    image: string;
    url: string;
    price: number;
    total?: number;
}