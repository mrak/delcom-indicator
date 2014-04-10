var hid = require('node-hid');

function DelcomIndicator(){
  this.green = 0xFE;
  this.red = 0xFD;
  this.blue = 0xFB;
  this.purple = 0xF9;
  this.off = 0xFF;

  this.solid = 2;
  this.write = 101;
  this.flash = 20;

  this.open();
};

DelcomIndicator.prototype.findDevice = function(){
  var vendorId = 0xFC5;
  var productId = 0xB080;
  var devices = hid.devices(vendorId, productId);

  if (devices !== undefined){
    return devices[0];
  }
}

DelcomIndicator.prototype.open = function() {
  this.device = this.findDevice();
  if (this.device){
    this.deviceConnection = new hid.HID(this.device.path);
  }
  return this;
};

DelcomIndicator.prototype.isConnected = function(){
  return this.device !== undefined;
};

DelcomIndicator.prototype.isOpen = function() {
  return this.deviceConnection;
};

DelcomIndicator.prototype.close = function(){
  if (this.deviceConnection){
    this.deviceConnection.close();
    this.deviceConnection = undefined;
  }
};

DelcomIndicator.prototype.solidColor = function(color) {
  if (!this.isOpen()) { throw "Device is not open"; }

  this.deviceConnection.write([this.write, this.solid, color]);
};

DelcomIndicator.prototype.solidGreen = function(){
  this.solidColor(this.green);
};

DelcomIndicator.prototype.solidRed = function(){
  this.solidColor(this.red);
};

DelcomIndicator.prototype.solidBlue = function(){
  this.solidColor(this.blue);
};

DelcomIndicator.prototype.solidPurple = function(){
  this.solidColor(this.purple);
};

DelcomIndicator.prototype.flashColor = function(color, bit){
  if (!this.isOpen()){ throw "Device is not open"; }

  this.deviceConnection.write([this.write, this.solid, color]);
  this.deviceConnection.write([this.write, this.flash, 0, bit]);
};
DelcomIndicator.prototype.flashGreen = function(){
  this.flashColor(this.green, 1)
};

DelcomIndicator.prototype.flashRed = function(){
  this.flashColor(this.red, 2)
};

DelcomIndicator.prototype.flashBlue = function(){
  this.flashColor(this.blue, 4)
};

DelcomIndicator.prototype.flashPurple = function(){
  this.flashColor(this.purple, 6)
};

DelcomIndicator.prototype.turnOff = function(){
  if (!this.isOpen()){ throw "Device is not open"; }

  this.deviceConnection.write([this.write, this.solid, this.off]);
  this.deviceConnection.write([this.write, this.flash, this.off]);
};

module.exports = DelcomIndicator;
