var fs = require('fs');
var modbus = require('jsmodbus');
var PubNub = require('pubnub');
var Labellerct = null,
  Labellerresults = null,
  CntInLabeller = null,
  CntOutLabeller = null,
  Labelleractual = 0,
  Labellertime = 0,
  Labellersec = 0,
  LabellerflagStopped = false,
  Labellerstate = 0,
  Labellerspeed = 0,
  LabellerspeedTemp = 0,
  LabellerflagPrint = 0,
  LabellersecStop = 0,
  LabellerdeltaRejected = null,
  LabellerONS = false,
  LabellertimeStop = 60, //NOTE: Timestop
  LabellerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
  LabellerflagRunning = false,
  LabellerRejectFlag = false,
  LabellerReject,
  LabellerWait,
  LabellerBlock,
  LabellerVerify = (function() {
    try {
      LabellerReject = fs.readFileSync('LabellerRejected.json');
      if (LabellerReject.toString().indexOf('}') > 0 && LabellerReject.toString().indexOf('{\"rejected\":') != -1) {
        LabellerReject = JSON.parse(LabellerReject);
      } else {
        throw 12121212;
      }
    } catch (err) {
      if (err.code == 'ENOENT' || err == 12121212) {
        fs.writeFileSync('LabellerRejected.json', '{"rejected":0}'); //NOTE: Change the object to what it usually is.
        LabellerReject = {
          rejected: 0
        };
      }
    }
  })();
var intId1, intId2, intId3, intId4;
var Depuckerct = null,
  Depuckerresults = null,
  CntInDepucker = null,
  CntOutDepucker = null,
  Depuckeractual = 0,
  Depuckertime = 0,
  Depuckersec = 0,
  DepuckerflagStopped = false,
  Depuckerstate = 0,
  Depuckerspeed = 0,
  DepuckerspeedTemp = 0,
  DepuckerflagPrint = 0,
  DepuckersecStop = 0,
  DepuckerONS = false,
  DepuckertimeStop = 60, //NOTE: Timestop en segundos
  DepuckerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
  DepuckerflagRunning = false,
  DepuckerBlock = 0;

var Capperct = null,
  Capperresults = null,
  CntInCapper = null,
  CntOutCapper = null,
  Capperactual = 0,
  Cappertime = 0,
  Cappersec = 0,
  CapperflagStopped = false,
  Capperstate = 0,
  Capperspeed = 0,
  CapperspeedTemp = 0,
  CapperflagPrint = 0,
  CappersecStop = 0,
  CapperdeltaRejected = null,
  CapperONS = false,
  CappertimeStop = 60, //NOTE: Timestop
  CapperWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
  CapperflagRunning = false,
  CapperRejectFlag = false,
  CapperReject,
  CapperWait,
  CapperBlock,
  CapperVerify = (function() {
    try {
      CapperReject = fs.readFileSync('CapperRejected.json')
      if (CapperReject.toString().indexOf('}') > 0 && CapperReject.toString().indexOf('{\"rejected\":') != -1) {
        CapperReject = JSON.parse(CapperReject)
      } else {
        throw 12121212
      }
    } catch (err) {
      if (err.code == 'ENOENT' || err == 12121212) {
        fs.writeFileSync('CapperRejected.json', '{"rejected":0}') //NOTE: Change the object to what it usually is.
        CapperReject = {
          rejected: 0
        }
      }
    }
  })()
var Fillerct = null,
  Fillerresults = null,
  CntInFiller = null,
  CntOutFiller = null,
  Filleractual = 0,
  Fillertime = 0,
  Fillersec = 0,
  FillerflagStopped = false,
  Fillerstate = 0,
  Fillerspeed = 0,
  FillerspeedTemp = 0,
  FillerflagPrint = 0,
  FillersecStop = 0,
  FillerONS = false,
  FillertimeStop = 60, //NOTE: Timestop en segundos
  FillerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
  FillerflagRunning = false,
  FillerBlock,
  FillerWait;

var CaseFormerct = null,
  CaseFormerresults = null,
  CntInCaseFormer = null,
  CntOutCaseFormer = null,
  CaseFormeractual = 0,
  CaseFormertime = 0,
  CaseFormersec = 0,
  CaseFormerflagStopped = false,
  CaseFormerstate = 0,
  CaseFormerspeed = 0,
  CaseFormerspeedTemp = 0,
  CaseFormerflagPrint = 0,
  CaseFormersecStop = 0,
  CaseFormerONS = false,
  CaseFormertimeStop = 60, //NOTE: Timestop en segundos
  CaseFormerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
  CaseFormerflagRunning = false,
  CaseFormerWait,
  CaseFormerBlock;
var CasePackerct = null,
  CasePackerresults = null,
  CntInCasePacker = null,
  CntOutCasePacker = null,
  CasePackeractual = 0,
  CasePackertime = 0,
  CasePackersec = 0,
  CasePackerflagStopped = false,
  CasePackerstate = 0,
  CasePackerspeed = 0,
  CasePackerspeedTemp = 0,
  CasePackerflagPrint = 0,
  CasePackersecStop = 0,
  CasePackerdeltaRejected = null,
  CasePackerONS = false,
  CasePackertimeStop = 60, //NOTE: Timestop
  CasePackerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
  CasePackerflagRunning = false,
  CasePackerRejectFlag = false,
  CasePackerReject,
  CasePackerWaitBox,
  CasePackerWaitBot,
  CasePackerBlock,
  CasePackerVerify = (function() {
    try {
      CasePackerReject = fs.readFileSync('CasePackerRejected.json')
      if (CasePackerReject.toString().indexOf('}') > 0 && CasePackerReject.toString().indexOf('{\"rejected\":') != -1) {
        CasePackerReject = JSON.parse(CasePackerReject)
      } else {
        throw 12121212
      }
    } catch (err) {
      if (err.code == 'ENOENT' || err == 12121212) {
        fs.writeFileSync('CasePackerRejected.json', '{"rejected":0}') //NOTE: Change the object to what it usually is.
        CasePackerReject = {
          rejected: 0
        }
      }
    }
  })()

var secPubNub=0;
var CaseSealerct = null,
  CaseSealerresults = null,
  CntInCaseSealer = null,
  CntOutCaseSealer = null,
  CaseSealeractual = 0,
  CaseSealertime = 0,
  CaseSealersec = 0,
  CaseSealerflagStopped = false,
  CaseSealerstate = 0,
  CaseSealerspeed = 0,
  CaseSealerspeedTemp = 0,
  CaseSealerflagPrint = 0,
  CaseSealersecStop = 0,
  CaseSealerONS = false,
  CaseSealertimeStop = 60, //NOTE: Timestop en segundos
  CaseSealerWorktime = 0.99, //NOTE: Intervalo de tiempo en minutos para actualizar el log
  CaseSealerflagRunning = false,
  CaseSelaerWait;
  var CntOutEOL=null,
      secEOL=0;

var client1 = modbus.client.tcp.complete({
  'host': "192.168.10.116",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout': 30000
});
var client2 = modbus.client.tcp.complete({
  'host': "192.168.10.117",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout': 30000
});
var client3 = modbus.client.tcp.complete({
  'host': "192.168.10.112",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout': 30000
});
var client4 = modbus.client.tcp.complete({
  'host': "192.168.10.115",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout': 30000
});

var pubnub = new PubNub({
  publishKey: "pub-c-8d024e5b-23bc-4ce8-ab68-b39b00347dfb",
  subscribeKey: "sub-c-c3b3aa54-b44b-11e7-895e-c6a8ff6a3d85",
  uuid: "CUE_PCL_LINE14"
});

var senderData = function() {
  pubnub.publish(publishConfig, function(status, response) {});
};


try {
  client1.connect();
  client2.connect();
  client3.connect();
  client4.connect();
} catch (err) {
  fs.appendFileSync("error_connection.log", err + '\n');
}

var joinWord = function( num1, num2) {
  var bits = "00000000000000000000000000000000";
  var bin1 = Number(num1).toString(2),
    bin2 = Number(num2).toString(2),
    newNum = bits.split("");

  for (i = 0; i < bin1.length; i++) {
    newNum[31 - i] = bin1[(bin1.length - 1) - i];
  }
  for (i = 0; i < bin2.length; i++) {
    newNum[15 - i] = bin2[(bin2.length - 1) - i];
  }
  bits = newNum.join("");
  return parseInt(bits, 2);
};

client1.on('connect', function(err) {
  intId1 =
    setInterval(function() {
      client1.readCoils(0, 7).then(function(resp) {

        // resp will look like { response : [TCP|RTU]Response, request: [TCP|RTU]Request }
        // the data will be located in resp.response.body.coils: <Array>, resp.response.body.payload: <Buffer>
        LabellerWait = resp.coils[1];
        LabellerBlock = resp.coils[3];
        DepuckerBlock = resp.coils[2];
        CapperWait = resp.coils[6];
        //console.log(resp);
        //console.log(resp);

      }, console.error);

      client1.readHoldingRegisters(0, 16).then(function(resp) {
        CntInLabeller = joinWord(resp.register[10], resp.register[11]);
        CntOutLabeller = joinWord(resp.register[8], resp.register[9]);
        CntInCapper = joinWord(resp.register[14], resp.register[15]);
        //console.log(joinWord(resp.register[14], resp.register[15]));
        //------------------------------------------Labeller----------------------------------------------
        Labellerct = CntOutLabeller // NOTE: igualar al contador de salida
        if (!LabellerONS && Labellerct) {
          LabellerspeedTemp = Labellerct
          Labellersec = Date.now()
          LabellerONS = true
          Labellertime = Date.now()
        }
        if (Labellerct > Labelleractual) {
          if (LabellerflagStopped) {
            Labellerspeed = Labellerct - LabellerspeedTemp
            LabellerspeedTemp = Labellerct
            Labellersec = Date.now()
            LabellerdeltaRejected = null
            LabellerRejectFlag = false
            Labellertime = Date.now()
          }
          LabellersecStop = 0
          Labellerstate = 1
          LabellerflagStopped = false
          LabellerflagRunning = true
        } else if (Labellerct == Labelleractual) {
          if (LabellersecStop == 0) {
            Labellertime = Date.now()
            LabellersecStop = Date.now()
          }
          if ((Date.now() - (LabellertimeStop * 1000)) >= LabellersecStop) {
            Labellerspeed = 0
            Labellerstate = 2
            LabellerspeedTemp = Labellerct
            LabellerflagStopped = true
            LabellerflagRunning = false
            if (CntInLabeller - CntOutLabeller - LabellerReject.rejected != 0 && !LabellerRejectFlag) {
              LabellerdeltaRejected = CntInLabeller - CntOutLabeller - LabellerReject.rejected
              LabellerReject.rejected = CntInLabeller - CntOutLabeller
              fs.writeFileSync('LabellerRejected.json', '{"rejected": ' + LabellerReject.rejected + '}')
              LabellerRejectFlag = true
            } else {
              LabellerdeltaRejected = null
            }
            LabellerflagPrint = 1
          }
        }
        Labelleractual = Labellerct
        if (Date.now() - 60000 * LabellerWorktime >= Labellersec && LabellersecStop == 0) {
          if (LabellerflagRunning && Labellerct) {
            LabellerflagPrint = 1
            LabellersecStop = 0
            Labellerspeed = Labellerct - LabellerspeedTemp
            LabellerspeedTemp = Labellerct
            Labellersec = Date.now()
          }
        }
        if (Labellerstate == 2) {
          if (LabellerBlock == 1) {
            Labellerstate = 4;
          } else if (LabellerWait == 0) {
            Labellerstate = 3;
          }
        }

        Labellerresults = {
          ST: Labellerstate,
          CPQI: CntInLabeller,
          CPQO: CntOutLabeller,
          CPQR: LabellerdeltaRejected,
          SP: Labellerspeed
        }
        if (LabellerflagPrint == 1) {
          for (var key in Labellerresults) {
            if (Labellerresults[key] != null && !isNaN(Labellerresults[key]))
              //NOTE: Cambiar path
              fs.appendFileSync('C:/PULSE/L14_LOGS/mex_pcl_Labeller_L14.log', 'tt=' + Labellertime + ',var=' + key + ',val=' + Labellerresults[key] + '\n')
          }
          LabellerflagPrint = 0;
          LabellersecStop = 0;
          Labellertime = Date.now()
        }
        //------------------------------------------Labeller----------------------------------------------
      }); //Cierre de lectura
    }, 1000);
}); //Cierre de cliente

client1.on('error', function(err) {
  clearInterval(intId1);
});
client1.on('close', function() {
  clearInterval(intId1);
});

client2.on('connect', function(err) {
  intId2 =
    setInterval(function() {
      client2.readCoils(0, 7).then(function(resp) {

        // resp will look like { response : [TCP|RTU]Response, request: [TCP|RTU]Request }
        // the data will be located in resp.response.body.coils: <Array>, resp.response.body.payload: <Buffer>
        CapperWait = resp.coils[4];
        FillerBlock = resp.coils[0];
        FillerWait = resp.coils[1];
        //console.log(resp);


      }, console.error);

      client2.readHoldingRegisters(0, 15).then(function(resp) {
        CntInDepucker = joinWord(resp.register[12], resp.register[13]);
        CntOutCapper = joinWord(resp.register[10], resp.register[11]);
        CntOutFiller = joinWord(resp.register[4], resp.register[5]);
        CntInFiller = joinWord(resp.register[6], resp.register[7]);
        //------------------------------------------Depucker----------------------------------------------
        Depuckerct = CntInDepucker; // NOTE: igualar al contador de salida
        if (!DepuckerONS && Depuckerct) {
          DepuckerspeedTemp = Depuckerct
          Depuckersec = Date.now()
          DepuckerONS = true
          Depuckertime = Date.now()
        }
        if (Depuckerct > Depuckeractual) {
          if (DepuckerflagStopped) {
            Depuckerspeed = Depuckerct - DepuckerspeedTemp
            DepuckerspeedTemp = Depuckerct
            Depuckersec = Date.now()
            Depuckertime = Date.now()
          }
          DepuckersecStop = 0
          Depuckerstate = 1
          DepuckerflagStopped = false
          DepuckerflagRunning = true
        } else if (Depuckerct == Depuckeractual) {
          if (DepuckersecStop == 0) {
            Depuckertime = Date.now()
            DepuckersecStop = Date.now()
          }
          if ((Date.now() - (DepuckertimeStop * 1000)) >= DepuckersecStop) {
            Depuckerspeed = 0
            Depuckerstate = 2
            DepuckerspeedTemp = Depuckerct
            DepuckerflagStopped = true
            DepuckerflagRunning = false
            DepuckerflagPrint = 1
          }
        }
        Depuckeractual = Depuckerct
        if (Date.now() - 60000 * DepuckerWorktime >= Depuckersec && DepuckersecStop == 0) {
          if (DepuckerflagRunning && Depuckerct) {
            DepuckerflagPrint = 1
            DepuckersecStop = 0
            Depuckerspeed = Depuckerct - DepuckerspeedTemp
            DepuckerspeedTemp = Depuckerct
            Depuckersec = Date.now()
          }
        }

        if (Depuckerstate == 2) {
          if (DepuckerBlock == 1) {
            Depuckerstate = 4;
          }
        }

        Depuckerresults = {
          ST: Depuckerstate,
          CPQI: CntInDepucker,
          //CPQO: CntOutDepucker,
          SP: Depuckerspeed
        }
        if (DepuckerflagPrint == 1) {
          for (var key in Depuckerresults) {
            if (Depuckerresults[key] != null && !isNaN(Depuckerresults[key]))
              //NOTE: Cambiar path
              fs.appendFileSync('C:/Pulse/L14_LOGS/mex_pcl_Depucker_L14.log', 'tt=' + Depuckertime + ',var=' + key + ',val=' + Depuckerresults[key] + '\n')
          }
          DepuckerflagPrint = 0
          DepuckersecStop = 0
          Depuckertime = Date.now()
        }
        //------------------------------------------Depucker----------------------------------------------
        //------------------------------------------Capper----------------------------------------------
        Capperct = CntOutCapper // NOTE: igualar al contador de salida
        if (!CapperONS && Capperct) {
          CapperspeedTemp = Capperct
          Cappersec = Date.now()
          CapperONS = true
          Cappertime = Date.now()
        }
        if (Capperct > Capperactual) {
          if (CapperflagStopped) {
            Capperspeed = Capperct - CapperspeedTemp
            CapperspeedTemp = Capperct
            Cappersec = Date.now()
            CapperdeltaRejected = null
            CapperRejectFlag = false
            Cappertime = Date.now()
          }
          CappersecStop = 0
          Capperstate = 1
          CapperflagStopped = false
          CapperflagRunning = true
        } else if (Capperct == Capperactual) {
          if (CappersecStop == 0) {
            Cappertime = Date.now()
            CappersecStop = Date.now()
          }
          if ((Date.now() - (CappertimeStop * 1000)) >= CappersecStop) {
            Capperspeed = 0
            Capperstate = 2
            CapperspeedTemp = Capperct
            CapperflagStopped = true
            CapperflagRunning = false
            if (CntInCapper - CntOutCapper - CapperReject.rejected != 0 && !CapperRejectFlag) {
              CapperdeltaRejected = CntInCapper - CntOutCapper - CapperReject.rejected
              CapperReject.rejected = CntInCapper - CntOutCapper
              fs.writeFileSync('CapperRejected.json', '{"rejected": ' + CapperReject.rejected + '}')
              CapperRejectFlag = true
            } else {
              CapperdeltaRejected = null
            }
            CapperflagPrint = 1
          }
        }
        Capperactual = Capperct
        if (Date.now() - 60000 * CapperWorktime >= Cappersec && CappersecStop == 0) {
          if (CapperflagRunning && Capperct) {
            CapperflagPrint = 1
            CappersecStop = 0
            Capperspeed = Capperct - CapperspeedTemp
            CapperspeedTemp = Capperct
            Cappersec = Date.now()
          }
        }

        if (Capperstate == 2) {
          if (CapperBlock == 1) {
            Capperstate = 4;
          } else if (CapperWait == 0) {
            Capperstate = 3;
          }
        }

        Capperresults = {
          ST: Capperstate,
          CPQI: CntInCapper,
          CPQO: CntOutCapper,
          CPQR: CapperdeltaRejected,
          SP: Capperspeed
        }
        if (CapperflagPrint == 1) {
          for (var key in Capperresults) {
            if (Capperresults[key] != null && !isNaN(Capperresults[key]))
              //NOTE: Cambiar path
              fs.appendFileSync('C:/PULSE/L14_LOGS/mex_pcl_Capper_L14.log', 'tt=' + Cappertime + ',var=' + key + ',val=' + Capperresults[key] + '\n')
          }
          CapperflagPrint = 0
          CappersecStop = 0
          Cappertime = Date.now()
        }
        //------------------------------------------Capper----------------------------------------------

        //------------------------------------------Filler----------------------------------------------
        Fillerct = CntOutFiller // NOTE: igualar al contador de salida
        if (!FillerONS && Fillerct) {
          FillerspeedTemp = Fillerct
          Fillersec = Date.now()
          FillerONS = true
          Fillertime = Date.now()
        }
        if (Fillerct > Filleractual) {
          if (FillerflagStopped) {
            Fillerspeed = Fillerct - FillerspeedTemp
            FillerspeedTemp = Fillerct
            Fillersec = Date.now()
            Fillertime = Date.now()
          }
          FillersecStop = 0
          Fillerstate = 1
          FillerflagStopped = false
          FillerflagRunning = true
        } else if (Fillerct == Filleractual) {
          if (FillersecStop == 0) {
            Fillertime = Date.now()
            FillersecStop = Date.now()
          }
          if ((Date.now() - (FillertimeStop * 1000)) >= FillersecStop) {
            Fillerspeed = 0
            Fillerstate = 2
            FillerspeedTemp = Fillerct
            FillerflagStopped = true
            FillerflagRunning = false
            FillerflagPrint = 1
          }
        }
        Filleractual = Fillerct
        if (Date.now() - 60000 * FillerWorktime >= Fillersec && FillersecStop == 0) {
          if (FillerflagRunning && Fillerct) {
            FillerflagPrint = 1
            FillersecStop = 0
            Fillerspeed = Fillerct - FillerspeedTemp
            FillerspeedTemp = Fillerct
            Fillersec = Date.now()
          }
        }

        if (Fillerstate == 2) {
          if (FillerBlock == 1) {
            Fillerstate = 4;
          } else if (FillerWait == 0) {
            Fillerstate = 3;
          }
        }

        Fillerresults = {
          ST: Fillerstate,
          CPQI: CntInFiller,
          CPQO: CntOutFiller,
          SP: Fillerspeed
        }
        if (FillerflagPrint == 1) {
          for (var key in Fillerresults) {
            if (Fillerresults[key] != null && !isNaN(Fillerresults[key]))
              //NOTE: Cambiar path
              fs.appendFileSync('C:/Pulse/L14_LOGS/mex_pcl_Filler_L14.log', 'tt=' + Fillertime + ',var=' + key + ',val=' + Fillerresults[key] + '\n')
          }
          FillerflagPrint = 0
          FillersecStop = 0
          Fillertime = Date.now()
        }
        //------------------------------------------Filler----------------------------------------------
      }); //Cierre de lectura
    }, 1000);
}); //Cierre de cliente

client2.on('error', function(err) {
  clearInterval(intId2);
});
client2.on('close', function() {
  clearInterval(intId2);
});

client3.on('connect', function(err) {
  intId3 =
    setInterval(function() {
      client3.readCoils(0, 7).then(function(resp) {

        // resp will look like { response : [TCP|RTU]Response, request: [TCP|RTU]Request }
        // the data will be located in resp.response.body.coils: <Array>, resp.response.body.payload: <Buffer>
        CaseFormerBlock = resp.coils[2];
        CasePackerWaitBot = resp.coils[0];
        CasePackerWaitBox = resp.coils[1];
        //console.log(resp);
        //console.log(resp);

      }, console.error);

      client3.readHoldingRegisters(0, 15).then(function(resp) {
        CntOutCasePacker = joinWord(resp.register[6], resp.register[7]);
        CntInCasePacker = joinWord(resp.register[12], resp.register[13]);
        CntInCaseFormer = joinWord(resp.register[8], resp.register[9]);
        CntOutCaseFormer = joinWord(resp.register[10], resp.register[11]);

        //------------------------------------------CaseFormer----------------------------------------------
        CaseFormerct = CntOutCaseFormer // NOTE: igualar al contador de salida
        if (!CaseFormerONS && CaseFormerct) {
          CaseFormerspeedTemp = CaseFormerct
          CaseFormersec = Date.now()
          CaseFormerONS = true
          CaseFormertime = Date.now()
        }
        if (CaseFormerct > CaseFormeractual) {
          if (CaseFormerflagStopped) {
            CaseFormerspeed = CaseFormerct - CaseFormerspeedTemp
            CaseFormerspeedTemp = CaseFormerct
            CaseFormersec = Date.now()
            CaseFormertime = Date.now()
          }
          CaseFormersecStop = 0
          CaseFormerstate = 1
          CaseFormerflagStopped = false
          CaseFormerflagRunning = true
        } else if (CaseFormerct == CaseFormeractual) {
          if (CaseFormersecStop == 0) {
            CaseFormertime = Date.now()
            CaseFormersecStop = Date.now()
          }
          if ((Date.now() - (CaseFormertimeStop * 1000)) >= CaseFormersecStop) {
            CaseFormerspeed = 0
            CaseFormerstate = 2
            CaseFormerspeedTemp = CaseFormerct
            CaseFormerflagStopped = true
            CaseFormerflagRunning = false
            CaseFormerflagPrint = 1
          }
        }
        CaseFormeractual = CaseFormerct
        if (Date.now() - 60000 * CaseFormerWorktime >= CaseFormersec && CaseFormersecStop == 0) {
          if (CaseFormerflagRunning && CaseFormerct) {
            CaseFormerflagPrint = 1
            CaseFormersecStop = 0
            CaseFormerspeed = CaseFormerct - CaseFormerspeedTemp
            CaseFormerspeedTemp = CaseFormerct
            CaseFormersec = Date.now()
          }
        }
        if (CaseFormerstate = 2) {
          if (CaseFormerBlock == 1) {
            CaseFormerstate = 4;
          }
        }

        CaseFormerresults = {
          ST: CaseFormerstate,
          CPQI: CntInCaseFormer,
          CPQO: CntOutCaseFormer,
          SP: CaseFormerspeed
        }
        if (CaseFormerflagPrint == 1) {
          for (var key in CaseFormerresults) {
            if (CaseFormerresults[key] != null && !isNaN(CaseFormerresults[key]))
              //NOTE: Cambiar path
              fs.appendFileSync('C:/Pulse/L14_LOGS/mex_pcl_CaseFormer_L14.log', 'tt=' + CaseFormertime + ',var=' + key + ',val=' + CaseFormerresults[key] + '\n')
          }
          CaseFormerflagPrint = 0
          CaseFormersecStop = 0
          CaseFormertime = Date.now()
        }
        //------------------------------------------CaseFormer----------------------------------------------

      }); //Cierre de lectura
    }, 1000);
}); //Cierre de cliente

client3.on('error', function(err) {
  clearInterval(intId3);
});
client3.on('close', function() {
  clearInterval(intId3);
});

client4.on('connect', function(err) {
  intId3 =
    setInterval(function() {
      client4.readCoils(0, 7).then(function(resp) {

        // resp will look like { response : [TCP|RTU]Response, request: [TCP|RTU]Request }
        // the data will be located in resp.response.body.coils: <Array>, resp.response.body.payload: <Buffer>
        CasePackerBlock = resp.coils[3];
        CaseSelaerWait = resp.coils[2];
        //console.log(resp);
        //console.log(resp);

      }, console.error);

      client4.readHoldingRegisters(0, 15).then(function(resp) {

        CntInCaseSealer = joinWord(resp.register[2], resp.register[3]);
        CntOutCaseSealer = joinWord(resp.register[8], resp.register[9]);
        CntOutEOL =  CntOutCaseSealer;
        //CntOutEOL = joinWord(resp.register[0], resp.register[1]);
        //------------------------------------------CasePacker----------------------------------------------
        CasePackerct = CntOutCasePacker // NOTE: igualar al contador de salida
        if (!CasePackerONS && CasePackerct) {
          CasePackerspeedTemp = CasePackerct
          CasePackersec = Date.now()
          CasePackerONS = true
          CasePackertime = Date.now()
        }
        if (CasePackerct > CasePackeractual) {
          if (CasePackerflagStopped) {
            CasePackerspeed = CasePackerct - CasePackerspeedTemp
            CasePackerspeedTemp = CasePackerct
            CasePackersec = Date.now()
            CasePackerdeltaRejected = null
            CasePackerRejectFlag = false
            CasePackertime = Date.now()
          }
          CasePackersecStop = 0
          CasePackerstate = 1
          CasePackerflagStopped = false
          CasePackerflagRunning = true
        } else if (CasePackerct == CasePackeractual) {
          if (CasePackersecStop == 0) {
            CasePackertime = Date.now()
            CasePackersecStop = Date.now()
          }
          if ((Date.now() - (CasePackertimeStop * 1000)) >= CasePackersecStop) {
            CasePackerspeed = 0
            CasePackerstate = 2
            CasePackerspeedTemp = CasePackerct
            CasePackerflagStopped = true
            CasePackerflagRunning = false
            if (CntInCasePacker - CntOutCasePacker - CasePackerReject.rejected != 0 && !CasePackerRejectFlag) {
              CasePackerdeltaRejected = CntInCasePacker - CntOutCasePacker - CasePackerReject.rejected
              CasePackerReject.rejected = CntInCasePacker - CntOutCasePacker
              fs.writeFileSync('CasePackerRejected.json', '{"rejected": ' + CasePackerReject.rejected + '}')
              CasePackerRejectFlag = true
            } else {
              CasePackerdeltaRejected = null
            }
            CasePackerflagPrint = 1
          }
        }
        CasePackeractual = CasePackerct
        if (Date.now() - 60000 * CasePackerWorktime >= CasePackersec && CasePackersecStop == 0) {
          if (CasePackerflagRunning && CasePackerct) {
            CasePackerflagPrint = 1
            CasePackersecStop = 0
            CasePackerspeed = CasePackerct - CasePackerspeedTemp
            CasePackerspeedTemp = CasePackerct
            CasePackersec = Date.now()
          }
        }

        if (CasePackerstate == 2) {
          if (CasePackerBlock == 1) {
            CasePackerstate = 4;
          } else if (CasePackerWaitBox == 0 || CasePackerWaitBot == 0) {
            CasePackerstate = 3;
          }
        }

        CasePackerresults = {
          ST: CasePackerstate,
          CPQI: CntInCasePacker,
          CPQO: CntOutCasePacker,
          //CPQR: CasePackerdeltaRejected,
          SP: CasePackerspeed
        }
        if (CasePackerflagPrint == 1) {
          for (var key in CasePackerresults) {
            if (CasePackerresults[key] != null && !isNaN(CasePackerresults[key]))
              //NOTE: Cambiar path
              fs.appendFileSync('C:/PULSE/L14_LOGS/mex_pcl_CasePacker_L14.log', 'tt=' + CasePackertime + ',var=' + key + ',val=' + CasePackerresults[key] + '\n')
          }
          CasePackerflagPrint = 0
          CasePackersecStop = 0
          CasePackertime = Date.now()
        }
        //------------------------------------------CasePacker----------------------------------------------
        //------------------------------------------CaseSealer----------------------------------------------
        CaseSealerct = CntOutCaseSealer // NOTE: igualar al contador de salida
        if (!CaseSealerONS && CaseSealerct) {
          CaseSealerspeedTemp = CaseSealerct
          CaseSealersec = Date.now()
          CaseSealerONS = true
          CaseSealertime = Date.now()
        }
        if (CaseSealerct > CaseSealeractual) {
          if (CaseSealerflagStopped) {
            CaseSealerspeed = CaseSealerct - CaseSealerspeedTemp
            CaseSealerspeedTemp = CaseSealerct
            CaseSealersec = Date.now()
            CaseSealertime = Date.now()
          }
          CaseSealersecStop = 0
          CaseSealerstate = 1
          CaseSealerflagStopped = false
          CaseSealerflagRunning = true
        } else if (CaseSealerct == CaseSealeractual) {
          if (CaseSealersecStop == 0) {
            CaseSealertime = Date.now()
            CaseSealersecStop = Date.now()
          }
          if ((Date.now() - (CaseSealertimeStop * 1000)) >= CaseSealersecStop) {
            CaseSealerspeed = 0
            CaseSealerstate = 2
            CaseSealerspeedTemp = CaseSealerct
            CaseSealerflagStopped = true
            CaseSealerflagRunning = false
            CaseSealerflagPrint = 1
          }
        }
        CaseSealeractual = CaseSealerct
        if (Date.now() - 60000 * CaseSealerWorktime >= CaseSealersec && CaseSealersecStop == 0) {
          if (CaseSealerflagRunning && CaseSealerct) {
            CaseSealerflagPrint = 1
            CaseSealersecStop = 0
            CaseSealerspeed = CaseSealerct - CaseSealerspeedTemp
            CaseSealerspeedTemp = CaseSealerct
            CaseSealersec = Date.now()
          }
        }
        if (CaseSealerstate == 2) {
          if (CaseSelaerWait == 0) {
            CaseSealerstate = 3;
          }
        }

        CaseSealerresults = {
          ST: CaseSealerstate,
          CPQI: CntInCaseSealer,
          CPQO: CntOutCaseSealer,
          SP: CaseSealerspeed
        }
        if (CaseSealerflagPrint == 1) {
          for (var key in CaseSealerresults) {
            if (CaseSealerresults[key] != null && !isNaN(CaseSealerresults[key]))
              //NOTE: Cambiar path
              fs.appendFileSync('C:/Pulse/L14_LOGS/mex_pcl_CaseSealer_L14.log', 'tt=' + CaseSealertime + ',var=' + key + ',val=' + CaseSealerresults[key] + '\n')
          }
          CaseSealerflagPrint = 0
          CaseSealersecStop = 0
          CaseSealertime = Date.now()
        }
        //------------------------------------------CaseSealer----------------------------------------------
        /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
              if(secEOL>=60 && CntOutEOL){
                fs.appendFileSync("C:/PULSE/L14_LOGS/mex_pcl_EOL_L14.log","tt="+Date.now()+",var=EOL"+",val="+CntOutEOL+"\n");
                secEOL=0;
              }else{
                secEOL++;
              }
        /*----------------------------------------------------------------------------------EOL----------------------------------------------------------------------------------*/
      }); //Cierre de lectura
    }, 1000);
}); //Cierre de cliente

client4.on('error', function(err) {
  clearInterval(intId4);
});
client4.on('close', function() {
  clearInterval(intId4);
});
