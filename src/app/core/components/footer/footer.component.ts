import { Component, OnInit } from '@angular/core';
import { Constants } from '../../utils/constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constants = Constants;
  developer: string = this.constants.developer;
  developedBy: string = this.constants.labels.developedBy;

  constructor() { }

  ngOnInit(): void {
  }

}
