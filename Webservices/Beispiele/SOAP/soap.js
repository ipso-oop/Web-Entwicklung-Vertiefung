const soap = require('soap');
const express = require('express');
const fs = require('fs');

const app = express();
const wsdl = fs.readFileSync('./service.wsdl', 'utf8');

// **1. SOAP-Service-Definition (WSDL)**
const service = {
    MyService: {
        MyPort: {
            sayHello: function (args) {
                return { message: `Hallo, ${args.name}!` };
            }
        }
    }
};

// Starte den Server
const server = app.listen(8000, () => {
  console.log("SOAP-Webservice läuft auf http://localhost:8000/wsdl?wsdl");
});

// SOAP-Server starten
soap.listen(server, "/wsdl", service, wsdl, () => {
  console.log("SOAP-Server bereit!");
});