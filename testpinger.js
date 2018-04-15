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

var pinger=new (require('./pingclient.js'))('127.0.0.1', smtpConfig, email);
pinger.startService();
