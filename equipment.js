var Equipment = function (dh, options) {
    this.dh = dh;
    this.mac = options.mac;
    this.uuid = options.uuid;
    this.interval = options.interval;
    this.valueChangeInterval = options.valueChangeInterval;
    this.maxPositiveValue = options.maxPositiveValue;
    this.maxNegativeValue = options.maxNegativeValue;
    this.positive = true;
};

var generateValue = function(positive, maxPositiveValue, maxNegativeValue){
    var min = positive ? 0 : maxPositiveValue;
    var max = positive ? maxPositiveValue : maxNegativeValue;
    return Math.random() * (max - min) + min;
};

Equipment.prototype._startChangingValueType = function () {
    var self = this;
    self._valueInterval = setTimeout(function () {
        positive = !positive;
    }, self.valueChangeInterval);
};

Equipment.prototype.getDhDescription = function () {
    // return {
    //     name: this.name + ' Sensor',
    //     type: 'SensorTag',
    //     code: this.code
    // };
    return null;
};

Equipment.prototype.start = function (handler) {
    var self = this;

    self._valueInterval = setInterval(function () {
        self.positive = !self.positive;
    }, self.valueChangeInterval);

    self._intervalHandler = setInterval(function () {
        var parameters = {
            mac: self.mac,
            uuid: self.uuid,
            value: generateValue(self.positive, self.maxPositiveValue, self.maxNegativeValue),
        };

        self.dh.sendNotification("NotificationReceived", parameters, function (err, res) {
            return handler(err, parameters, self);
        });
    }, self.interval);
};

Equipment.prototype.stop = function () {
    this._valueInterval && clearInterval(this._valueInterval);
    return this._intervalHandler && clearInterval(this._intervalHandler);
};

module.exports = Equipment;
