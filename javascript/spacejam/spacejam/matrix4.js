Spacejam.Matrix4 = function() {
  var column, i;

  for(i=0; 4>i; i++) {
    this[i] = [];
  }

  for(var i=0; arguments.length>i; i++) {
    column = i % 4;
    this[column][Math.floor(i/4)] = arguments[i];
  }
};

Spacejam.Matrix4.prototype = {
  multiply: function(vectorOrMatrix) {
    if(vectorOrMatrix instanceof Spacejam.Vector4) {
      return this.multiplyVector4(vectorOrMatrix);
    }
    else if(vectorOrMatrix instanceof Spacejam.Matrix4) {
      return this.multiplyMatrix4(vectorOrMatrix);
    } else {
      throw new Error('Cannot multiply ' + vectorOrMatrix + '.');
    }
  },
  multiplyVector4: function(vector) {
    var components = [0, 0, 0, 0];
    for(var row=0; 4>row; row++) {
      for(var column=0; 4>column; column++) {
        components[row] += vector[Spacejam.Vector4.coordinateNames[column]] * this[column][row];
      }
    }
    var result = new Spacejam.Vector4(components[0], components[1], components[2], components[3]);
    return result;
  },
  multiplyMatrix4: function(other) {
    var components = [];
    for(i=0; 16>i; i++) components[i] = 0;
    for(var row=0; 4>row; row++) {
      for(var column=0; 4>column; column++) {
        for(var i=0; 4>i; i++) {
          components[row*4+column] += this[i][row] * other[column][i];
        }
      }
    }
    var factoryFunction = Spacejam.Matrix4.bind.apply(Spacejam.Matrix4, [null].concat(components));
    var matrix = new factoryFunction();
    return matrix;
  },
}

Spacejam.Matrix4.translation = function(xOrVector3, y, z) {
  if(xOrVector3 instanceof Spacejam.Vector3) {
    var vector = xOrVector3;
    return Spacejam.Matrix4.translation(vector.x, vector.y, vector.z);
  } else {
    var x = xOrVector3;
  }

  var translation = new Spacejam.Matrix4(
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1
  );

  return translation;
};

Spacejam.Matrix4.perspective = function(aspect, zFar, zNear) {
  var perspective = new Spacejam.Matrix4(
    aspect, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, (zFar+zNear)/(zNear-zFar), (2*zNear*zFar)/(zNear-zFar),
    0, 0, -1, 0
  );
  return perspective;
}

Spacejam.Matrix4.identity = function() {
  var identity = new Spacejam.Matrix4(
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  );
  return identity;
}

Spacejam.Matrix4.zRotation = function(angle) {
  var zRotation = new Spacejam.Matrix4(
    Math.cos(angle), Math.sin(angle), 0, 0,
    -Math.sin(angle), Math.cos(angle), 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  );
  return zRotation;
}

Spacejam.Matrix4.yRotation = function(angle) {
  var yRotation = new Spacejam.Matrix4(
    Math.cos(angle), 0, -Math.sin(angle), 0,
    0, 1, 0, 0,
    Math.sin(angle), 0, Math.cos(angle), 0,
    0, 0, 0, 1
  );
  return yRotation;
}
