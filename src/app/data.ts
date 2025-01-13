import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';
import { Comic } from './models/comic';

export class Data implements InMemoryDbService {
    createDb(): Comic[] {
        throw new Error('Method not implemented.');
    }

}