var config = require('nconf').argv().env().file({
    file: './config.json'
});
var SimulatorDevice = require('./device');

var options = config.get();
var device = new SimulatorDevice(options);
//for (var i = 0; i<41; i++) {
//    var testOptions = JSON.parse(JSON.stringify(options));
//    testOptions.deviceId = options.deviceId + i;
//    testOptions.name = options.name + i;
//    new SimulatorDevice(testOptions).registerDevice(function (err, res) {
//        if (err) {
//            return console.log('Error occurred: ' + (err.error || JSON.stringify(err)));
//        }
//
//        console.log('Device with id ' + options.deviceId + ' created successfully');
//
//    }, function (err, sentParameter, equipment) {
//        console.log(err ? 'Error occurred: ' + err.error : 'Sent ' + JSON.stringify(sentParameter) + ' notification for device');
//    });
//}
device.start(function (err, res) {
    if (err) {
        return console.log('Error occurred: ' + (err.error || JSON.stringify(err)));
    }

    console.log('Device with id ' + options.deviceId + ' Started successfully');

}, function (err, sentParameter, equipment) {
    console.log(err ? 'Error ocurred: ' + err.error : 'Sent ' + JSON.stringify(sentParameter) + ' notification for device');
});
