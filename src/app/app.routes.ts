import { Routes } from '@angular/router';
import { CharacterListComponent } from './character-list/character-list.component';
import { CharacterDetailComponent } from './components/character-detail/character-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { ModalComponent } from './components/modal/modal.component';
import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history/purchase-history.component';
import { ComicListComponent } from './components/comics/comic-list/comic-list.component';

export const routes: Routes = [
    { path: '', component: CharacterListComponent },
    { path: 'cart', component: CartComponent },
    { path: 'comics', component: ComicListComponent },
    { path: 'history', component: PurchaseHistoryComponent },
    { path: ':characterId', component: CharacterDetailComponent },
];
