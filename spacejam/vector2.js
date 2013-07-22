Spacejam.Vector2 = function(x, y) {
  this.x = x;
  this.y = y;
};

Spacejam.Vector2.prototype = {
  add: function(vector) {
    var vector = new Spacejam.Vector2(
      this.x + vector.x,
      this.y + vector.y
    );
    return vector;
  },
  clone: function() {
    var vector = new Spacejam.Vector2(this.x, this.y);
    return vector;
  },
  subtract: function(vector) {
    var vector = new Spacejam.Vector2(
      this.x - vector.x,
      this.y - vector.y
    );
    return vector;
  },
  multiply: function(scalar) {
    var vector = new Spacejam.Vector2(
      this.x*scalar,
      this.y*scalar
    );
    return vector;
  },
  getLength: function() {
    var squareSum = Math.pow(this.x, 2) + Math.pow(this.y, 2);
    return Math.sqrt(squareSum);
  }
};
