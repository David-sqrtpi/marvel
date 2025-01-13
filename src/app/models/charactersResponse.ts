import { Character } from "./character";

export interface CharactersResponse {
    total: number;
    characters: Character[];
}