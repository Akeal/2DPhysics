function Point(x, y) {
    this.x = x;
    this.y = y;
}
function MTV(location, amount) {
    var angle;
    if (location.x == 0) {
        if (location.y < 0) {
            angle = ((3 * Math.PI)/2);
        }
        else {
            angle = (Math.PI / 2);
        }
    }
    else if (location.y == 0) {
        if (location.x < 0) {
            angle = Math.PI;
        }
        else {
            angle = 0;
        }
    }
    else {
        angle = Math.atan(location.y / location.x);
    }

    this.y = (Math.sin(angle) * amount);
    this.x = (Math.cos(angle) * amount);

}
function hypotenuse(x, y) {
    return Math.sqrt((x*x) + (y*y));
}

function dotProduct(a, b) {
    return ((a.x * b.x) + (a.y * b.y));
}
function pointSubtract(a, b) {
    var x = a.x - b.x;
    var y = a.y - b.y;
    return new Point(x, y);
}
function normalize(a) {
    var length = Math.sqrt((a.x * a.x) + (a.y * a.y));
    if (length != 0) {
        var x = a.x / length;
        var y = a.y / length;
    }
    return new Point(x, y);
}
function crossProduct(a, b) {
    return ((a.x * b.y) - (a.y * b.x));
}
function crossProduct2(vector, scalar) {
    return (new Point(scalar * vector.y, -scalar * vector.x));
}
function crossProduct3(scalar, vector) {
    return (new Point(-scalar * vector.y, scalar * vector.x));
}