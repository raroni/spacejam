Spacejam.Renderer = function(options) {
  if(!options) throw new Error('Renderer needs options!');
  this.canvas = new Spacejam.Canvas(options.width, options.height);
  this.canvas.clearColor = options.clearColor;
  this.worldViewProjection = new Spacejam.MatrixStack();
  this.clearColor = options.clearColor;
};

Spacejam.Renderer.prototype = {
  render: function(scene, camera) {
    this.canvas.clear();
    this.draw(scene, camera);
    this.canvas.commit();
  },
  draw: function(scene, camera) {
    this.camera = camera; // del me at some point! only added for debugging!
    this.worldViewProjection.push(camera.getTransformation());
    scene.models.forEach(this.drawModel.bind(this));
    this.worldViewProjection.pop();
  },
  drawModel: function(model) {
    this.worldViewProjection.push(model.worldViewMatrix);

    var mesh = model.mesh;
    var vertexA, vertexB, vertexC, face, pointA, pointB, pointC;
    var vertices = mesh.vertices;
    var color, colorBase;



    for(var i=0; mesh.faces.length>i; i++) {
      face = mesh.faces[i];
      colorBase = 0.25+0.5*i/mesh.faces.length;
      color = new Spacejam.Color(colorBase, colorBase, colorBase);

      pointA = this.project(vertices[face.a]);
      pointB = this.project(vertices[face.b]);
      pointC = this.project(vertices[face.c]);

      /*
      this.canvas.drawLine(pointA, pointB);
      this.canvas.drawLine(pointB, pointC);
      this.canvas.drawLine(pointC, pointA);
      */
      this.canvas.drawTriangle(pointA, pointB, pointC, color);
    }
    this.worldViewProjection.pop();
  },
  project: function(vertex) {
    var homoVertex = new Spacejam.Vector4(vertex.x, vertex.y, vertex.z, 1);
    var clipSpaceVertex = this.worldViewProjection.getCurrent().multiply(homoVertex);

    var ndcVertex = new Spacejam.Vector3(
      clipSpaceVertex.x/clipSpaceVertex.w,
      clipSpaceVertex.y/clipSpaceVertex.w,
      clipSpaceVertex.z/clipSpaceVertex.w
    );

    // conversion should be made with matrix?
    var windowSpaceVertex = new Spacejam.Vector3(
      Math.round(((ndcVertex.x+1)/2)*this.canvas.element.width),
      Math.round(this.canvas.element.height-((ndcVertex.y+1)/2)*this.canvas.element.height),
      (ndcVertex.z+1)/2
    );

    return windowSpaceVertex;
  }
};
