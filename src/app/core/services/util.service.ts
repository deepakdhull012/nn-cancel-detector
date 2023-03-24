import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Observable, retry, tap } from 'rxjs';
import { IData, ILungCancerData } from '../interfaces/data.interface';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private http: HttpClient) {}

  /*
  public generateRandomWeights(noOfWeights: number, startRange: number, endRange: number): Array<number> {
    const randomWeights = [];
    for (let i = 0; i < noOfWeights; i++) {
      const randomNumber = Math.random() * (endRange - startRange) + startRange;
      const roundedWeight = this.roundUpto(randomNumber);
      randomWeights.push(roundedWeight);
    }
    return randomWeights;
  }
  */

  public roundUpto(numberToRound: number, noOfDecimals: number = 3) {
    return Math.round(numberToRound * Math.pow(10, noOfDecimals))/Math.pow(10, noOfDecimals);
  }

  public fetchData(url: string): Observable<Array<ILungCancerData>> {
    return this.http.get<Array<ILungCancerData>>(url).pipe(tap(res => {
      
    }))
  }

  public calculateError(actualOutput: Array<number>, expectedOutput: Array<number>): Array<number> {
    if (actualOutput.length === expectedOutput.length && expectedOutput.length) {
      return actualOutput.map((actualOP, index) => {
        return (expectedOutput[index] - actualOP);
      })
    } else {
      throw new Error("To calculate error both array should be of same size and must contains data");
      
    }
  }

  public calculatePlainAbsoluteError(): Array<number> {
    return [];
  }

  
}
