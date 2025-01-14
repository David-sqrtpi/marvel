import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from '../../../../services/payment/payment.service';
import { from, switchMap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { CartService } from '../../../../services/cart/cart.service';
import { ThanksComponent } from '../../../thanks/thanks/thanks.component';
import { MatButton, MatButtonModule } from '@angular/material/button';

declare let Square: any;

@Component({
  selector: 'app-square',
  imports: [MatDialogContent, MatProgressSpinner, MatExpansionModule, MatButtonModule],
  templateUrl: './square.component.html',
  styleUrl: './square.component.css'
})
export class SquareComponent {
  paymentsService = inject(PaymentService);
  cartService = inject(CartService);
  readonly dialog = inject(MatDialog)
  readonly dialogRef = inject(MatDialogRef<SquareComponent>);
  private readonly amount: number = inject(MAT_DIALOG_DATA);

  payments = Square.payments(this.paymentsService.applicationId, this.paymentsService.locationId);
  card: any;
  ach: any;
  googlePay: any;
  giftCard: any;

  cardFormLoading = true;
  achFormLoading = true;
  googlePayFormLoading = true;
  giftCardFormLoading = true;

  paymentInProgress = signal(false);

  readonly panelOpenState = signal(false);

  async ngOnInit() {
    this.renderCardForm();
    await this.renderAch();
    await this.renderGooglePay();
    await this.renderGiftCard();
  }

  async renderPaymentMethods() {
  }

  private async renderCardForm() {
    this.card = await this.payments.card();
    await this.card.attach('#card-container');
    this.cardFormLoading = false
  }

  private async renderAch() {
    this.ach = await this.payments.ach();
    this.achFormLoading = false
  }

  private async renderGooglePay() {
    const paymentRequest = this.payments.paymentRequest({
      countryCode: 'US',
      currencyCode: 'USD',
      total: {
        amount: this.amount.toString(),
        label: 'Total',
      },
    });

    this.googlePay = await this.payments.googlePay(paymentRequest);
    await this.googlePay.attach("#googlepay-button")

    this.googlePayFormLoading = false;
  }

  private async renderGiftCard() {
    this.giftCard = await this.payments.giftCard();
    await this.giftCard.attach("#giftcard-container");
    this.giftCardFormLoading = false;
  }

  async payGoogle() {
    try {
      const token = await this.tokenize(this.googlePay);
      const verificationToken = await this.verifyBuyer(token);

      this.paymentsService.pay(token, verificationToken).subscribe(r => {
        this.afterCheckout();
      });
    }
    catch (e) {
      this.paymentInProgress.set(false);
      this.renderPaymentMethods();
    }
  }

  async payCard() {
    try {
      const token = await this.tokenize(this.card);
      const verificationToken = await this.verifyBuyer(token);

      this.paymentsService.pay(token, verificationToken).subscribe(r => {
        this.afterCheckout();
      });
    }
    catch (e) {
      this.paymentInProgress.set(false);
      this.renderPaymentMethods();
    }
  }

  async payAch() {
    try {
      const options = this.getAchOptions();
      await this.tokenizeAch(this.ach, options);
    }
    catch (e) {
      this.paymentInProgress.set(false);
      this.renderPaymentMethods();
    }
  }

  async payGiftCard() {
    this.paymentInProgress.set(true);

    try {
      const token = await this.tokenize(this.giftCard);
      const verificationToken = await this.verifyBuyer(token);

      this.paymentsService.pay(token, verificationToken).subscribe(r => {
        this.afterCheckout();
      });
    }
    catch (e) {
      this.paymentInProgress.set(false);
      this.renderPaymentMethods();
    }
  }

  async verifyBuyer(token: string) {
    const verificationDetails = {
      amount: this.amount.toString(),
      billingContact: {
        givenName: 'John',
        familyName: 'Doe',
        email: 'john.doe@square.example',
        phone: '3214563987',
        addressLines: ['123 Main Street', 'Apartment 1'],
        city: 'Miami',
        state: 'FL',
        countryCode: 'US',
      },
      currencyCode: 'USD',
      intent: 'CHARGE',
    };

    const verificationResults = await this.payments.verifyBuyer(
      token,
      verificationDetails,
    );
    return verificationResults.token;
  }

  private async tokenize(paymentMethod: any) {
    this.paymentInProgress.set(true);
    const tokenResult = await paymentMethod.tokenize();

    if (tokenResult.status === 'OK') {
      return tokenResult.token;
    } else {
      let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
      if (tokenResult.errors) {
        errorMessage += ` and errors: ${JSON.stringify(
          tokenResult.errors,
        )}`;
      }

      throw new Error(errorMessage);
    }
  }

  private async tokenizeAch(paymentMethod: any, options: any) {
    this.paymentInProgress.set(true);
    paymentMethod.addEventListener('ontokenization', async (event: any) => {
      const { tokenResult, error } = event.detail;

      if (error !== undefined) {
        let errorMessage = `Tokenization failed with error: ${error}`;
        this.paymentInProgress.set(false);
        this.renderPaymentMethods();
        throw new Error(errorMessage);
      }
      if (tokenResult.status === 'OK') {
        const verificationToken = await this.verifyBuyer(tokenResult.token);
        this.paymentsService.pay(tokenResult.token, verificationToken).subscribe(r => {
          this.afterCheckout();
        })
      } else {
        let errorMessage = `Tokenization failed with status: ${tokenResult.status}`;
        if (tokenResult.errors) {
          errorMessage += ` and errors: ${JSON.stringify(
            tokenResult.errors,
          )}`;
        }
        this.paymentInProgress.set(false);
        this.renderPaymentMethods();
        throw new Error(errorMessage);

      }
    });

    await this.ach.tokenize(options);
  }

  //Get this from a form and actual total.
  private getAchOptions() {
    return {
      accountHolderName: "David Pevaar",
      intent: "CHARGE",
      total: { amount: this.amount * 100, currencyCode: 'USD' }
    }
  }

  private afterCheckout() {
    this.cartService.afterCheckout();
    this.dialogRef.close();
    this.dialog.open(ThanksComponent);
  }
}
