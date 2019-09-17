import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './security/service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { TokenStoreService } from './security/token.store.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    TokenStoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
