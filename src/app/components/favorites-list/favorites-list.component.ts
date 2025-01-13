import { Component, inject, Input } from '@angular/core';
import { FavoritesService } from '../../services/favorites/favorites.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { Character } from '../../models/character';

@Component({
  selector: 'app-favorites-list',
  imports: [],
  templateUrl: './favorites-list.component.html',
  styleUrl: './favorites-list.component.css'
})
export class FavoritesListComponent {
  readonly dialog = inject(MatDialog)
  readonly favoritesService = inject(FavoritesService)
  list = this.favoritesService.favorites;


  ngOnInit(){
    console.log(this.list());
    
  }

  removeFromFavorites(index: number) {
    this.favoritesService.removeFromFavorites(index);
  }

  openModal(url: string | undefined) {
    console.log(url);
    console.log(this.list());
    
    this.dialog.open(ModalComponent, {
      data: url
    })
  }
}
