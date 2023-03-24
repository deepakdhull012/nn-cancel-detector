import { Injectable } from '@angular/core';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class ActivationFunctionsService {

  constructor(private utilService: UtilService) { }

  sigMoidOnArray(array: Array<number>) {
    return array.map(n => this.sigmoid(n));
  }

  sigmoid(n: number) {
    const sigmoidN = 1/(1+Math.pow(Math.E, -n));
    return this.utilService.roundUpto(sigmoidN);
  }

  tanh(n: number): number {
    const ePowerN = Math.pow(Math.E, n);
    const ePowerMinusN = Math.pow(Math.E, -n);
    const uT = ePowerN - ePowerMinusN;
    const lT = ePowerN + ePowerMinusN;
    return uT / lT;
  }

  tanhOnArray(array: Array<number>) {
    return array.map(n => this.tanh(n));
  }
}
