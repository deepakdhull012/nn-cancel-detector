import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Brain } from './core/interfaces/brain.interface';
import { ILungCancerData } from './core/interfaces/data.interface';
import { NeuronUI } from './core/interfaces/neuron-ui.interface';
import { BrainService } from './core/services/brain.service';
import { PointsClassifierService } from './core/services/points-classifier.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  private brain: Brain = {
    inputDimension: 13,
    outputDimension: 1,
    learningRate: 0.05,
    noOfHiddenLayers: 1,
    noOfNeuronsPerLayer: 16,
  };
  public trainingInProcess = false;
  public nonCancerousFalse = this.pointsClassifier.nonCancerousFalse;
  private neurons: Array<NeuronUI> = [];
  private canvas: any;

  public trainingData: ILungCancerData[] = [];
  public testData: ILungCancerData[] = [];
  public modelVisible = true;

  constructor(
    public pointsClassifier: PointsClassifierService,
    public brainService: BrainService,
    private cdr: ChangeDetectorRef
  ) {
    this.pointsClassifier.initClassifier(this.brain);
  }

  ngOnInit(): void {
    this.pointsClassifier.onClassificationDone.subscribe((_) => {
      this.trainingData = this.pointsClassifier.trainingData;
      this.testData = this.pointsClassifier.testData;
    });
  }

  runTest(): void {
    this.pointsClassifier.testCommand.next();
  }

  toggleNN(): void {
    this.modelVisible = !this.modelVisible;
  }

  trainBy1Step(): void {
    this.pointsClassifier.trainCommand.next();
  }

  backgroundTraining(): void {
    if (this.trainingInProcess) {
      this.trainingInProcess = false;
      this.pointsClassifier.stopTraining.next();
    } else {
      this.trainingInProcess = true;
      this.pointsClassifier.backgroundTraining.next();
    }
  }
  ngAfterViewInit(): void {
    this.initCanvas();
  }

  private layNeurons(): void {
    const noOfLayers = this.brain.noOfHiddenLayers + 2;
    const ctx = this.canvas.getContext('2d');

    // var img = new Image();
    // img.onload = function () {
    //   ctx.drawImage(img, 20, 420, 50, 50);
    //   // do other canvas handling here!
    // };
    // img.src = 'assets/images/bee.png';

    for (let layer = 1; layer <= noOfLayers; layer++) {
      if (layer === 1) {
        this.layNeuronsInLayer(this.brain.inputDimension, layer, noOfLayers);
      } else if (layer === noOfLayers) {
        this.layNeuronsInLayer(this.brain.outputDimension, layer, noOfLayers);
      } else {
        this.layNeuronsInLayer(
          this.brain.noOfNeuronsPerLayer,
          layer,
          noOfLayers
        );
      }
    }

    this.neurons.forEach((neuron) => {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.stroke();
      ctx.beginPath();
    });
  }

  private layNeuronsInLayer(
    noOfNeuronsInLayer: number,
    layer: number,
    noOfLayers: number
  ): void {
    const availableWidth = this.canvas.width;
    const availableHeight = this.canvas.height;
    const widthPerLayer = availableWidth / noOfLayers;

    for (
      let neuronIndex = 1;
      neuronIndex <= noOfNeuronsInLayer;
      neuronIndex++
    ) {
      const neuron: NeuronUI = {
        x: widthPerLayer * layer - widthPerLayer / 2,
        y: (availableHeight / (noOfNeuronsInLayer + 2)) * (neuronIndex + 1),
        radius: Math.random() * 1 + 1,
        layerIndex: layer,
      };
      this.neurons.push(neuron);
    }
  }

  private initCanvas(): void {
    this.canvas = document.getElementById('canvas') as any;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.layNeurons();
    this.connectNeurons();
  }

  private connectNeurons(): void {
    const ctx = this.canvas.getContext('2d');
    const noOfLayers = this.brain.noOfHiddenLayers + 2;
    ctx.beginPath();
    for (
      let layerInterface = 1;
      layerInterface < noOfLayers;
      layerInterface++
    ) {
      const currentInterfaceWeightMatrix =
        this.brainService.weights[layerInterface - 1];

      const startingLayerNeurons = this.neurons.filter(
        (neuron) => neuron.layerIndex === layerInterface
      );
      const nextLayerNeurons = this.neurons.filter(
        (neuron) => neuron.layerIndex === layerInterface + 1
      );
      startingLayerNeurons.forEach((neuron, startLayerNeuronIndex) => {
        ctx.moveTo(neuron.x, neuron.y);

        nextLayerNeurons.forEach((destinationNeuron, nextLayerNeuronIndex) => {
          const decimal = Math.abs(
            currentInterfaceWeightMatrix[nextLayerNeuronIndex][
              startLayerNeuronIndex
            ]
          )
            .toString()
            .split('.')[1];
          // ctx.lineWidth = (+`0.${decimal}` / 4) * layerInterface*2;
          ctx.lineWidth = 0.5;
          ctx.lineTo(destinationNeuron.x, destinationNeuron.y);
          this.cdr.detectChanges();
          ctx.lineWidth = 0.0;
          ctx.moveTo(neuron.x, neuron.y);
          this.cdr.detectChanges();
        });
        ctx.strokeStyle = 'white';
        ctx.stroke();
      });
    }
  }
}
