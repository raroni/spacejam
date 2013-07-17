Spacejam.Renderer = function(options) {
  if(!options) throw new Error('Renderer needs options!');
  this.canvas = new Spacejam.Canvas(options.width, options.height);
  this.canvas.clearColor = options.clearColor;
  this.worldTransformation = new Spacejam.MatrixStack();
  this.clearColor = options.clearColor;
  this.scene = options.scene;
  this.camera = options.camera;
};

Spacejam.Renderer.prototype = {
  render: function() {
    this.canvas.clear();
    this.draw();
    this.canvas.commit();
  },
  draw: function() {
    this.scene.models.forEach(this.drawModel.bind(this));
  },
  drawModel: function(model) {
    this.worldTransformation.push(model.getTransformation());

    var mesh = model.mesh;
    var face;
    var homoCoordinatesA, homoCoordinatesB, homoCoordinatesC;
    var worldCoordinatesA, worldCoordinatesB, worldCoordinatesC;
    var projectedCoordinatesA, projectedCoordinatesB, projectedCoordinatesC;
    var vertices = mesh.vertices;

    for(var i=0; mesh.faces.length>i; i++) {
      face = mesh.faces[i];

      homoCoordinatesA = new Spacejam.Vector4(mesh.vertices[face.a].x, mesh.vertices[face.a].y, mesh.vertices[face.a].z, 1);
      homoCoordinatesB = new Spacejam.Vector4(mesh.vertices[face.b].x, mesh.vertices[face.b].y, mesh.vertices[face.b].z, 1);
      homoCoordinatesC = new Spacejam.Vector4(mesh.vertices[face.c].x, mesh.vertices[face.c].y, mesh.vertices[face.c].z, 1);

      worldCoordinatesA = this.worldTransformation.getCurrent().multiply(homoCoordinatesA);
      worldCoordinatesB = this.worldTransformation.getCurrent().multiply(homoCoordinatesB);
      worldCoordinatesC = this.worldTransformation.getCurrent().multiply(homoCoordinatesC);

      color = this.getColor(
        model,
        worldCoordinatesA.toVector3(),
        worldCoordinatesB.toVector3(),
        worldCoordinatesC.toVector3()
      );

      projectedCoordinatesA = this.project(worldCoordinatesA);
      projectedCoordinatesB = this.project(worldCoordinatesB);
      projectedCoordinatesC = this.project(worldCoordinatesC);

      /*
      this.canvas.drawLine(pointA, pointB);
      this.canvas.drawLine(pointB, pointC);
      this.canvas.drawLine(pointC, pointA);
      */
      this.canvas.drawTriangle(
        projectedCoordinatesA,
        projectedCoordinatesB,
        projectedCoordinatesC,
        color
      );
    }
    this.worldTransformation.pop();
  },
  getColor: function(model, worldCoordinatesA, worldCoordinatesB, worldCoordinatesC) {
    var planeVector1 = worldCoordinatesA.subtract(worldCoordinatesB);
    var planeVector2 = worldCoordinatesA.subtract(worldCoordinatesC);
    var normal = planeVector2.cross(planeVector1);
    normal.normalize();
    var center = worldCoordinatesA.add(worldCoordinatesB).add(worldCoordinatesC).divide(3);
    var lightDirection = this.scene.light.position.subtract(center);
    lightDirection.normalize();
    var dotProduct = normal.dot(lightDirection);
    var lightIntensity = Math.max(0, dotProduct);

    var color = new Spacejam.Color(0, 0.5+0.5*lightIntensity, 0);
    return color;
  },
  project: function(worldCoordinates) {
    var eyeCoordinates = this.camera.getWorldView().multiply(worldCoordinates);
    var clipSpaceVertex = this.camera.projection.multiply(eyeCoordinates);

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
