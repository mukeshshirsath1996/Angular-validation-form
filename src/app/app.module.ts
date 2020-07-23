import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
//import { ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormComponent } from "./form/form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DataserviceService } from "./dataservice.service";
import { HttpClientModule } from "@angular/common/http";
import { WelcomeComponent } from "./welcome/welcome.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "verify", pathMatch: "full" },
  { path: "verify", component: FormComponent },
  { path: "welcome/:fullname", component: WelcomeComponent }
];

@NgModule({
  declarations: [AppComponent, FormComponent, WelcomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [DataserviceService],
  bootstrap: [AppComponent]
})
export class AppModule {}
