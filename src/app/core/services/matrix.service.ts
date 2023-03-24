import { Injectable } from '@angular/core';
import { Matrix } from '../interfaces/matrix.interface';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root',
})
export class MatrixService {
  constructor(private utilService: UtilService) {}

  public generateRandomMatrix(
    startRange: number,
    endRange: number,
    noOfRows: number,
    noOfColumns: number
  ): Matrix {
    const randomWeightMatrix: Matrix = [];

    for (let row = 0; row < noOfRows; row++) {
      randomWeightMatrix[row] = [];
      for (let col = 0; col < noOfColumns; col++) {
        const randomNumber =
          Math.random() * (endRange - startRange) + startRange;
        const roundedWeight = this.utilService.roundUpto(randomNumber);
        randomWeightMatrix[row][col] = roundedWeight;
      }
    }
    return randomWeightMatrix;
  }

  public arrayToMatrix(
    matrixData: Array<number>,
    noOfRows: number,
    noOfColumns: number
  ): Matrix {
    const validParamType =
      matrixData.length &&
      typeof noOfColumns === 'number' &&
      typeof noOfRows === 'number';
    if (validParamType) {
      const validParams = noOfColumns * noOfRows === matrixData.length;
      if (validParams) {
        const matrix: Matrix = [];
        let indexTraversed = 0;
        for (let row = 0; row < noOfRows; row++) {
          matrix[row] = [];
          for (let column = 0; column < noOfColumns; column++) {
            matrix[row][column] = matrixData[indexTraversed++];
          }
        }
        return matrix;
      } else {
        throw new Error('(cols * rows) is not equal data.length');
      }
    } else {
      throw new Error('invalid params type');
    }
  }

  public matrixToArray(matrix: Matrix): Array<number> {
    const array = [];
    for (let rowData of matrix) {
      for (let n of rowData) {
        array.push(n);
      }
    }
    return array;
  }

  public multiplyMatrix(matrix1: Matrix, matrix2: Matrix): Matrix {
    const noOfColsInMatrix1 = matrix1[0].length;
    const noOfRowsInMatrix2 = matrix2.length;
    if (noOfColsInMatrix1 === noOfRowsInMatrix2) {
      const resultantMatrix: Matrix = [];
      for (const matrix1RowIndex in matrix1) {
        resultantMatrix[matrix1RowIndex] = [];
        let matrix2ColIndex = 0;
        while (matrix2ColIndex < matrix2[0].length) {
          let sum = 0;
          for (const matrix1ColIndex in matrix1[matrix1RowIndex]) {
            sum +=
              matrix1[matrix1RowIndex][matrix1ColIndex] *
              matrix2[matrix1ColIndex][matrix2ColIndex];
          }
          resultantMatrix[matrix1RowIndex][matrix2ColIndex] = sum;
          matrix2ColIndex++;
        }
      }
      return resultantMatrix;
    } else {
      throw new Error(
        `Order mismatch for multiplication ${matrix1.length} * ${matrix1[0].length} and${matrix2.length} * ${matrix2[0].length}`
      );
    }
  }

  public multiplyByScalar(matrix: Matrix, scalar: number): Matrix {
    for (let row in matrix) {
      for (let col in matrix[row]) {
        matrix[row][col] *= scalar;
      }
    }
    return matrix;
  }

  public transposeMatrix(matrix: Matrix): Matrix {
    let transposedMatrix: Matrix = [];
    for (let col = 0; col < matrix[0].length; col++) {
      transposedMatrix[col] = [];
      for (let row = 0; row < matrix.length; row++) {
        transposedMatrix[col][row] = matrix[row][col];
      }
    }
    return transposedMatrix;
  }

  public addTwoMatrixes(matrix1: Matrix, matrix2: Matrix): Matrix {
    let sumMatrix: Matrix = [];
    for (let row in matrix1) {
      sumMatrix[row] = [];
      for (let col in matrix1[row]) {
        sumMatrix[row][col] = this.utilService.roundUpto(
          matrix1[row][col] + matrix2[row][col]
        );
      }
    }
    return sumMatrix;
  }

  public subtractMatrixes(matrix1: Matrix, matrix2: Matrix): Matrix {
    if (
      this.areMatrixOfSameOrder(matrix1, matrix2)
    ) {
      let resultantMatrix: Matrix = [];
      for (let row = 0; row < matrix1.length; row++) {
        resultantMatrix[row] = [];
        for (let col = 0; col < matrix1[0].length; col++) {
          resultantMatrix[row][col] = matrix1[row][col] - matrix2[row][col];
        }
      }
      return resultantMatrix;
    } else {
      throw new Error(
        `Both matrixes should be of same order to perform subtraction ${matrix1.length} * ${matrix1[0].length} and${matrix2.length} * ${matrix2[0].length}`
      );
    }
  }

  public oneMinusMatrixes(matrix: Matrix): Matrix {
    if (
      matrix.length
    ) {
      let resultantMatrix: Matrix = [];
      for (let row = 0; row < matrix.length; row++) {
        resultantMatrix[row] = [];
        for (let col = 0; col < matrix[0].length; col++) {
          resultantMatrix[row][col] = 1 - matrix[row][col];
        }
      }
      return resultantMatrix;
    } else {
      throw new Error(
        `Please pass proper matrix with data - current is ${matrix.length} * ${matrix[0].length}`
      );
    }
  }

  public multiplyMatrixDataAsNormal(matrix1: Matrix, matrix2: Matrix): Matrix {
    if (this.areMatrixOfSameOrder(matrix1, matrix2)) {
      let resultantMatrix: Matrix = [];
      for (let row = 0; row < matrix1.length; row++) {
        resultantMatrix[row] = [];
        for (let col = 0; col < matrix1[0].length; col++) {
          resultantMatrix[row][col] = matrix1[row][col] * matrix2[row][col];
        }
      }
      return resultantMatrix;
    } else {
      throw new Error(
        `Both matrixes should be of same order to perform subtraction ${matrix1.length} * ${matrix1[0].length} and${matrix2.length} * ${matrix2[0].length}`
      );
    }
  }

  private areMatrixOfSameOrder(matrix1: Matrix, matrix2: Matrix): boolean {
    return !!(matrix1.length &&
    matrix2.length &&
    matrix1.length === matrix2.length &&
    matrix1[0].length === matrix2[0].length);
  }
}
