import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Int64 } from '../jailbreak/webkit-7.02/int64';
import * as xxx from '../jailbreak/webkit-7.02/utils';
import * as PS4 from '../jailbreak/webkit-7.02/ps4';
import * as JB702 from '../jailbreak/702';
import * as JB702CCODE from '../jailbreak/jb702/c-code';
import * as MIRA from '../jailbreak/mira702/mira';
import * as HEN_VTX_702 from '../jailbreak/ps4-hen-vtx-702';
import * as MIRACCODE from '../jailbreak/mira702/c-code';


// import * from 
// decleration
// declare function go();

// declare function debug_log(msg:any);

@Component({
  selector: 'app-payload',
  templateUrl: './payload.component.html',
  styleUrls: ['./payload.component.sass']
})
export class PayloadComponent implements OnInit {
  payloadNme: string;
  
  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // First get the id from the current route.
  const routeParams = this.route.snapshot.paramMap;
  const payloadNmeFromRoute = routeParams.get('payloadname');
  this.payloadNme=payloadNmeFromRoute;
  var browser = navigator.userAgent;

  // xxx.debug_log("Salam");
  // xxx.debug_log("Browser: " + browser);


  // xxx.debug_log(xxx.hex(10));
  // var bytes = new Uint8Array(8);
  // console.log(bytes);

  // var int_64 = new Int64(75896);
  // var y =Int64.One;
  // var z =Int64.Zero;
  // var ne =Int64.NegativeOne;
  // var fd =Int64.fromDouble(2);
  // console.log(int_64.toString());
  // console.log(y.toString());
  // console.log(z.toString());
  // console.log(ne.toString());
  // console.log(int_64.add(int_64).toString());

  }

  onGo(){
    PS4.go(this.midExploitCallback);
  }

  handle2(){
    var input2:HTMLElement=document.getElementById("input2");
    input2.focus();
    // PS4.handle2();
  }

  midExploitCallback(){
    // xxx.debug_log("Callback called");
    JB702.start();
    JB702CCODE.start();
    MIRA.start();
    HEN_VTX_702.start();
    MIRACCODE.start();
  }

  // reuseTargetObj(){
  //   PS4.reuseTargetObj();
  // }

  // ,
  //             "src/app/external/webkit-7.02/utils.js",
  //             "src/app/external/webkit-7.02/int64.js",
  //             "src/app/external/webkit-7.02/ps4.js",
  //             "src/app/external/702.js",
  //             "src/app/external/jb702/c-code.js",
  //             "src/app/external/mira702/mira.js",
  //             "src/app/external/ps4-hen-vtx-702.js",
  //             "src/app/external/mira702/c-code.js"

}
