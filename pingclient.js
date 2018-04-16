var nodemailer = require('nodemailer');
var defaultSmtpConfig=null;
var defaultMailOptions=null;
var ping = require('ping');

{ // remove unneeded variables.
	var em='info@pgfarmhouse.com';

	defaultSmtpConfig = {
	    host: 'mail.gandi.net',
	    port: 25,
	    secure: false, // upgrade later with STARTTLS
	    auth: {
	      user: em,
	      pass: 'PGFarmhouse2016!'
	    }
	};

	defaultMailOptions = {
	  from: em,
	  to: em,
	  subject: 'Sending Email using Node.js',
	  text: 'That was easy!'
	};
}

var pingclient=function(checkIP,smtpConfig,msgConfig){
	if(checkIP==null)
	{
		throw "Cannot configure without an IP to check";
	}
	this.checkIP=checkIP;
	this.mailer= nodemailer.createTransport(smtpConfig == null ? defaultSmtpConfig : smtpConfig);
	this.mailConfig=msgConfig == null ? defaultMailOptions : msgConfig;
	this.IntervalTime=1000;
	this.MessageSendingIntervalTime=5*60*1000;
	this.LastErrorFound=-1;
};

module.exports=pingclient;

pingclient.prototype={
	startService:function(){
		var me=this;
		if(this.__intervalID!=null)
		{
			clearTimeout(this.__intervalID);
			this.__intervalID=null;
		}
		this.__intervalID=setTimeout(function(){
			me.__intervalID=null;
			me.serviceInterval();
		},this.IntervalTime)
	},
	serviceInterval:function(){
		var me=this;
		ping.sys.probe(this.checkIP,function(isAlive){
			if(!isAlive)
			{
				me.doOnError();
				var fromLastSend=(new Date()).getTime()-me.LastErrorFound;
				var waitUntilNextSend=me.MessageSendingIntervalTime-fromLastSend;
				console.log("pingclient: Error checking ping, no response from "+me.checkIP+
					". Next email if error persists in: "+Math.round(waitUntilNextSend/1000)+" [s]");
			}
			else
			{
				console.log("Pingclient: "+me.checkIP+" OK.");
			}
			me.startService();
		});
	},
	doOnError:function(){
		var needErrorSend=this.LastErrorFound<0 ||
			((new Date()).getTime()-this.LastErrorFound>this.MessageSendingIntervalTime);
		if(needErrorSend)
		{
			console.log("Sending email on failure...");
			this.LastErrorFound=(new Date()).getTime();
			var me=this;
			setTimeout(function(){
				me.mailer.sendMail(me.mailConfig, function(error, info){
				  if (error) {
				    console.log(error);
				  } else {
				    console.log('Email sent: ' + info.response);
				  }
				});
			},1);
		}
	},

};