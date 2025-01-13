import { Component, inject, Input, OnInit } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { Character } from '../models/character';
import { CharactersService } from '../services/characters/characters.service';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../components/modal/modal.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list-item',
  imports: [MatGridListModule, RouterLink, MatButtonModule],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})

export class ListItemComponent implements OnInit {
  @Input() character: Character | undefined
  public imgSrc: string | undefined;
  readonly dialog = inject(MatDialog)

  ngOnInit(): void {
    this.imgSrc = this.character?.thumbnail;
  }

  openModal(resourceURI: string) {
    console.log(resourceURI);
    
    this.dialog.open(ModalComponent, {
      data: resourceURI
    })
  }
}
