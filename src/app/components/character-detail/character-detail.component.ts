import { Component, Input } from '@angular/core';
import { CharactersService } from '../../services/characters/characters.service';
import { Character } from '../../models/character';
import { ComicListComponent } from '../comics/comic-list/comic-list.component';

@Component({
    selector: 'app-character-detail',
    imports: [ComicListComponent],
    templateUrl: './character-detail.component.html',
    styleUrl: './character-detail.component.css'
})
export class CharacterDetailComponent {
  public character: Character | undefined
  public imgSrc: string | undefined

  constructor(private charactersService: CharactersService) { }

  @Input()
  set characterId(value: string) {
    this.charactersService.getCharacter(value).subscribe(r => {
      this.character = r;
      
      this.imgSrc = this.character?.thumbnail;
    });
  }
}
