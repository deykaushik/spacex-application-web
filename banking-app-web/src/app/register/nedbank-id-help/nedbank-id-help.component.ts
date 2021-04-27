import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';
import { View } from '../utils/enums';

@Component({
  selector: 'app-nedbank-id-help',
  templateUrl: './nedbank-id-help.component.html',
  styleUrls: ['./nedbank-id-help.component.scss']
})
export class NedbankIdHelpComponent implements OnInit {
  @Input() showAsModal: boolean;
  @Output() onToggleHelp = new EventEmitter<boolean>();

  constructor(private router: Router, private service: RegisterService) { }

  ngOnInit() { }

  navigateClose(event: any) {
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (this.showAsModal) {
      this.service.previousView = View.NedIdHelp;
      this.onToggleHelp.emit(false);
    } else {
      this.service.SetActiveView(View.NedIdHelp, this.service.previousView);
    }
  }

  findBranch(event: any) {
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.service.makeFormDirty(false);
    this.router.navigate(['branchlocator']);
  }
}
