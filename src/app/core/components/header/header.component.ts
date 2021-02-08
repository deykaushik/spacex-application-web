import { Component, OnInit } from '@angular/core';
import { Constants } from '../../utils/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  logo: string = Constants.logoText;
  
  constructor() { }

  ngOnInit(): void {
  }

}
