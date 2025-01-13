import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  saveToLocalStorage(key: string, value: object[]): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  loadFromLocalStorage(key: string): object[] {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : [];
  }
}

export enum StorageKeys {
  Favorites = "FAVORITES",
  ShoppingCart = "SHOPPING_CART",
  History = "HISTORY"
}
