Spacejam.Vector3 = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

Spacejam.Vector3.prototype = {
  multiply: function(factor) {
    var vector = new Spacejam.Vector3(
      this.x * factor,
      this.y * factor,
      this.z * factor
    );
    return vector;
  }
};