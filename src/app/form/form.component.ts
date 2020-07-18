import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DataserviceService } from "../dataservice.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.css"]
})
export class FormComponent implements OnInit {
  myForm: FormGroup;
  displayOTP: boolean = false;
  displayResendOTP: boolean = false;
  displayResendError: boolean = false;
  resendOTPCount: number = 0;
  constructor(private service: DataserviceService, private route: Router) {}

  ngOnInit() {
    this.myForm = new FormGroup({
      city: new FormControl(null, Validators.required),
      panNumber: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")
      ]),
      fullname: new FormControl(null, [
        Validators.required,
        Validators.maxLength(140)
      ]),
      email: new FormControl(null, [
        Validators.email,
        Validators.required,
        Validators.maxLength(255)
      ]),
      mobile: new FormControl(null, [
        Validators.required,
        Validators.max(9999999999),
        Validators.min(1000000000)
      ]),
      otp: new FormControl(null, [
        Validators.required,
        Validators.max(9999),
        Validators.min(999)
      ])
    });
  }

  callAPI() {
    let obj = {
      panNumber: this.myForm.value.panNumber,
      city: this.myForm.value.city,
      fullname: this.myForm.value.fullname,
      email: this.myForm.value.email,
      mobile: this.myForm.value.mobile
    };

    if (this.resendOTPCount < 3) {
      this.resendOTPCount = this.resendOTPCount + 1;
      let result = this.service.getOTP(obj);
      result.subscribe((data: any) => {
        if (data.statusCode === 200) {
          this.displayOTP = true;
          setTimeout(() => {
            if (this.resendOTPCount < 3) {
              this.displayResendOTP = true;
            }
          }, 3 * 60000);
        }
      });
    } else {
      this.displayResendOTP = false;
      this.displayResendError = true;
    }
    return true;
  }

  getOTP(event) {
    let form = this.myForm.controls;
    if (
      form.city.status === "VALID" &&
      form.email.status === "VALID" &&
      form.fullname.status === "VALID" &&
      form.mobile.status === "VALID"
    ) {
      // call getOTP api
      this.callAPI();
      console.log("call getOTP api");
    } else {
      alert("Enter Valid Fields");
      location.reload();
    }
  }
  resendOTPClick() {
    this.callAPI();
  }
  onOtpChange(event) {
    if (event.target.value.length === 4) {
      let obj = {
        mobile: this.myForm.value.mobile,
        otp: this.myForm.value.otp
      };
      //call verify otp
      let result = this.service.verifyOTP(obj);
      result.subscribe((data: any) => {
        if (data.statusCode === 200) {
          this.route.navigate(["welcome", this.myForm.value.fullname]);
        }
      });
    }
  }
}
