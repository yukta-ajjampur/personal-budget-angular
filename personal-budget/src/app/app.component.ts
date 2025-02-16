import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { HerComponent } from './her/her.component';
import { FooterComponent } from './footer/footer.component';


@Component({
  selector: 'pb-root',
  imports: [RouterOutlet, MenuComponent, HerComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'personal-budget';
}
