import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SearchComponent } from './components/search/search.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule} from '@angular/common/http';
import { NgAutocompleteModule } from 'ng-gplace-autocomplete';
import { ResultTabComponent } from './components/result-tab/result-tab.component';
import { SearchService } from './components/service/search.service';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { FavserviceService } from './components/service/favservice.service';
import { MissionService } from './components/service/mission.service';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultTabComponent,
    FavoriteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgAutocompleteModule
  ],
  providers: [SearchService,FavserviceService,MissionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
