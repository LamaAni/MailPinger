//
var target=process.argv.length<3 || process.argv[2]==null ? "127.0.0.1" : process.argv[2];
var subject=process.argv.length<4 || process.argv[3]==null ? "Ping test failed." : process.argv[3];
var msg=process.argv.length<5 || process.argv[4]==null ? "Ping test failed when testing pinger." : process.argv[4];
var em='info@pgfarmhouse.com';
console.log('Validating targer: '+target);

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
  subject: subject,
  text: msg
};


var pinger=new (require('./pingclient.js'))(target, smtpConfig, email);
pinger.startService();
