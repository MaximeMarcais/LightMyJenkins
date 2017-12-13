const properties = require('properties');
const express = require('express');
const bodyParser = require('body-parser');

const jenkinsFunctions = require('./jenkins/jenkinsFunctions.js');
const hueFunctions = require('./hue/hueFunctions.js');
//const controller = require('./controller/controller.js');

var app = express();
init();

function init() {
    console.log('Initialize application.');

    properties.parse("properties/jenkins.properties", {path: true}, function(error, jenkinsProperties) {
        if (error) throw error;
        console.log('Initialize Jenkins API.');

        jenkinsFunctions.init(jenkinsProperties);
        jenkinsFunctions.initJobs({
            job1: jenkinsProperties.job1,
            job2: jenkinsProperties.job2,
            job3: jenkinsProperties.job3
        }, onJenkinsNotification);
    });

    properties.parse("properties/hue.properties", {path: true}, function(error, hueProperties) {
        if (error) throw error;
        console.log('Initialize HUE API.');
        hueFunctions.init(hueProperties);
    });
};

function onJenkinsNotification(bulb, data){
    hueFunctions.animeLigth(bulb, data);
};

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

app.use(allowCrossDomain);
app.use( bodyParser.json() ); // to support JSON-encoded bodies

// POST method
app.post('/configure', function (req, res) {
    jenkinsFunctions.initJobs(req.body, onJenkinsNotification);
    res.send('POST request to /configure');
});

app.listen(3002, function () {
  console.log('Listening on port 3002 !');
});
