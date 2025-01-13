import { Component, inject, Input, input } from '@angular/core';
import { ComicsService } from '../../../services/comics/comics.service';
import { AsyncPipe } from '@angular/common';
import { Comic } from '../../../models/comic';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from '../../modal/modal.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-comic-list',
  imports: [AsyncPipe, MatPaginatorModule, MatProgressSpinner],
  templateUrl: './comic-list.component.html',
  styleUrl: './comic-list.component.css'
})
export class ComicListComponent {
  @Input() characterId: string | undefined;

  readonly comicsService = inject(ComicsService);
  readonly dialog = inject(MatDialog);

  totalPages = 79;
  pageIndex = 0;

  comics$: Observable<Comic[]> | undefined;

  ngOnInit(){
    console.log(this.characterId);
    
    this.comics$ = this.comicsService.getComics(this.pageIndex, this.characterId);
  }

  openModal(resourceURI: string) {
    console.log(resourceURI);
    
    this.dialog.open(ModalComponent, {
      data: resourceURI
    })
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.reload();
  }

  private reload() {
    this.comics$ = this.comicsService.getComics(this.pageIndex, this.characterId);
  }
}
