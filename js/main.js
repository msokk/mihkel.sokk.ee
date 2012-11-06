if(!Detector.webgl) { Detector.addGetWebGLMessage(); }

var w = window.innerWidth
  , h = oldH = window.innerHeight
  , scene = new THREE.Scene()
  , clock = new THREE.Clock()
  , camera = new THREE.PerspectiveCamera(90, w / h, 1, 10000)
  , renderer = new THREE.WebGLRenderer({antialias: true});

var tilt = 0.41,
    radius = 45;

var tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) );


scene.add(camera);
camera.position.z = 100;
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);




var planetTexture = THREE.ImageUtils.loadTexture('img/texture/night8192.jpg')
  , cloudsTexture = THREE.ImageUtils.loadTexture('img/texture/earth_clouds_1024.png');


// Sphere
var planet = new THREE.Mesh(
  new THREE.SphereGeometry(radius, 100, 50),
  new THREE.MeshLambertMaterial({color: 0xFFFFFF, map: planetTexture})
);
planet.rotation.z = tilt;
scene.add(planet);

var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;
scene.add(pointLight);


var clouds = new THREE.Mesh(
  new THREE.SphereGeometry(radius, 100, 50),
  new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: cloudsTexture,
    transparent: true
  })
);
clouds.rotation.z = tilt;
clouds.scale.set(1.005, 1.005, 1.005);
scene.add(clouds);


animate();
function animate() {
  requestAnimationFrame(animate);

  var delta = clock.getDelta();

  planet.rotation.y += 0.1 * delta;
  clouds.rotation.y += 0.15 * delta;
  renderer.render(scene, camera);
}


window.addEventListener('resize', function() {
  w = innerWidth;
  h = innerHeight;

  camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( h / oldH ) );
  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
}, false);
