import { Injectable } from '@angular/core';
import { Layer, Matrix } from '../interfaces/matrix.interface';
import { ActivationFunctionsService } from './activation-functions.service';
import { MatrixService } from './matrix.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class BrainService {
  public learningRate = 0.1;

  private noOfHiddenLayers = 0;
  private neuronsPerLayers = 0;
  private inputSize = 0;
  private outputLayerSize = 0;

  public weights: Array<Matrix> = [];
  private layers: Array<Layer> = [];

  public errorForCurrentSet = 0;
  public n1ForCurrent = 0;
  public n2ForCurrent = 0;

  constructor(
    private matrixService: MatrixService,
    private activationFunctionService: ActivationFunctionsService,
    private utilService: UtilService
  ) {}

  public initBrain(
    noOfHiddenLayers: number,
    neuronsPerLayer: number,
    inputSize: number,
    outputSize: number
  ): void {
    this.noOfHiddenLayers = noOfHiddenLayers;
    this.neuronsPerLayers = neuronsPerLayer;
    this.inputSize = inputSize;
    this.outputLayerSize = outputSize;
    this.initHiddenLayers();
  }

  public train(input: Array<number>, expectedOutput: Array<number>, testMode = false): void {
    
    const inputLayer = this.layers[0];
    const inputDataMatrix = this.matrixService.arrayToMatrix(
      input,
      inputLayer.noOfNeuronsOnLayer,
      1
    );
    inputLayer.outPutByLayer = inputDataMatrix;

    for (
      let layerInterface = 0;
      layerInterface < this.weights.length;
      layerInterface++
    ) {
      const currentLayer = this.layers[layerInterface + 1];

      const previousLayer = this.layers[layerInterface];
      const weightMatrixForLayerInterface = this.weights[layerInterface];
      currentLayer.inputOnLayer = this.matrixService.multiplyMatrix(
        weightMatrixForLayerInterface,
        previousLayer.outPutByLayer
      );
      const currentLayerInputAsArray = this.matrixService.matrixToArray(
        currentLayer.inputOnLayer
      );
      const currentLayerOutputAsArray =
        this.activationFunctionService.sigMoidOnArray(currentLayerInputAsArray);
      currentLayer.outPutByLayer = this.matrixService.arrayToMatrix(
        currentLayerOutputAsArray,
        currentLayer.noOfNeuronsOnLayer,
        1
      );
      if (layerInterface === this.weights.length - 1) {
        // Output Layer

        const errorData: Array<number> = this.utilService.calculateError(
          currentLayerOutputAsArray,
          expectedOutput
        );
        //console.error("error status current expected error", currentLayerOutputAsArray, expectedOutput, errorData[0])
        this.errorForCurrentSet+= Math.abs(errorData[0]);
        this.n1ForCurrent = currentLayerOutputAsArray[0];
        this.n2ForCurrent = currentLayerOutputAsArray[1];
        const errorMatrix = this.matrixService.arrayToMatrix(
          errorData,
          currentLayer.noOfNeuronsOnLayer,
          1
        );
        currentLayer.errorOnLayer = errorMatrix;
        if (!testMode) {
          this.backPropagate();
        }
        
      }
      
    }
  }

  private backPropagate(): void {
    this.computeErrorOnHiddenLayers();
    this.updateWeights();
  }

  private computeErrorOnHiddenLayers(): void {
    for (
      let hiddenLayerIndex = this.noOfHiddenLayers;
      hiddenLayerIndex >= 1;
      hiddenLayerIndex--
    ) {
      const nextLayer = this.layers[hiddenLayerIndex + 1];
      const currentHiddenLayer = this.layers[hiddenLayerIndex];
      const currentHiddenLayerNextLayerWeights = this.weights[hiddenLayerIndex];
      const transposeMatrix = this.matrixService.transposeMatrix(
        currentHiddenLayerNextLayerWeights
      );
      const nextLayerErrorMatrix = nextLayer.errorOnLayer as Matrix;
      const currentLayerErrorMatrix = this.matrixService.multiplyMatrix(
        transposeMatrix,
        nextLayerErrorMatrix
      );
      currentHiddenLayer.errorOnLayer = currentLayerErrorMatrix;
    }
  }


  private updateWeights(): void {
    for(let weightInterface = this.weights.length - 1; weightInterface >=0; weightInterface--) {
      const nextLayer = this.layers[weightInterface+1];
      const previousLayer = this.layers[weightInterface];
      const errorDifferenceMatrix = nextLayer.errorOnLayer as Matrix;
      const sigmoidPart = nextLayer.outPutByLayer;
      const oneMinusSigmoid = this.matrixService.oneMinusMatrixes(sigmoidPart);
      const outputByPreviousLayer = previousLayer.outPutByLayer;
      const sigMoidMultiplication = this.matrixService.multiplyMatrixDataAsNormal(sigmoidPart, oneMinusSigmoid);
      const sigMoidIntoError = this.matrixService.multiplyMatrixDataAsNormal(sigMoidMultiplication, errorDifferenceMatrix);
      const sigMoidIntoErrorWithLearningRate = this.matrixService.multiplyByScalar(sigMoidIntoError, this.learningRate);
      const transposeOutput = this.matrixService.transposeMatrix(outputByPreviousLayer);
      const deltaWeights = this.matrixService.multiplyMatrix(sigMoidIntoErrorWithLearningRate, transposeOutput);
      const currentWeights = this.weights[weightInterface];
      const newWeights = this.matrixService.addTwoMatrixes(currentWeights, deltaWeights);
      this.weights[weightInterface] = newWeights;
      // console.error(`Delta for interface ${weightInterface} is ${deltaWeights} old ${currentWeights} new ${newWeights}`)
    }
  }

  private generateLayers(): void {
    this.layers = [];
    const inputLayer: Layer = {
      index: 0,
      type: 'input',
      outPutByLayer: [] as Matrix,
      noOfNeuronsOnLayer: this.inputSize,
    };
    this.layers.push(inputLayer);
    for (
      let hiddenLayer = 1;
      hiddenLayer <= this.noOfHiddenLayers;
      hiddenLayer++
    ) {
      const hiddenlayer: Layer = {
        index: hiddenLayer,
        type: 'hidden',
        outPutByLayer: [] as Matrix,
        noOfNeuronsOnLayer: this.neuronsPerLayers,
      };
      this.layers.push(hiddenlayer);
    }
    const outputLayer: Layer = {
      index: this.layers.length,
      type: 'output',
      outPutByLayer: [] as Matrix,
      noOfNeuronsOnLayer: this.outputLayerSize,
    };
    this.layers.push(outputLayer);
  }

  private generateLayerInterfaces(): void {
    this.weights = [];
    for (
      let connection = 0;
      connection <= this.noOfHiddenLayers;
      connection++
    ) {
      const noOfRows =
        connection === this.noOfHiddenLayers
          ? this.outputLayerSize
          : this.neuronsPerLayers;
      const noOfColumns =
        connection === 0 ? this.inputSize : this.neuronsPerLayers;

      const defaultWeightMetrix = this.matrixService.generateRandomMatrix(
        -0.71,
        0.71,
        noOfRows,
        noOfColumns
      );
      this.weights.push(defaultWeightMetrix);
    }
  }

  private initHiddenLayers(): void {
    this.generateLayers();
    this.generateLayerInterfaces();
  }
}
