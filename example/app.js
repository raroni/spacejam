function App() {
  this.scene = new Spacejam.Scene();
  this.setupRenderer();

  this.canvas = this.renderer.canvas.element;

  this.camera = new Spacejam.Camera(this.canvas.width, this.canvas.height, -1, -11);
  this.camera.position.z = 4;
}

App.prototype = {
  start: function() {
    var mesh = new Spacejam.CubeMesh(2);
    this.cube1 = new Spacejam.Model(mesh);
    var cube2 = new Spacejam.Model(mesh);
    cube2.position.x = -2.4;
    cube2.rotation.x = -2.4;

    this.scene.models.push(this.cube1, cube2);
    this.scheduleNextTick();
  },
  setupRenderer: function() {
    var clearColor = new Spacejam.Color(0.4, 0, 0);

    var options = {
      width: 800,
      height: 600,
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
    this.cube1.position.x = Math.sin(this.x*0.002)*0.4+1.5;
    this.cube1.rotation.y = this.x*0.0005+1;
    this.cube1.rotation.z = this.x*0.001;

    this.renderer.render(this.scene, this.camera);
  }
};
