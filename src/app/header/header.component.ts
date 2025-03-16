import { Component } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) {
  }
  goToHome(){
    this.router.navigate(['/login']);
  }
}
