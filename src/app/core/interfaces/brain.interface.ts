export interface Brain {
    inputDimension: number;
    outputDimension: number;
    noOfNeuronsPerLayer: number;
    noOfHiddenLayers: number;
    learningRate: number; // must be > 0 and < 1
}