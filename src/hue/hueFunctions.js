const hueApi = require('philips-hue-api');

var hue;

module.exports.init = function(hueProperties){
    hue = hueApi(`http://${hueProperties.url}/${hueProperties.user}/`);
};

module.exports.animeLigth = function(phase, data){
    var light = hue.lights(parseInt(phase));
    var state = {};

    state.on = true;
    //state.sat = 255;
    state.bri = 150;
    state.xy = determineHueColor(data.color);
    if (isHueBreathing(data.color)){
        state.alert = 'lselect';
    }
    light.state(JSON.stringify(state));
};

function determineHueColor(color) {
    return  color.indexOf('blue') > -1 ? rgbToXY(14, 0, 255) :
            color.indexOf('yellow') > -1 ? rgbToXY(255, 235, 59) :
            color.indexOf('red') > -1 ? rgbToXY(244, 67, 54) :
            rgbToXY(96, 125, 139);
};

function isHueBreathing(color) {
    return color.indexOf('_anime') > -1;
};

function rgbToXY(red, green, blue) {
    red = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
    green = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
    blue = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);

    var x = red * 0.664511 + green * 0.154324 + blue * 0.162028;
    var y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
    var z = red * 0.000088 + green * 0.072310 + blue * 0.986039;

    var fX = x / (x + y + z);
    var fY = y / (x + y + z);

    if (isNaN(fX)) {
        fX = 0.0;
    }
    if (isNaN(fY)) {
        fY = 0.0;
    }

   return [parseFloat(fX.toPrecision(4)), parseFloat(fY.toPrecision(4))];
}
