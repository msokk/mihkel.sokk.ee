/**
 * Deep, deep in WIP!
 */
if(!Detector.webgl) Detector.addGetWebGLMessage();

var w = window.innerWidth
  , h = oldH = window.innerHeight
  , scene = new THREE.Scene()
  , clock = new THREE.Clock()
  , camera = new THREE.PerspectiveCamera(90, w / h, 1, 10000)
  , renderer = new THREE.WebGLRenderer({antialias: true});

var tilt = 0.41,
    radius = 45,
    stopped = false;

var tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) );


scene.add(camera);
THREE.Object3D._threexDomEvent.camera(camera);

camera.position.z = 100;
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);




var planetTexture = THREE.ImageUtils.loadTexture('img/texture/earth_night_2048.jpg')
  , cloudsTexture = THREE.ImageUtils.loadTexture('img/texture/earth_clouds_1024.png');


// Sphere
var planet = new THREE.Mesh(
  new THREE.SphereGeometry(radius, 100, 50),
  new THREE.MeshLambertMaterial({color: 0xFFFFFF, map: planetTexture})
);
planet.rotation.z = tilt;
scene.add(planet);

planet.on('mouseover', function() {
  if(window.zoomOutTween) window.zoomOutTween.stop();
  stopped = true;
  clock.stop();

  var tween = window.zoomInTween = new TWEEN.Tween({
    px: planet.rotation.x,
    py: planet.rotation.y,
    pz: planet.rotation.z,
    cx: clouds.rotation.x,
    cy: clouds.rotation.y,
    cz: clouds.rotation.z,
    co: cloudMaterial.opacity
  }).to({
    px: 1.035,
    py: (planet.rotation.y - (planet.rotation.y % 6.28)) + 4.28,
    pz: 0,
    cx: 1.035,
    cy: (planet.rotation.y - (planet.rotation.y % 6.28)) + 4.28,
    cz: 0,
    co: .3
  }, 2500)
  .easing(TWEEN.Easing.Cubic.Out)
  .onUpdate(function() {
    planet.rotation.x = this.px;
    planet.rotation.y = this.py;
    planet.rotation.z = this.pz;
    clouds.rotation.x = this.cx;
    clouds.rotation.y = this.cy;
    clouds.rotation.z = this.cz;
    cloudMaterial.opacity = this.co;

  }).start();

  document.getElementById('about').className = 'active';
});

planet.on('mouseout', function() {
  zoomInTween.stop();
  stopped = false;
  clock.start();

  var tween = window.zoomOutTween = new TWEEN.Tween({
    px: planet.rotation.x,
    pz: planet.rotation.z,
    cx: clouds.rotation.x,
    cz: clouds.rotation.z,
    co: cloudMaterial.opacity
  }).to({
    px: 0.7,
    pz: .21,
    cx: 0.7,
    cz: .21,
    co: .8
  }, 1000)
  .easing(TWEEN.Easing.Cubic.Out)
  .onUpdate(function() {
    planet.rotation.x = this.px;
    planet.rotation.z = this.pz;
    clouds.rotation.x = this.cx;
    clouds.rotation.z = this.cz;
    cloudMaterial.opacity = this.co;

  }).onComplete(function() {
    document.getElementById('about').className = '';

  }).start();

});

var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;
scene.add(pointLight);


var cloudMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  map: cloudsTexture,
  transparent: true
});

var clouds = new THREE.Mesh(
  new THREE.SphereGeometry(radius, 100, 50),
  cloudMaterial
);
clouds.rotation.z = tilt;
clouds.scale.set(1.005, 1.005, 1.005);
scene.add(clouds);

// SETUP END

animate();
function animate() {
  requestAnimationFrame(animate);

  if(!stopped) {

    var delta = clock.getDelta();


    planet.rotation.y += .1 * delta;
    clouds.rotation.y += .15 * delta;
  }
  renderer.render(scene, camera);
  TWEEN.update();
}


window.addEventListener('resize', function() {
  w = innerWidth;
  h = innerHeight;

  camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( h / oldH ) );
  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
}, false);
