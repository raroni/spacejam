Spacejam.Model = function(mesh) {
  if(!mesh) throw new Error('Model need mesh.');
  this.children = [];
  this.mesh = mesh;
  this.worldViewMatrix = Spacejam.Matrix4.identity();
};
