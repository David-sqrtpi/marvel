import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly httpClient = inject(HttpClient);
  readonly applicationId = 'sandbox-sq0idb-UH7BgKmtGckRIvgY1pWnmw';
  readonly locationId = 'L5Q84AYA0YDT4';

  pay(token: string, verificationToken: string) {
    return this.httpClient.post("http://localhost:3000/payment", {
      locationId: this.locationId,
      sourceId: token,
      idempotencyKey: crypto.randomUUID(),
      verificationToken
    });
  }

  constructor() { }
}
