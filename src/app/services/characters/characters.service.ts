import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Character } from '../../models/character';
import { map, Observable } from 'rxjs';
import { CharactersResponse } from '../../models/charactersResponse';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  readonly limit = 10;
  readonly params: any = { apikey: '45b25ea751ccfc9d5942380de3814d37', hash: '3eab07769ec7c80602b164428e06a196', ts: '12345', limit: this.limit }
  readonly notAvailableImage = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
  readonly superhero = "https://media.istockphoto.com/id/520609716/vector/superhero-couple.jpg?s=612x612&w=0&k=20&c=18pjMGeWBJX94E9evrZF6dC8lv9QenaQxuMJB9FfIzA="

  constructor(private http: HttpClient) { }

  getCharacters(page: number, sort: string, startsWith: string | null): Observable<CharactersResponse> {
    let params = this.buildParams(page, sort, startsWith);

    return this.http.get<any>("https://gateway.marvel.com:443/v1/public/characters", {
      params: params
    }).pipe(map(r => {
      r.data.results.forEach((result: any) => {
        result.thumbnail = result.thumbnail.path.concat('.').concat(result.thumbnail.extension);
        result.thumbnail = this.getValidImage(result.thumbnail);
      })

      return {
        total: r.data.total,
        characters: r.data.results
      }
    }));
  }

  getCharacter(id: string): Observable<Character> {
    return this.http.get<any>(`https://gateway.marvel.com:443/v1/public/characters/${id}`, {
      params: this.params
    }).pipe(map(r => {
      var characterResponse = r.data.results[0];
      characterResponse.thumbnail = characterResponse.thumbnail["path"].concat(".").concat(characterResponse.thumbnail["extension"]);
      characterResponse.thumbnail = this.getValidImage(characterResponse.thumbnail);

      return characterResponse;
    }));
  }

  private getValidImage(url: string): string {
    return url == this.notAvailableImage ? this.superhero : url;
  }

  private buildParams(page: number, orderBy: string, startsWith: string | null) {
    const offset = this.limit * page;
    const params = { ...this.params, offset, orderBy }

    if (startsWith) params["nameStartsWith"] = startsWith.trim();

    return params;
  }
}
