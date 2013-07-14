function App() {
  this.scene = new Spacejam.Scene();
  this.setupRenderer();

  this.canvas = this.renderer.canvas;

  this.camera = new Spacejam.Camera(this.canvas.width, this.canvas.height, 0.5, 100);
  this.camera.position.z = 3;
}

App.prototype = {
  start: function() {
    var cube = new Spacejam.Cube(2);

    this.model = new Spacejam.Model(cube);
    this.scene.models.push(this.model);

    this.scheduleNextTick();
  },
  setupRenderer: function() {
    var clearColor = new Spacejam.Color(0.4, 0, 0);

    var options = {
      width: 400,
      height: 300,
      clearColor: clearColor
    };

    this.renderer = new Spacejam.Renderer(options);
  },
  scheduleNextTick: function() {
    requestAnimationFrame(this.tick.bind(this));
  },
  tick: function(timestamp) {
    var deltaTime;
    if(!this.lastTickAt) deltaTime = 0;
    else deltaTime = timestamp-this.lastTickAt;
    this.lastTickAt = timestamp;

    this.update(deltaTime);
    this.scheduleNextTick();
  },
  update: function(timeDelta) {
    if(!this.x) this.x = 0;
    this.x += timeDelta;
    var rotation = Spacejam.Matrix4.yRotation(this.x*0.001+2.2)//;.multiply(Spacejam.Matrix4.zRotation(this.x*0.001))
    this.model.worldViewMatrix = Spacejam.Matrix4.translation(Math.sin(this.x*0.001), 0, 0).multiply(rotation);

    this.renderer.render(this.scene, this.camera);
  }
};
