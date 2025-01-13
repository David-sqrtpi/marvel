import { Component, inject } from '@angular/core';
import { MatBadge, MatBadgeModule } from '@angular/material/badge';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart/cart.service';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, MatIconModule, MatBadgeModule, MatButtonModule, RouterLink],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  readonly cartService = inject(CartService);
  
  itemsSum = this.cartService.itemsSum;

  title = 'marvel';
}
