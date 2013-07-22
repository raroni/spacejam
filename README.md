Spacejam
========

Spacejam is a very simple softwared based 3d rendering engine I made to improve my understanding of the OpenGL rendering pipeline. Basically, it renders 3d objects on a HTML canvas-element by calculating every single pixel's color. It makes heavy use of matrix transformations. It supports very basic lighting.

Here's an example of what you can do:

    var scene = new Spacejam.Scene();
    scene.light = new Spacejam.Light(new Spacejam.Vector3(20, 20, 10));

    // the last arguments are near and far z clipping values
    var camera = new Spacejam.Camera(this.width, this.height, -1, -11);

    // moving the camera a bit back
    camera.position.z = 4;

    var mesh = new Spacejam.CubeMesh(2);
    var cube1 = new Spacejam.Model(mesh);
    var cube2 = new Spacejam.Model(mesh);
    cube1.position.x = 2.4;
    cube2.rotation.x = -2.4;

    scene.models.push(cube1, cube2);

    var options = {
      width: this.width,
      height: this.height,
      clearColor: clearColor,
      scene: scene,
      camera: camera
    };

    this.renderer = new Spacejam.Renderer(options);
    this.renderer.render();

    document.body.appendChild(this.renderer.canvas.element);

See the [`example` dir](https://github.com/rasmusrn/spacejam/tree/master/example) for a complete example.
