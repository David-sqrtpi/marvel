import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, switchMap } from 'rxjs';
import { Comic } from '../../models/comic';
import { ComicsResponse } from '../../models/comicsResponse';

@Injectable({
  providedIn: 'root'
})
export class ComicsService {
  readonly params: any = { apikey: '45b25ea751ccfc9d5942380de3814d37', hash: '3eab07769ec7c80602b164428e06a196', ts: '12345' }
  url = new BehaviorSubject<string | undefined>(undefined);
  comic = computed(() => {

  });

  http = inject(HttpClient);
  limit = 20;

  comic$ = this.url
    .pipe(
      filter(Boolean),
      switchMap(url => this.getComic(url))
    );

  updateComicUrl(url: string) {
    this.url.next(url);
  }

  getComic(uri: string): Observable<Comic> {
    return this.http.get<any>(uri, {
      params: this.params
    }).pipe(
      map(r => {
        const result = r.data.results[0]
        console.log(result)
        return {
          id: result.id,
          title: result.title,
          description: result.description?.trim() || result.textObjects?.[0]?.text?.trim() || "Fake Description",
          image: result.thumbnail.path.concat('.').concat(result.thumbnail.extension),
          url: uri,
          price: result.prices?.[0].price || parseFloat(((Math.random() * (50 - 2 + 1)) + 2).toFixed(2)),
        }
      })
    )
  }

  getComics(page: number, characterId: string | undefined): Observable<Comic[]> {
    this.params["offset"] = this.limit * page;
    let params = { ...this.params };
    if (characterId) params['characters'] = characterId;

    console.log(characterId);
    
    return this.http.get<ComicsResponse>("https://gateway.marvel.com:443/v1/public/comics", {
      params: params
    }).pipe(
      map(response => {
        let comics = response.data.results;
        console.log(comics);

        return comics.map(comic => ({
          id: comic.id,
          title: comic.title,
          description: comic.description || comic.textObjects?.[0]?.text || "This is a placeholder",
          image: comic.thumbnail.path.concat('.').concat(comic.thumbnail.extension),
          url: comic.resourceURI,
          price: comic.prices?.[0].price || parseFloat(((Math.random() * (50 - 2 + 1)) + 2).toFixed(0)),
        }));
      })
    );
  }
}
