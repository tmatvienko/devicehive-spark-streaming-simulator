global.XMLHttpRequest = require('xhr2');
global.WebSocket = require('ws');
var DeviceHive = require('./lib/devicehive.device.js');
var Equipment = require('./equipment.js');

var SimulatorDevice = function (options) {
    this.dh = new DeviceHive(options.serviceUrl, options.deviceId, options.accessKey);
    this.equipments = [];
    for (var i = 0; i < options.equipments.length; i++) {
        var equipment = new Equipment(this.dh, options.equipments[i]);
        this.equipments.push(equipment);
    }
    this.options = options;
};

SimulatorDevice.prototype._buildEquipments = function () {
    var res = [];

    for (var i = 0; i < this.equipments.length; i++) {
        var eq = this.equipments[i].getDhDescription();
        if (eq){
            res.push();
        }
    }

    return res;
};

SimulatorDevice.prototype.registerDevice = function (cb, handler) {
    var self = this;

    self.dh.registerDevice({
        name: self.options.name,
        key: self.options.deviceKey,
        network: {
            name: self.options.network
        },
        status: "Online",
        deviceClass: {
            name: self.options.deviceClass,
            version: self.options.deviceClassVersion,
            equipment: self._buildEquipments()
        }
    }, function (err, res) {
        if (err) {
            return console.log('Error occurred: ' + (err.error || JSON.stringify(err)));
        }
        console.log('Device with id ' + self.options.deviceId + ' created successfully');
    });
};

SimulatorDevice.prototype.start = function (cb, handler) {
    var self = this;

    self.dh.registerDevice({
        name: self.options.name,
        key: self.options.deviceKey,
        network: {
            name: self.options.network
        },
        status: "Online",
        deviceClass: {
            name: self.options.deviceClass,
            version: self.options.deviceClassVersion,
            equipment: self._buildEquipments()
        }
    }, function (err, res) {
        if (err) {
            return cb(err);
        }

        self.dh.openChannel(function (err, res) {
            if (err) {
                return cb(err);
            }

            for (var i = 0; i < self.equipments.length; i++) {
                self.equipments[i].start(handler);
            }

            return cb();
        }, "websocket");
    });
};

SimulatorDevice.prototype.stop = function () {
    for (var i = 0; i < this.equipments.length; i++) {
        this.equipments[i].stop();
    }
};

module.exports = SimulatorDevice;
