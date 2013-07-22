Spacejam.Vector3 = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

Spacejam.Vector3.prototype = {
  add: function(vector) {
    var x = this.x + vector.x;
    var y = this.y + vector.y;
    var z = this.z + vector.z;
    var result = new Spacejam.Vector3(x, y, z);
    return result;
  },
  subtract: function(vector) {
    var x = this.x - vector.x;
    var y = this.y - vector.y;
    var z = this.z - vector.z;
    var result = new Spacejam.Vector3(x, y, z);
    return result;
  },
  normalize: function() {
    var vector = this.divide(this.getLength());
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
  },
  multiply: function(factor) {
    var vector = new Spacejam.Vector3(
      this.x * factor,
      this.y * factor,
      this.z * factor
    );
    return vector;
  },
  divide: function(factor) {
    var vector = new Spacejam.Vector3(
      this.x / factor,
      this.y / factor,
      this.z / factor
    );
    return vector;
  },
  cross: function(vector) {
    var x = this.y*vector.z - this.z * vector.y;
    var y = this.z*vector.x - this.x * vector.z;
    var z = this.x*vector.y - this.y * vector.x;

    var result = new Spacejam.Vector3(x, y, z);
    return result;
  },
  dot: function(vector) {
    var result = this.x * vector.x + this.y * vector.y + this.z * vector.z;
    return result;
  },
  getLength: function() {
    var squareSum = Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
    return Math.sqrt(squareSum);
  }
};

Spacejam.Vector3.zero = function() {
  var vector = new Spacejam.Vector3(0, 0, 0);
  return vector;
};
