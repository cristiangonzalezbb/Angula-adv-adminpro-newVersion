import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: [
  ]
})
export class AccountSettingsComponent implements OnInit {
  
  constructor(private ss: SettingsService) { 
  }

  ngOnInit(): void {
    //habilito 1:
    this.ss.checkCurrentTheme();
  }

  changeTheme(theme: string){
    this.ss.changeTheme(theme);
  }
  
}
