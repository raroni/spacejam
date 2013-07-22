Spacejam.MatrixStack = function() {
  this.list = [Spacejam.Matrix4.identity()];
};

Spacejam.MatrixStack.prototype = {
  push: function(matrix) {
    var matrix = this.getCurrent().multiply(matrix);
    this.list.push(matrix);
  },
  pop: function() {
    this.list.pop();
  },
  getCurrent: function() {
    return this.list[this.list.length-1];
  }
};
