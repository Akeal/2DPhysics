var screen = document.getElementById("screen");
var width = 0, height = 0;
resizeCanvas();
var context = screen.getContext("2d");
var objects = [];

//POINTS MUST BE MADE IN CLOCKWISE ORDER
var playerA = new Point(300, 0);
var playerB = new Point(340, 0);
var playerC = new Point(340, 40);
var playerD = new Point(300, 40);
var player = new SquareObject(playerA, playerB, playerC, playerD, 8, 0, 0, 0, 0, -0.9, 1, 0.3, false, "solid");

var stacked1A = new Point(150, 0);
var stacked1B = new Point(200, 0);
var stacked1C = new Point(200, 50);
var stacked1D = new Point(150, 50);

var stacked2A = new Point(150, 50);
var stacked2B = new Point(200, 50);
var stacked2C = new Point(200, 100);
var stacked2D = new Point(150, 100);

var stacked3A = new Point(150, 100);
var stacked3B = new Point(200, 100);
var stacked3C = new Point(200, 150);
var stacked3D = new Point(150, 150);

var stacked2 = new SquareObject(stacked2A, stacked2B, stacked2C, stacked2D, 2, 0, 0, 0, 0, -0.7, 1, 0.3, false, "solid");
var stacked1 = new SquareObject(stacked1A, stacked1B, stacked1C, stacked1D, 2, 0, 0, 0, 0, -0.7, 1, 0.3, false, "solid");
var stacked3 = new SquareObject(stacked3A, stacked3B, stacked3C, stacked3D, 2, 0, 0, 0, 0, -0.7, 1, 0.3, false, "solid");

var point1A = new Point(250, 50);
var point1B = new Point(400, 50);
var point1C = new Point(400, 200);
var point1D = new Point(250, 200);

var point2A = new Point(705, 25);
var point2B = new Point(785, 25);
var point2C = new Point(785, 150);
var point2D = new Point(705, 150);

var point3A = new Point(450, 100);
var point3B = new Point(950, 100);
var point3C = new Point(950, point3A.y + 100);
var point3D = new Point(450, point3B.y + 100);

var object1 = new SquareObject(point1A, point1B, point1C, point1D,  20, 0, 0, 0, 0, -0.9, 1, 0.3, false, "solid");
var object2 = new SquareObject(point2A, point2B, point2C, point2D, 2, 0, 0, 0, 0, -0.7, 1, 0.5, false, "solid");
var object3 = new SquareObject(point3A, point3B, point3C, point3D, 2, 0, 0, 0, 0, -0.7, 1, 0.5, false, "solid");

var groundA = new Point(50, 250);
var groundB = new Point(500, 250);
var groundC = new Point(500, 500);
var groundD = new Point(50, 500);

var waterA = new Point(500, 350);
var waterB = new Point(1500, 350);
var waterC = new Point(1500, 5000);
var waterD = new Point(500, 5000);

var ground = new SquareObject(groundA, groundB, groundC, groundD, 9999999, 0, 0, 0, 0, -0.1, 1, 0.3, true, "solid");
var water = new SquareObject(waterA, waterB, waterC, waterD, 99999999, 0, 0, 0, 0, -0.1, 1, 0.3, true, "liquid");

objects.push(player);
objects.push(object1);
objects.push(object2);
objects.push(object3);
objects.push(stacked1);
objects.push(stacked2);
objects.push(stacked3);

objects.push(ground);
objects.push(water);
function loop(timestamp) {
    var progress = ((timestamp - lastRender));
    update(progress);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
function draw() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = ground.color;
    context.fillStyle = "blue";
    for (i = 0; i < objects.length; i++) {
        context.fillStyle = "blue";
        if (i == objects.length - 2) { context.fillStyle = "rgba(0, 100, 0, 1)" }
        if (i == objects.length - 1) { context.fillStyle = "rgba(0, 153, 255, 0.6)" }
        if (i == 0) { context.fillStyle = "rgba(153, 76, 255, 1)" }

        //Rotate image
        context.save();
            context.translate(objects[i].centerX(), objects[i].centerY());
            context.rotate(objects[i].angle);
            context.translate(-objects[i].x, -objects[i].y);
            context.fillRect(-objects[i].width / 2, -objects[i].height / 2, objects[i].width, objects[i].height);
            //dot
            context.fillStyle = "red";
            context.fillRect(-objects[i].width / 2, -objects[i].height / 2, 10, 10);
            context.restore();
        //else{
            //context.fillRect(objects[i].points[0].x, objects[i].points[0].y, objects[i].width(), objects[i].height());
        //}
        //context.rect(objects[i].points[0].x, objects[i].points[0].y, objects[i].width(), objects[i].height());
        //context.stroke();
    }
}
function update(progress) {
    //Drag
    for (i = 0; i < objects.length; i++) {
        if (!objects[i].static) {
            dragPhysics(objects[i]);
        }
    }
    //Detect Collision
    for (a = 0; a < objects.length; a++) {
        for (b = a + 1; b < objects.length; b++) {
            if (!objects[a].static) {
                collisionDetect2(objects[a], objects[b]);
            }
        }
    }
    //Displace objects
    for (n = 0; n < objects.length; n++) {
        //alert(objects.length);
        if (!objects[n].static) {
            displacementPhysics(objects[n]);
        }
    }
}
function resizeCanvas() {
    width = $(".main").width();
    height = $(".main").height();
    screen.height = height;
    screen.width = width;
}

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        player.Vy = -1;
    }
    else if (e.keyCode == '40') {
        player.Vy = 1;
    }
    else if (e.keyCode == '37') {
        player.Vx = -1;
    }
    else if (e.keyCode == '39') {
        player.Vx = 1;
    }

}

    var lastRender = 0;

    window.requestAnimationFrame(loop);