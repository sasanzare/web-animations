 // Initialize Paper.js
 paper.setup(document.getElementById('canvas'));

 // Global variables
 var path1, path2, path3;
 var h2 = 0;
 var up = false;
 var wave_height;

 var p1 = {
   segments: 18,
   speed: 2,
   shape: 1.9,
   height: 100,
 };

 var p2 = {
   speed: 0.8,
   shape: 1.5,
   height: 40,
 };

 var p3 = {
   speed: 1.5,
   shape: 1.8,
   height: 0,
 };

 // Function to create segments
 function createSegments() {
   wave_height = paper.view.size.height / 2 + 30;

   if (path1) path1.remove();
   if (path2) path2.remove();
   if (path3) path3.remove();

   // Create path1
   path1 = new paper.Path({
     fillColor: '#093da8',
     strokeColor: 'rgba(76,154,240,1)',
     strokeWidth: 2,
     shadowColor: new paper.Color(0, 0, 0),
     shadowBlur: 12,
     shadowOffset: new paper.Point(5, 5),
     closed: true,
   });

   for (var i = 0; i <= p1.segments + 1; i++) {
     path1.add(new paper.Point(paper.view.size.width / p1.segments * i, wave_height));
   }

   path1.add(new paper.Point(paper.view.size.width + 5, paper.view.size.height + 5));
   path1.add(new paper.Point(-5, paper.view.size.height + 5));

   // Create path2
   path2 = path1.clone();
   path2.fillColor = {
     gradient: {
       stops: [['#05acec', 0.5], ['#0072ff', 1]]
     },
     origin: paper.view.bounds.topLeft,
     destination: paper.view.bounds.bottomLeft
   };
   path2.sendToBack();

   // Create path3
   path3 = path1.clone();
   path3.fillColor = "rgba(13,92,180,1)";
   path3.sendToBack();
 }

 // Handle window resize
 paper.view.onResize = function(event) {
   createSegments();
 };

 // Handle animation frame
 paper.view.onFrame = function(event) {
   for (var i = 0; i <= path1.segments.length - 3; i++) {
     var segment1 = path1.segments[i];
     var segment2 = path2.segments[i];
     var segment3 = path3.segments[i];

     var sinus1 = Math.sin(event.time * p1.speed + i / p1.shape);
     var sinus2 = Math.sin(event.time * p2.speed + i / p2.shape);
     var sinus3 = Math.sin(event.time * p3.speed + i / p3.shape);

     segment1.point.y = sinus1 * 40 + wave_height + p1.height;
     segment2.point.y = sinus2 * 30 + h2 + wave_height + p2.height;
     segment3.point.y = sinus3 * 20 + wave_height + p3.height;

     if (i > 0 && i < path1.segments.length - 3) {
       segment1.smooth();
       segment2.smooth();
       segment3.smooth();
     }
   }

   if (up === true) h2 -= 0.3;
   else h2 += 0.3;
   if (h2 > 30) up = true;
   if (h2 < -40) up = false;
 };

 // Initialize dat.GUI
 var gui = new dat.GUI({ autoPlace: false });
 gui.domElement.id = 'gui';
 document.getElementById("gui_container").appendChild(gui.domElement);

 var f0 = gui.addFolder(' ');
 f0.open();
 f0.add(p1, 'segments', 1, 80, 1).onFinishChange(function (value) {
   createSegments();
 });

 var f1 = gui.addFolder('Path 1');
 f1.open();
 f1.add(p1, 'speed', 0, 4);
 f1.add(p1, 'shape', 0.1, 3);
 f1.add(p1, 'height', -30, 200);

 var f2 = gui.addFolder('Path 2');
 f2.open();
 f2.add(p2, 'speed', 0, 4);
 f2.add(p2, 'shape', 0.1, 3);
 f2.add(p2, 'height', -30, 200);

 var f3 = gui.addFolder('Path 3');
 f3.open();
 f3.add(p3, 'speed', 0, 4);
 f3.add(p3, 'shape', 0.1, 3);
 f3.add(p3, 'height', -100, 100);

 // Initial setup
 createSegments();