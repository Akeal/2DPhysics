function dragPhysics(a) {
    var drag = 0.6;
    var fluidDensity = 1.22;
    var Area = a.area();
    if (a.Vx != 0) {
        a.Fx = -0.5 * drag * Area * fluidDensity * a.Vx * a.Vx * (a.Vx / Math.abs(a.Vx));
    }
    if (a.Vy != 0) {
        a.Fy = -0.5 * drag * Area * fluidDensity * a.Vy * a.Vy * (a.Vy / Math.abs(a.Vy));
    }
}
function displacementPhysics(a) {
    var ax = a.Fx / a.mass;
    var ay = 9.81 + (a.Fy / a.mass);

    a.Vx += ax * (1 / 40);
    a.Vy += ay * (1 / 40);

    //a.angle += 0.01;

    //Angular
    a.Vangular += a.torque * (1 / a.mass) * (1 / 40);
    a.angle += a.Vangular * (1 / 40);

    if (a.Vx < 0.001 && a.Vx > -0.001) {
        a.Vx = 0;
    }
    if (a.Vy < 0.001 && a.Vy > -0.001) {
        a.Vy = 0;
    }
    for (i = 0; i < a.points.length; i++){
        a.points[i].x += a.Vx * (1 / 40) * 100;
        a.points[i].y += a.Vy * (1 / 40) * 100;
    }
}
function collisionDetect2(a, b) {
    var smallestOverlap = 999999999999999;
    var smallestAxis;
    var axes = obtainSeperatingAxes(a);
    var axes2 = obtainSeperatingAxes(b);
    for (o = 0; o < axes.length; o++) {
        var p1 = projecting(a, axes[o]);
        var p2 = projecting(b, axes[o]);
        if (!overlap(p1, p2)) {
            return;
        }
        var overlapAmnt = getOverlap(p1, p2);
        if (overlapAmnt < smallestOverlap) {
            smallestOverlap = overlapAmnt;
            smallestAxis = axes[o];
        }
    }
    for (k = 0; k < axes2.length; k++) {
        var p1 = projecting(a, axes2[k]);
        var p2 = projecting(b, axes2[k]);
        if (!overlap(p1, p2)) {
            return;
        }
        overlapAmnt = getOverlap(p1, p2);
        if (overlapAmnt < smallestOverlap) {
            smallestOverlap = overlapAmnt;
            smallestAxis = axes[k];
        }
    }
    //Collision occurs
    var M = new MTV(smallestAxis, smallestOverlap);

    //Uncomment for angular
    //angular(a, b, M);
    resolveCollisionY(a, b, M);
    resolveCollisionX(a, b, M);
}
function angular(a, b, axisM) {
    //alert(axisM.x + " " + axisM.y);
    /*if (a.centerX() > b.centerX()) {
        //var radiusX = Math.abs((a.centerX() - a.points[0].x) - (b.points[1].x - a.points[0].x));
        var radiusX = axisM.x;
    }
    else{
        //var radiusX = Math.abs((a.centerX() - a.points[0].x) - (b.points[1].x - a.points[0].x));
        var radiusX = axisM.x;
    }
    if (a.centerY() > b.centerY()) {
        //var radiusY = Math.abs((a.centerY() - a.points[0].y) - (b.points[2].y - a.points[0].y));
        var radiusY = axisM.y;
    }
    else {
        //var radiusY = Math.abs((a.centerY() - a.points[0].y) - (b.points[2].y - a.points[0].y));
        var radiusY = axisM.y;
    }*/
    var radius = 99999999999999;
    for (c = 0; c < b.points.length; c++) {
        rX = Math.abs(a.centerX() - b.points[c].x);
        rY = Math.abs(b.points[c].y - a.centerY());
        r = hypotenuse(rX, rY);
        if (r < radius) {
            radius = hypotenuse(a.centerX() - b.points[c].x, b.points[c].y - a.centerY());
            radiusX = rX;
            radiusY = rY;
            alert(a.points[0].x + " " + a.points[0].y);
            //alert(c + " Point: " + b.points[c].x + ", " + b.points[c].y + " Center: " + a.centerX() + ", " + a.centerY() + " Radius: " + rX + " " + rY);
        }
    }
    //var radiusY = Math.abs(/*Math.abs(a.centerY()) -*/ Math.abs(axisM.y));
    //var radius = hypotenuse(radiusX, radiusY);
    //alert(hypotenuse(a.centerX() - b.points[c].x, b.points[c].y - a.centerY()));
    //alert(radius);
    var wX = radiusX * a.Vx;
    var wY = radiusY * a.Vy;
    var w = hypotenuse(wX, wY);
    a.torque = radius * w;
    //alert(axisM.Y);
    a.rotate();

}
function resolveCollisionX(a, b, M) {
    var minRest = Math.min(a.restitution, b.restitution);

    //Calculate amount of horizontal impulse
    var impulseX = (-(1 + minRest) * M.x / ((1 / a.mass) + (1 / b.mass)));

    if (a.centerX() + a.points[0].x > b.centerX() + b.points[0].x) {
        if (b.type == "solid") {
            a.Vx += ((1 / a.mass) * impulseX);
            if (!b.static) {
                b.Vx -= ((1 / b.mass) * impulseX);
            }
        }
    }

    else if (a.centerX() + a.points[0].x < b.centerX() + b.points[0].x) {
        if (b.type == "solid") {
            a.Vx -= ((1 / a.mass) * impulseX);
            if (!b.static) {
                b.Vx += ((1 / b.mass) * impulseX);
            }
        }
    }
    //Positional correction
    var percent = 0.2;
    var correction = M.x / (a.mass + b.mass) * percent;
    a.x(-correction * a.mass);
    if (!b.static) {
        b.x(correction * b.mass);
    }
}
function resolveCollisionY(a, b, M) { 

    //frictionX(a);

    //Minimum restitution between objects
    var minRest = Math.min(a.restitution, b.restitution);
    var impulseY = (-(1 + minRest) * M.y) / ((1 / a.mass) + (1 / b.mass));

    //Vertical
    if (a.centerY() + a.points[0].y < b.centerY() + b.points[0].y) {
        if (b.type == "solid") {

            a.Vy += ((1 / a.mass) * impulseY);
            if (!b.static) {
                b.Vy -= ((1 / b.mass) * impulseY);
            }
        }
        else {
            var buoyancy = M.y * 1 * -9.81;
            a.Fy += a.Fy + buoyancy;
        }
    }
    if (a.centerY() + a.points[0].y > b.centerY() + b.points[0].y) {
        if (b.type == "solid") {

            a.Vy -= ((1 / a.mass) * impulseY);
            if (!b.static) {
                b.Vy += ((1 / b.mass) * impulseY);
            }
        }
        else {
            var buoyancy = M.y * 1 * -9.81;
            a.Fy += a.Fy + buoyancy;
        }
    }
        //Positional correction
        var percent = 0.2;
        var correction = M.y / (a.mass + b.mass) * percent;
        a.y(-correction);
}
function overlap(projA, projB) {
    if (projA.min > projB.max) {
        return false;
    }
    else if (projB.min > projA.max) {
        return false;
    }
    else {
        return true;
    }
}
function getOverlap(projA, projB) {
    if (overlap(projA, projB)) {
        return (Math.min(projA.max, projB.max) - Math.max(projA.min, projB.min));
    }
}

function obtainSeperatingAxes(currShape) {
    var axes = [];
    for (q = 0; q < currShape.points.length; q++) {
        var point1 = currShape.points[q];
        var w = q + 1;
        if (w == currShape.points.length) {
            w = 0;
        }
        var point2 = currShape.points[w];
        var edge = pointSubtract(point1, point2);
        var edgeX = edge.x;
        edge.x = edge.y;
        edge.y = edgeX;
        edge.y *= -1;
        axes.push(edge);
    }
    return axes;
}
function projecting(shape, axis) {
    var axisNorm = normalize(axis);
    var min = dotProduct(axisNorm, shape.points[0]);
    var max = min;
    for (c = 1; c < shape.points.length; c++) {
        var product = dotProduct(axisNorm, shape.points[c]);
        if (product < min) {
            min = product;
        }
        else if (product > max) {
            max = product;
        }
    }
    var p = new Projection(min, max);
    return p;
}
function frictionX(a) {
    var sign = Math.sign(a.Fx);
    //Friction
    if (a.Fx > 0) {
        if (a.Vx < 0.1 && a.Vx > -0.1) {
            a.Fx -= (a.coffStatic * a.Fy);
        }
        else {
            a.Fx -= (a.coffKinetic * a.Fy);
        }
    }
    else if (a.Fx < 0) {
        if (a.Vx > -0.1 && a.Vx < 0.1) {
            a.Fx += (a.coffStatic * a.Fy);
        }
        else {
            a.Fx += (a.coffKinetic * a.Fy);
        }
    }
    if (Math.sign(a.Fx) != sign) {
        a.Fx = 0;
    }
    /*if (a.Fx < 0.0001 && a.Fx > -0.0001) {
        a.Fx = 0;
        a.Vx = 0;
    }*/
}
function frictionY(a) {
    if (a.Vx > 0) {
        if (a.Vy > -0.1 && a.Vy < 0.1) {
            a.Fy -= (a.coffStatic * a.Fx);
        }
        else {
            a.Fy -= (a.coffKinetic * a.Fx);
        }
    }
    if (a.Vx < 0) {
        if (a.Vy < 0.1 && a.Vy > -0.1) {
            a.Fy += (a.coffStatic * a.Fx);
        }
        else {
            a.Fy += (a.coffKinetic * a.Fx);
        }
    }
    if (a.Fy < 0.0005 && a.Fy > -0.0005) {
        a.Fy = 0;
        a.Vy = 0;
    }
}