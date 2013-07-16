(function() {
  function initialize() {
    var app = new App();
    document.body.appendChild(app.canvas);
    app.start();
  }
  window.addEventListener('load', initialize);
})();
