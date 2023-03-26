import { Component, OnInit, Input } from '@angular/core';
import { ILungCancerData } from 'src/app/core/interfaces/data.interface';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss']
})
export class PatientTableComponent implements OnInit {

  @Input() public patientData: ILungCancerData[] = [];
  @Input() public nonCancerousFalse = 0;
  @Input() public label = "";
  public window = window;

  safe_color: ThemePalette = 'primary';
  accent_color: ThemePalette = 'accent';
  warn_color: ThemePalette = 'warn';

  constructor() { }

  ngOnInit(): void {
  }

  getStringValue(value: number): string {
    return value === 2 ? "Yes" : "No";
  }

  getFailedLength(): number {
    return this.patientData.filter(p => {
      return p.accuracy_score < 50;
    }).length;
  }

  getCriteriaPercentage(accuracyScoreMin: number, accuracyScoreMax: number): number {
    const allCount = this.patientData.length;
    if (allCount > 0) {
      const criteriaFilled =  this.patientData.filter(p => {
        return p.accuracy_score >= accuracyScoreMin && p.accuracy_score < accuracyScoreMax;
      }).length;
      return (criteriaFilled/allCount);
    } else {
      return 0;
    }
  }

}
