import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Comic } from '../../models/comic';
import { LocalStorageService, StorageKeys } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  readonly storageService = inject(LocalStorageService);

  favorites = signal(this.storageService.loadFromLocalStorage(StorageKeys.Favorites) as Comic[]);

  addToFavorites(comic: Comic) {
    this.favorites.update(r => {
      let newFavoritesList = [...r, comic];
      this.storageService.saveToLocalStorage(StorageKeys.Favorites, newFavoritesList);
      return newFavoritesList;
    });
  }

  removeFromFavorites(index: number) {
    this.favorites.update(r => {
      r.splice(index, 1);
      this.storageService.saveToLocalStorage(StorageKeys.Favorites, r);
      return r;
    });
  }
}
