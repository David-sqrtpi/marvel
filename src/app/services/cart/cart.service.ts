import { computed, inject, Injectable, signal } from '@angular/core';
import { CartItem } from '../../models/cartItem';
import { LocalStorageService, StorageKeys } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly storageService = inject(LocalStorageService);

  items = signal(this.storageService.loadFromLocalStorage(StorageKeys.ShoppingCart) as CartItem[])
  history = signal(this.storageService.loadFromLocalStorage(StorageKeys.History) as CartItem[][]);

  computedItems = computed(() => this.items().map(r => ({ ...r, totalPrice: r.quantity * r.unitPrice })));
  itemsTotal = computed(() => this.computedItems().reduce((a, i) => a + i.totalPrice, 0));
  itemsSum = computed(() => this.computedItems().reduce((a, i) => a + i.quantity, 0));

  addToCart(cartItem: CartItem) {
    // let index = this.items().findIndex(i => i.comic.id === cartItem.comic.id)
    // if (index !== -1) {
    //   this.items.update(i => {
    //     i[index].quantity++;
    //     return [...i];
    //   })
    // }
    // else {
    //   this.items.update(i => [...i, cartItem]);
    // }

    this.items.update(i => {
      let index = this.items().findIndex(i => i.comic.id === cartItem.comic.id);

      if (index !== -1) {
        i[index].quantity++;
        return [...i];
      }
      else {
        return [...i, cartItem];
      }
    });

    this.storageService.saveToLocalStorage(StorageKeys.ShoppingCart, this.items());
  }

  removeFromCart(comicId: number) {
    this.items.update(r => r.filter(i => i.comic.id !== comicId));

    this.storageService.saveToLocalStorage(StorageKeys.ShoppingCart, this.items());
  }

  changeQuantity(comicId: number, newQuantity: number) {
    let index = this.items().findIndex(i => i.comic.id === comicId)

    if (index === -1) return;

    this.items.update(i => {
      i[index].quantity = newQuantity;

      return [...i];
    });

    this.storageService.saveToLocalStorage(StorageKeys.ShoppingCart, this.items());
  }

  afterCheckout() {
    this.saveToHistory()
    this.clearCart();
  }

  saveToHistory() {
    this.history.update(r => [...r, this.computedItems()]);

    this.storageService.saveToLocalStorage(StorageKeys.History, this.history());
  }

  clearCart() {
    this.items.set([]);
    this.storageService.saveToLocalStorage(StorageKeys.ShoppingCart, []);
  }
}
