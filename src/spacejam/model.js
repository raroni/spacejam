Spacejam.Model = function(mesh) {
  if(!mesh) throw new Error('Model need mesh.');
  this.children = [];
  this.mesh = mesh;
  this.position = Spacejam.Vector3.zero();
  this.rotation = Spacejam.Vector3.zero();
};

Spacejam.Model.prototype = {
  getTransformation: function() {
    var translation = Spacejam.Matrix4.translation(this.position);
    var xRotation = Spacejam.Matrix4.xRotation(this.rotation.x);
    var yRotation = Spacejam.Matrix4.yRotation(this.rotation.y);
    var zRotation = Spacejam.Matrix4.zRotation(this.rotation.z);
    var transformation = translation.multiply(xRotation).multiply(yRotation).multiply(zRotation);
    return transformation;
  }
};
