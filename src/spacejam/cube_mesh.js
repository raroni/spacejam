Spacejam.CubeMesh = function(size) {
  Spacejam.Mesh.call(this);

  var halfSize = size/2;
  this.vertices.push(new Spacejam.Vector3(-halfSize, halfSize, halfSize));
  this.vertices.push(new Spacejam.Vector3(halfSize, halfSize, halfSize));
  this.vertices.push(new Spacejam.Vector3(-halfSize, -halfSize, halfSize));
  this.vertices.push(new Spacejam.Vector3(halfSize, -halfSize, halfSize));
  this.vertices.push(new Spacejam.Vector3(-halfSize, halfSize, -halfSize));
  this.vertices.push(new Spacejam.Vector3(halfSize, halfSize, -halfSize));
  this.vertices.push(new Spacejam.Vector3(halfSize, -halfSize, -halfSize));
  this.vertices.push(new Spacejam.Vector3(-halfSize, -halfSize, -halfSize));

  this.faces.push(new Spacejam.Face(0, 1, 2));
  this.faces.push(new Spacejam.Face(3, 2, 1));
  this.faces.push(new Spacejam.Face(6, 3, 1));
  this.faces.push(new Spacejam.Face(1, 5, 6));
  this.faces.push(new Spacejam.Face(4, 1, 0));
  this.faces.push(new Spacejam.Face(1, 4, 5));
  this.faces.push(new Spacejam.Face(2, 3, 7));
  this.faces.push(new Spacejam.Face(3, 6, 7));
  this.faces.push(new Spacejam.Face(0, 2, 7));
  this.faces.push(new Spacejam.Face(7, 4, 0));
  this.faces.push(new Spacejam.Face(6, 5, 4));
  this.faces.push(new Spacejam.Face(7, 6, 4));
};

Spacejam.CubeMesh.prototype = Object.create(Spacejam.Mesh);
