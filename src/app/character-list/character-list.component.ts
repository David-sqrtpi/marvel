import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { ListItemComponent } from "../list-item/list-item.component";
import { CharactersService } from '../services/characters/characters.service';
import { Character } from '../models/character';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FavoritesListComponent } from "../components/favorites-list/favorites-list.component";
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../services/cart/cart.service';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-character-list',
  imports: [MatGridListModule,
    ListItemComponent, MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    FavoritesListComponent,
    MatBadgeModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})

export class CharacterListComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly charactersService = inject(CharactersService)

  itemsSum = this.cartService.itemsSum;
  public characters: Character[] | undefined
  sortBy: string = ""
  totalPages = 0;
  searchBarFormControl = new FormControl('');
  pageIndex = 0;

  ngOnInit(): void {
    this.reload();

    this.searchBarFormControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(_ => this.reload());
  }

  onSortByChange() {
    this.reload()
  }

  private reload() {
    this.characters = undefined;

    this.charactersService.getCharacters(this.pageIndex, this.sortBy, this.searchBarFormControl.value).subscribe((r) => {
      this.characters = r.characters;
      this.totalPages = r.total;
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.reload();
  }
}
