import { Injectable, OnInit } from '@angular/core';
import { Brain } from '../interfaces/brain.interface';
import { IData, ILungCancerData } from '../interfaces/data.interface';
import { BrainService } from './brain.service';
import { UtilService } from './util.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PointsClassifierService {
  public trainingData: Array<ILungCancerData> = [];
  public testData: Array<ILungCancerData> = [];
  private noOfEpochs = 100;
  public onClassificationDone: Subject<void> = new Subject();

  public trainCommand: Subject<void> = new Subject();
  public testCommand: Subject<void> = new Subject();
  public backgroundTraining: Subject<void> = new Subject();
  public stopTraining: Subject<void> = new Subject();
  private intv$: any;

  constructor(
    private brainService: BrainService,
    private utilService: UtilService
  ) {
    this.trainCommand.subscribe(_ => {
      this.startTraining();
    })

    this.testCommand.subscribe(_ => {
      this.testBrain();
    })

     this.backgroundTraining.subscribe(_ => {
      this.intv$ = setInterval(() => {
        this.startTraining();
      },100)
    })

    this.stopTraining.subscribe(_ => {
      clearInterval(this.intv$)
    })
  }

  initClassifier(brain: Brain): void {
    this.brainService.learningRate = brain.learningRate;
    this.brainService.initBrain(
      brain.noOfHiddenLayers,
      brain.noOfNeuronsPerLayer,
      brain.inputDimension,
      brain.outputDimension
    );
    this.utilService.fetchData('/assets/data.json').subscribe((data) => {
      console.error("data", data);
      this.trainingData = [...data.slice(0, 275)];
      this.testData = [...data.slice(275)];
      this.onClassificationDone.next();
      //this.startTraining();
    });
  }

  private startTraining(): void {
    let wothoutCancerTrained = 0;
    for (let epoch = 0; epoch < this.noOfEpochs; epoch++) {
      this.trainingData.forEach((entry, index) => {
        if (entry.LUNG_CANCER === 1) {
          wothoutCancerTrained++;
        }
        this.brainService.train(
          [
            entry.ALCOHOL_CONSUMING,
            entry.ALLERGY,
            entry.ANXIETY,
            entry.CHEST_PAIN,
            entry.CHRONIC_DISEASE,
            entry.COUGHING,
            entry.FATIGUE,
            entry.PEER_PRESSURE,
            entry.SHORTNESS_OF_BREATH,
            entry.SMOKING,
            entry.SWALLOWING_DIFFICULTY,
            entry.WHEEZING,
            entry.YELLOW_FINGERS,
          ],
          [entry.LUNG_CANCER === 2 ? 1 : 0, entry.LUNG_CANCER === 1 ? 1 : 0]
        );
        entry.accuracy_score = 100 - (this.brainService.errorForCurrentSet * 100);
        console.error(entry.accuracy_score)
        // console.log(
        //   `Accumulated error for each record ${index} is ${this.brainService.errorForCurrentSet} ${wothoutCancerTrained}`
        // );
        this.brainService.errorForCurrentSet = 0;
      });
    }
    console.error('*** TESTING NOW ****');
   
  }

  private testBrain(): void {
    const BUFFER = 0.25;
    this.brainService.errorForCurrentSet = 0;
    let totalCases = 0;
    let nonCancerous = 0;

    let falseCases = 0;
    let indeterminent = 0;

    let nonCancerousFalse = 0;
    let nonCancerousIndeterminent = 0;
    this.testData.forEach((entry) => {
      this.brainService.train(
        [
          entry.ALCOHOL_CONSUMING,
          entry.ALLERGY,
          entry.ANXIETY,
          entry.CHEST_PAIN,
          entry.CHRONIC_DISEASE,
          entry.COUGHING,
          entry.FATIGUE,
          entry.PEER_PRESSURE,
          entry.SHORTNESS_OF_BREATH,
          entry.SMOKING,
          entry.SWALLOWING_DIFFICULTY,
          entry.WHEEZING,
          entry.YELLOW_FINGERS,
        ],
        [entry.LUNG_CANCER === 2 ? 1 : 0, entry.LUNG_CANCER === 1 ? 1 : 0],
        true
      );
      entry.accuracy_score = 100 - (this.brainService.errorForCurrentSet * 100);
      entry.n1_score = this.brainService.n1ForCurrent;
      entry.n2_score = this.brainService.n2ForCurrent;
      totalCases++;
      if (
        this.brainService.errorForCurrentSet > BUFFER &&
        this.brainService.errorForCurrentSet <= 0.5
      ) {
        indeterminent++;
      }
      if (this.brainService.errorForCurrentSet >= 0.5) {
        falseCases++;
      }
      if (entry.LUNG_CANCER === 1) {
        nonCancerous++;
        if (
          this.brainService.errorForCurrentSet > BUFFER &&
          this.brainService.errorForCurrentSet <= 0.5
        ) {
          nonCancerousIndeterminent++;
        }
        if (this.brainService.errorForCurrentSet >= 0.5) {
          nonCancerousFalse++;
        }
      }

      // if (entry.LUNG_CANCER === 1) {
      //   console.log(
      //     `Accumulated error for non cancer record is ${this.brainService.errorForCurrentSet}`
      //   );
      // } else {
      //   console.log(
      //     `Accumulated error for cancer record is ${this.brainService.errorForCurrentSet}`
      //   );
      // }

      this.brainService.errorForCurrentSet = 0;
    });
    console.error(
      'False %',
      (falseCases / totalCases) * 100,
      'Correct %',
      ((totalCases - falseCases - indeterminent) / totalCases) * 100,
      'Indeterminent %',
      (indeterminent / totalCases) * 100,
      'nonCancerous',
      (nonCancerous / totalCases) * 100,
      'nonCancerousFalse',
      (nonCancerousFalse / nonCancerous) * 100
    );
  }
}
