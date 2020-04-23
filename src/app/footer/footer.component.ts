import { Component, OnInit } from '@angular/core';
import getYear from 'date-fns/getYear';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  footerString: string = getYear(new Date()).toString();
  
  ngOnInit() {
  }

}
