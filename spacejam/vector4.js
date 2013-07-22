Spacejam.Vector4 = function(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
};

Spacejam.Vector4.prototype = {
  toVector3: function() {
    var vector3 = new Spacejam.Vector3(
      this.x,
      this.y,
      this.z
    );
    return vector3;
  }
}

Spacejam.Vector4.coordinateNames = ['x', 'y', 'z', 'w'];
