import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-no-details',
  templateUrl: './no-details.component.html',
  styleUrls: ['./no-details.component.scss']
})
export class NoDetailsComponent implements OnInit {
  constructor(private router: Router, private service: RegisterService) { }

  ngOnInit() { }

  navigateClose(event: any) {
     /* istanbul ignore else */
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.service.makeFormDirty(false);
    this.router.navigate(['/auth']);
  }

  findBranch(event: any) {
     /* istanbul ignore else */
    if (event != null) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.service.makeFormDirty(false);
    this.router.navigate(['branchlocator']);
  }
}
