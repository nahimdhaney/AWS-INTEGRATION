var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'TOTVS - AWS Integration',
  description: 'Servicio de integracion Protheus - AWS S3',
  script: 'indexHTTP.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
// node create_windows_services.js