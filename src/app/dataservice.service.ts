import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class DataserviceService {
  constructor(public http: HttpClient) {}

  getOTP(contactobj: any) {
    const header = new HttpHeaders();
    header.set("content-type", "application/json");
    console.log("in service");
    return this.http.post(
      "http://lab.thinkoverit.com/api/getOTP.php",
      contactobj,
      { headers: header }
    );
  }

  verifyOTP(obj: any) {
    const header = new HttpHeaders();
    header.set("content-type", "application/json");
    console.log("in verify service");
    return this.http.post("http://lab.thinkoverit.com/api/verifyOTP.php", obj, {
      headers: header
    });
  }
}
