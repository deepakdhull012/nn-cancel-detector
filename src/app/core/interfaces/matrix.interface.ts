export type Matrix = Array<Array<number>>;

export interface Layer {
    index: number;
    type: "input" | "hidden" | "output";
    noOfNeuronsOnLayer: number;
    inputOnLayer?: Matrix;
    outPutByLayer: Matrix;
    errorOnLayer?: Matrix;
}