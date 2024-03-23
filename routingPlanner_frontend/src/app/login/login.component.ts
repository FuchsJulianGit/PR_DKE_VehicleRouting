import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';


import * as L from 'leaflet';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  login() {
    // Implement your login logic here
    console.log('Login button clicked');
  }

}