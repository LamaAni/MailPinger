//
var em='info@pgfarmhouse.com';
var smtpConfig = {
    host: 'mail.gandi.net',
    port: 25,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: em,
      pass: 'PGFarmhouse2016!'
    }
};

var email = {
  from: em,
  to: em,
  subject: 'Ping tester Cycle',
  text: 'Ping tester'
};

target=process.argv.length<3 || process.argv[2]==null ? "127.0.0.1" : process.argv[2];
console.log('Validating targer: '+target);
var pinger=new (require('./pingclient.js'))(target, smtpConfig, email);
pinger.startService();
