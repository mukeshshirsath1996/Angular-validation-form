import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.css"]
})
export class WelcomeComponent implements OnInit {
  name: string;
  constructor(private router: ActivatedRoute) {}

  ngOnInit() {
    this.router.paramMap.subscribe(result => {
      this.name = result.get("fullname");
    });
  }
}
