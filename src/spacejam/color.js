Spacejam.Color = function(red, green, blue) {
  this.red = red;
  this.green = green;
  this.blue = blue;
};

Spacejam.Color.prototype = {
  toRGBSTring: function() {
    return "rgb(" + Math.round(this.red*255) + ", " + Math.round(this.green*255) + ", " + Math.round(this.blue*255) + ")";
  }
}
