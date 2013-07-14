Spacejam.Camera = function(width, height, zNear, zFar) {
  this.projectionMatrix = Spacejam.Matrix4.perspective(height/width, zNear, zFar);
  this.position = new Spacejam.Vector3(0, 0, 0);
};

Spacejam.Camera.prototype = {
  getTransformation: function() {
    var transformation = this.projectionMatrix;
    var translation = Spacejam.Matrix4.translation(this.position.multiply(-1));
    transformation = transformation.multiply(translation);
    return transformation;
  }
}