import { Component, inject } from '@angular/core';
import { CartService } from '../../../services/cart/cart.service';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CartItem } from '../../../models/cartItem';

@Component({
  selector: 'app-purchase-history',
  imports: [MatExpansionModule, MatButtonModule],

  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.css'
})
export class PurchaseHistoryComponent {
  readonly cartService = inject(CartService);

  history = this.cartService.history;

  totalPrice(cartItem: CartItem[]){
    return cartItem.reduce((a, i) => a + i.totalPrice, 0)
  }

  sumItems(cartItem: CartItem[]){
    return cartItem.reduce((a, i) => a + i.quantity, 0)
  }
}
