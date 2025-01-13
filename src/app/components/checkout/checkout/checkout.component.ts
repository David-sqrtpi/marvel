import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { loadScript } from "@paypal/paypal-js";
import { CartService } from '../../../services/cart/cart.service';
import { ThanksComponent } from '../../thanks/thanks/thanks.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-checkout',
  imports: [MatDialogContent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  readonly cartService = inject(CartService);
  readonly dialogRef = inject(MatDialogRef<CheckoutComponent>);
  readonly amount: number = inject(MAT_DIALOG_DATA);
  readonly dialog = inject(MatDialog);

  paypal: any;
  paymentInProgress = false;

  async ngOnInit() {
    this.paypal = await loadScript({ clientId: "AdEPbgnedxBLErG8KzjS3jPHwVFPpGC957Nh9Auseb57OowNWwVtIfA_7IDZnLaJZNlK4hkjCTk-NzZQ", buyerCountry: "US", enableFunding: "venmo" });

    if (this.paypal) {
      try {
        await this.paypal.Buttons({
          createOrder: async () => {
            this.paymentInProgress = true;

            try {
              const response = await fetch("http://localhost:8080/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  cart: [{ id: "YOUR_PRODUCT_ID", quantity: "YOUR_PRODUCT_QUANTITY", amount: this.amount.toString() }],
                }),
              });

              const orderData = await response.json();

              if (!orderData.id) {
                const errorDetail = orderData.details[0];
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                  : "Unexpected error occurred, please try again.";

                throw new Error(errorMessage);
              }

              return orderData.id;

            } catch (error) {
              console.error(error);
              throw error;
            }
          },
          onApprove: async (data: any) => {
            // Capture the funds from the transaction.
            const response = await fetch(`http://localhost:8080/api/orders/${data.orderID}/capture`, {
              method: "POST",
              body: JSON.stringify({
                orderID: data.orderID,
              }),
            });

            const details = await response.json();
            console.log(details);

            this.afterCheckout();
          }
        }).render("#dialog");
      } catch (error) {
        console.error("failed to render the PayPal Buttons", error);
      }
    }
  }

  private afterCheckout() {
    this.cartService.afterCheckout();
    this.dialogRef.close();
    this.dialog.open(ThanksComponent);
  }
}
