import { Component, OnInit } from '@angular/core';
import { AuthService } from './security/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'teste-gibas';


  constructor(public authService: AuthService) {
  }

  public ngOnInit() {
  }


  public login() {
    this.authService.login('bijay', 'secret')
    .subscribe(result => {
      console.log(result);
    });
  }

}
