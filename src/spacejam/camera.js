Spacejam.Camera = function(width, height, zNear, zFar) {
  this.projection = Spacejam.Matrix4.perspective(height/width, zNear, zFar);
  this.position = new Spacejam.Vector3(0, 0, 0);
};

Spacejam.Camera.prototype = {
  getWorldView: function() {
    var translation = Spacejam.Matrix4.translation(this.position.multiply(-1));
    return translation;
  }
};
