const jenkinsApi = require('jenkins-api');

var jenkins;
var jenkinsProperties;
var intervalIdDev, intervalIdValid, intervalIdProd;

module.exports.init = function(jenkinsProp){
    jenkinsProperties = jenkinsProp;
    jenkins = jenkinsApi.init(`http://${encodeURIComponent(jenkinsProperties.user)}:${encodeURIComponent(jenkinsProperties.password)}@${jenkinsProperties.url}/`);
};

module.exports.initJobs = function(jobs, callbackWhenNewInfo){
    if(intervalIdDev != null) clearInterval(intervalIdDev);
    if(intervalIdValid != null) clearInterval(intervalIdValid);
    if(intervalIdProd != null) clearInterval(intervalIdProd);

    intervalIdDev = setInterval(function() { listenBuild(jobs.job1, '1', callbackWhenNewInfo); }, jenkinsProperties.listenInterval);
    intervalIdValid = setInterval(function() { listenBuild(jobs.job2, '2', callbackWhenNewInfo); }, jenkinsProperties.listenInterval);
    intervalIdProd = setInterval(function() { listenBuild(jobs.job3, '3', callbackWhenNewInfo); }, jenkinsProperties.listenInterval);
};

function listenBuild(buildName, bulb, callbackWhenNewInfo) {
    jenkins.job_info(buildName, function(error, data) {
        console.log('--------------------------------');
        if (error){
            console.log('Error occured: ', error);
            //throw error;
        } else {
            console.log(`Build notification from ${buildName} job, to bulb #${bulb}.`);
            callbackWhenNewInfo(bulb, data);
        }
    });
};

function triggerBuild(buildName) {
    jenkins.build(buildName, function(error, data) {
        if (error){
            console.log('Error occured: ', error);
            throw error;
        }
        console.log(`${buildName} build triggered.`);
    });
};
