import { Component, OnInit, Input } from '@angular/core';
import { ILungCancerData } from 'src/app/core/interfaces/data.interface';

@Component({
  selector: 'patient-table',
  templateUrl: './patient-table.component.html',
  styleUrls: ['./patient-table.component.scss']
})
export class PatientTableComponent implements OnInit {

  @Input() public patientData: ILungCancerData[] = [];

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

}
