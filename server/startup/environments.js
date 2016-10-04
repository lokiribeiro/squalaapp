Meteor.startup(function () {
    process.env.MAIL_URL = "smtp://postmaster%40sandbox8a18d66bdd7448e3981a6f0e165287ab.mailgun.org:password123@smtp.mailgun.org:587";
})
