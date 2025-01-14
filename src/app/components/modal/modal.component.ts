import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { ComicsService } from '../../services/comics/comics.service';
import { Comic } from '../../models/comic';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { AsyncPipe } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';
import { CartItem } from '../../models/cartItem';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal',
  imports: [AsyncPipe, MatDialogContent, MatButtonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit {
  private readonly comicUri = inject(MAT_DIALOG_DATA);
  private readonly comicsService = inject(ComicsService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly cartService = inject(CartService);

  comic$ = this.comicsService.comic$;

  ngOnInit(): void {
    this.comicsService.updateComicUrl(this.comicUri);
  }

  addToFavorites(comic: Comic) {
    this.favoritesService.addToFavorites(comic);
  }

  addToCart(comic: Comic) {
    let item: CartItem = {
      comic: comic,
      quantity: 1,
      unitPrice: comic.price,
      totalPrice: comic.price
    };

    item.totalPrice = item.quantity * item.unitPrice;

    this.cartService.addToCart(item);
  }

  isComicInFavorites(comic: Comic) {
    return this.favoritesService.favorites().some(c => c.id === comic.id);
  }

  isComicInCart(comic: Comic) {
    return this.cartService.items().some(i => i.comic.id === comic.id)
  }
}
