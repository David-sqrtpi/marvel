import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutComponent } from '../checkout/checkout/checkout.component';
import { SquareComponent } from '../checkout/square/square/square.component';
import { RouterLink } from '@angular/router';
import { CartItem } from '../../models/cartItem';

@Component({
  selector: 'app-cart',
  imports: [MatButtonModule, MatTableModule, MatIconModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartService = inject(CartService);
  readonly dialog = inject(MatDialog)

  items = this.cartService.computedItems;
  total = this.cartService.itemsTotal;
  itemsSum = this.cartService.itemsSum;

  testu = this.cartService.items;

  doSomething(comicId: any) {
    console.log("deleting itemQ", comicId);
    this.cartService.removeFromCart(comicId);
  }

  squareCheckout() {
    this.dialog.open(SquareComponent, {
      data: parseFloat(this.total().toFixed(2))
    });
  }

  payPalCheckout() {
    this.dialog.open(CheckoutComponent, {
      data: parseFloat(this.total().toFixed(2))
    })
  }

  changeQuantity(item: CartItem, quantity: number) {
    this.cartService.changeQuantity(item.comic.id, item.quantity + quantity);
  }
}
