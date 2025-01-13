import { Signal } from "@angular/core";
import { Comic } from "./comic";

export interface CartItem {
    comic: Comic,
    unitPrice: number,
    quantity: number,
    totalPrice: number,
}