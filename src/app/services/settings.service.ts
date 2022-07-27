import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  
  private linkTheme = document.querySelector('#theme');

  constructor() {
    //console.log('Settings Services init');
    
    const url = localStorage.getItem('theme') || '.assets/css/colors/purple-dark.css';
    this.linkTheme?.setAttribute('href', url);
   }

   changeTheme(theme: string){
    //console.log(theme);
    //const linkTheme = document.querySelector('#theme');
    //console.log(linkTheme);
    const url = `./assets/css/colors/${theme}.css`;

    this.linkTheme?.setAttribute('href', url);
    localStorage.setItem('theme', url);

    this.checkCurrentTheme();
  }

  checkCurrentTheme(){
    //corta 1 
    const links = document.querySelectorAll('.selector');
    //console.log(links);
    links.forEach(elem => {
      elem.classList.remove('working');
      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme?.getAttribute('href');

      if (btnThemeUrl === currentTheme) {
        elem.classList.add('working');
      }
    })  
  }

}
