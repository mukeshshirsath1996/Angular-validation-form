import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { DataserviceService } from "../dataservice.service";
import { Router } from "@angular/router";
import { debounceTime, map, filter } from "rxjs/operators";
import { fromEvent, timer, Subscription } from "rxjs";

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
  displayTimer: boolean = false;
  status: boolean = false;
  resendOTPCount: number = 0;
  otpText: number;
  _time: number = 179;
  minute: number;
  seconds: number;
  timerSubscription: Subscription;
  @ViewChild("mobileCall", { static: true }) mobileCall: ElementRef;
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

    let result = this.service.getOTP(obj);
    result.subscribe((data: any) => {
      if (data.statusCode === 200) {
        this.displayOTP = true;
        this.status = false;
        if (this.resendOTPCount === 3) {
          this.displayResendError = true;
        } else {
          setTimeout(() => {
            this.startTimer();
          }, 0);
        }
      }
    });
  }
  startTimer() {
    //console.log("in timer");
    this.displayTimer = true;
    let time = this._time;

    const numbers = timer(0, 1000);
    this.timerSubscription = numbers.subscribe(() => {
      time = time - 1;
      this.minute = Math.floor(time / 60);
      this.seconds = time % 60;
      if (this.minute == 0 && this.seconds == 0) {
        this.displayTimer = false;
        this.timerSubscription.unsubscribe();
        if (this.resendOTPCount < 3) {
          this.displayResendOTP = true;
          this.timerSubscription.unsubscribe();
        }
      }
    });
  }
  ngAfterViewInit() {
    const inputMobile = fromEvent<any>(
      this.mobileCall.nativeElement,
      "keyup"
    ).pipe(
      map(event => event.target.value),
      filter(res => res.length == 10),

      debounceTime(1000)
    );
    inputMobile.subscribe(res => {
      this.getOTP();
    });
  }

  getOTP() {
    let form = this.myForm.controls;
    if (
      form.city.status === "VALID" &&
      form.email.status === "VALID" &&
      form.fullname.status === "VALID" &&
      form.mobile.status === "VALID"
    ) {
      // call getOTP api
      this.status = true;
      this.callAPI();
    } else {
      alert("Enter Valid Fields");
      location.reload();
    }
  }
  resendOTPClick() {
    if (this.resendOTPCount < 3) {
      this.resendOTPCount = this.resendOTPCount + 1;
      this.displayResendOTP = false;

      this.callAPI();
    }
  }
  onOtpChange() {
    let form = this.myForm.controls;
    if (form.otp.status == "VALID") {
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
