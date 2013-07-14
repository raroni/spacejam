Spacejam.Renderer = function(options) {
  if(!options) throw new Error('Renderer needs options!');

  this.setupCanvas(options.width, options.height);
  this.context = this.canvas.getContext('2d');

  this.worldViewProjection = new Spacejam.MatrixStack();

  this.clearColor = options.clearColor;
};

Spacejam.Renderer.prototype = {
  render: function(scene, camera) {
    this.clear();
    this.draw(scene, camera);
    this.present();
  },
  draw: function(scene, camera) {
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
      this.drawLine(pointA, pointB);
      this.drawLine(pointB, pointC);
      this.drawLine(pointC, pointA);
      */
      this.drawTriangle(pointA, pointB, pointC, color);
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
    var windowSpaceVertex = new Spacejam.Vector2(
      Math.round(((ndcVertex.x+1)/2)*this.canvas.width),
      Math.round(this.canvas.height-((ndcVertex.y+1)/2)*this.canvas.height)
    );

    return windowSpaceVertex;
  },
  drawHorizontalLine: function(y, x1, x2, color) {
    // TODO: Can this IF be removed by instead using something a la
    // for x in Math.min(x1, x2)..Math.max(x1, x2)?
    if(x1 > x2) {
      var temp = x1;
      x1 = x2;
      x2 = temp;
    }

    for(var x=x1; x2>=x; x++) {
      this.drawPoint(new Spacejam.Vector2(x, y), color);
    }
  },
  drawBottomFlatTriangle: function(tip, base1, base2, color) {
    var inverseSlope1 = (base1.x-tip.x) / (base1.y-tip.y);
    var inverseSlope2 = (base2.x-tip.x) / (base2.y-tip.y);

    var x1 = tip.x;
    var x2 = tip.x;
    for(var y = tip.y; y <= base1.y; y++) {
      this.drawHorizontalLine(y, Math.round(x1), Math.round(x2), color);

      x1 += inverseSlope1;
      x2 += inverseSlope2;
    }
  },
  drawTopFlatTriangle: function(bottom, top1, top2, color) {
    var inverseSlope1 = (top1.x-bottom.x) / (top1.y-bottom.y);
    var inverseSlope2 = (top2.x-bottom.x) / (top2.y-bottom.y);

    var x1 = bottom.x;
    var x2 = bottom.x;
    for(var y = bottom.y; y >= top1.y; y--) {
      this.drawHorizontalLine(y, Math.round(x1), Math.round(x2), color);

      x1 -= inverseSlope1;
      x2 -= inverseSlope2;
    }
  },
  drawTriangle: function(pointA, pointB, pointC, color) {
    var temp;
    if(pointA.y > pointB.y) {
        temp = pointB;
        pointB = pointA;
        pointA = temp;
    }
    if(pointB.y > pointC.y) {
        temp = pointB;
        pointB = pointC;
        pointC = temp;
    }
    if(pointA.y > pointB.y) {
        temp = pointB;
        pointB = pointA;
        pointA = temp;
    }

    if(pointB.y == pointC.y) {
      this.drawBottomFlatTriangle(pointA, pointB, pointC, color);
    }
    else if(pointA.y == pointB.y) {
       this.drawTopFlatTriangle(pointC, pointA, pointB, color);
    } else {
      var ratio = (pointB.y-pointA.y) / (pointC.y - pointA.y);
      var pointD = new Spacejam.Vector2(
        Math.round(pointA.x + ratio*(pointC.x - pointA.x)),
        pointB.y
      );

      this.drawBottomFlatTriangle(pointA, pointB, pointD, color);
      this.drawTopFlatTriangle(pointC, pointB, pointD, color);
    }
  },
  drawLine: function(pointA, pointB) {
    var x1 = pointA.x >> 0;
    var y1 = pointA.y >> 0;
    var x2 = pointB.x >> 0;
    var y2 = pointB.y >> 0;
    var xChange = (x1 < x2) ? 1 : -1;
    var yChange = (y1 < y2) ? 1 : -1;
    var deltaX = Math.abs(x2-x1);
    var deltaY = Math.abs(y2-y1);

    var errorDiagonal = deltaX - deltaY;
    var doubleErrorHelper;

    var color = new Spacejam.Color(200, 200, 200);

    while(1) {
      
      this.drawPoint(new Spacejam.Vector2(x1, y1), color);
      if(x1 == x2 && y1 == y2) break;

      doubleErrorHelper = 2*errorDiagonal;
      if(doubleErrorHelper > -deltaY) {
        x1 += xChange;
        errorDiagonal -= deltaY;
      }
      if(doubleErrorHelper < deltaX) {
        y1 += yChange;
        errorDiagonal += deltaX;
      }
    }
  },
  drawVertice: function(vertex) {
    var point = this.project(vertex);
    this.drawPoint(point);
  },
  drawPoint: function(point, color) {
    // TODO: Ditch this useless method?
    this.setPixel(point.x, point.y, color);
  },
  clear: function() {
    this.context.fillStyle = this.clearColor.toRGBSTring();
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.buffer = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  },
  setPixel: function(x, y, color) {
    var index = ((x >> 0) + (y >> 0) * this.canvas.width) * 4;

    this.buffer.data[index] = color.red*255;
    this.buffer.data[index + 1] = color.green*255;
    this.buffer.data[index + 2] = color.blue*255;
    this.buffer.data[index + 3] = 255;
  },
  present: function() {
    this.context.putImageData(this.buffer, 0, 0);
  },
  setupCanvas: function(width, height) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    /*
    this.canvas.style.width = (width/devicePixelRatio) + 'px';
    this.canvas.style.height = (height/devicePixelRatio) + 'px';
    */
  }
}
