Spacejam.Canvas = function(width, height) {
  this.element = document.createElement('canvas');
  this.element.width = width;
  this.element.height = height;
  this.context = this.element.getContext('2d');

  this.depthBuffer = new Array(this.element.width * this.element.height);

  this.clearColor = new Spacejam.Color(0, 0, 0);

  this.element.style.width = (width/devicePixelRatio) + 'px';
  this.element.style.height = (height/devicePixelRatio) + 'px';
};

Spacejam.Canvas.prototype = {
  clear: function() {
    this.context.fillStyle = this.clearColor.toRGBSTring();
    this.context.fillRect(0, 0, this.element.width, this.element.height);
    this.buffer = this.context.getImageData(0, 0, this.element.width, this.element.height);

    for(var i=0; this.depthBuffer.length>i; i++) {
      this.depthBuffer[i] = 1;
    }
  },
  commit: function() {
    this.context.putImageData(this.buffer, 0, 0);
  },
  setPixel: function(point, color) {
    var index = (point.x + point.y * this.element.width);

    if(this.depthBuffer[index] < point.z) return;
    this.depthBuffer[index] = point.z;

    var indexX4 = index*4;
    this.buffer.data[indexX4] = color.red*255;
    this.buffer.data[indexX4 + 1] = color.green*255;
    this.buffer.data[indexX4 + 2] = color.blue*255;
    this.buffer.data[indexX4 + 3] = 255;
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
      this.setPixel(new Spacejam.Vector3(x1, y1, 1), color);
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
  drawHorizontalLine: function(y, x1, x2, z1, z2, color) {
    if(x1 > x2) {
      var temp = x1;
      x1 = x2;
      x2 = temp;
      temp = z1;
      z1 = z2;
      z2 = temp;
    }

    var zGradient = (z2-z1) / (x2-x1);
    var z = z1;

    for(var x=x1; x2>=x; x++) {
      this.setPixel(new Spacejam.Vector3(x, y, z), color);
      z += zGradient;
    }
  },
  drawBottomFlatTriangle: function(tip, base1, base2, color) {
    var xGradient1 = (base1.x-tip.x) / (base1.y-tip.y);
    var xGradient2 = (base2.x-tip.x) / (base2.y-tip.y);
    var x1 = tip.x;
    var x2 = tip.x;

    var zGradient1 = (base1.z-tip.z) / (base1.y-tip.y);
    var zGradient2 = (base2.z-tip.z) / (base2.y-tip.y);
    var z1 = tip.z;
    var z2 = tip.z;

    for(var y = tip.y; y <= base1.y; y++) {
      this.drawHorizontalLine(y, Math.round(x1), Math.round(x2), z1, z2, color);

      x1 += xGradient1;
      x2 += xGradient2;
      z1 += zGradient1;
      z2 += zGradient2;
    }
  },
  drawTopFlatTriangle: function(bottom, top1, top2, color) {
    var xGradient1 = (top1.x-bottom.x) / (top1.y-bottom.y);
    var xGradient2 = (top2.x-bottom.x) / (top2.y-bottom.y);
    var x1 = bottom.x;
    var x2 = bottom.x;

    var zGradient1 = (top1.z-bottom.z) / (top1.y-bottom.y);
    var zGradient2 = (top2.z-bottom.z) / (top2.y-bottom.y);
    var z1 = bottom.z;
    var z2 = bottom.z;

    for(var y = bottom.y; y >= top1.y; y--) {
      this.drawHorizontalLine(y, Math.round(x1), Math.round(x2), z1, z2, color);

      x1 -= xGradient1;
      x2 -= xGradient2;
      z1 -= zGradient1;
      z2 -= zGradient2;
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
      var pointD = new Spacejam.Vector3(
        Math.round(pointA.x + ratio*(pointC.x - pointA.x)),
        pointB.y,
        pointA.z + ratio*(pointC.z - pointA.z)
      );

      this.drawBottomFlatTriangle(pointA, pointB, pointD, color);
      this.drawTopFlatTriangle(pointC, pointB, pointD, color);
    }
  }
};
