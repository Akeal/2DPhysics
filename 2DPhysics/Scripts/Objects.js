function Projection(min, max) {
    this.min = min;
    this.max = max;
}
function SquareObject(pointA, pointB, pointC, pointD, mass, Vx, Vy, Fx, Fy, restitution, coffStatic, coffKinetic, static, type) {
    this.points = [pointA, pointB, pointC, pointD];
    //this.x = this.points[0].x;
    //this.y = this.points[0].y;
    this.angle = 0;
    this.Vangular = 0;
    this.torque = 0;

    this.y = function (amount) {
        for (p = 0; p < 4; p++) {
            this.points[p].y += amount;
        }
    }
    this.x = function (amount) {
        for (p = 0; p < 4; p++) {
            this.points[p].x += amount;
        }
    }
    this.mass = mass;
    this.Vx = Vx;
    this.Vy = Vy;
    this.Fx = Fx;
    this.Fy = Fy;
    this.restitution = restitution;
    this.coffStatic = coffStatic;
    this.coffKinetic = coffKinetic;
    this.static = static;
    this.type = type;
    this.height = this.points[2].y - this.points[0].y;
    this.width = this.points[1].x - this.points[0].x;
    this.centerX = function () { return (this.points[0].x + (Math.abs(((this.points[1].x) - Math.abs((this.points[0].x)))) / 2)); }
    this.centerY = function () { return (this.points[0].y + (Math.abs(((this.points[2].y) - Math.abs((this.points[0].y)))) / 2)); }

    this.rotate = function () {
        var sin = Math.sin(this.angle);
        var cos = Math.cos(this.angle);
        for (p = 0; p < this.points.length; p++) {
            //var translated = this.translateCenter(new Point(0, 0));
            var translation = new Point(this.centerX(), this.centerY());

            //Set to origin
            this.points[p].x -= translation.x;
            this.points[p].y -= translation.y;

            //Rotate and set center back
            this.points[p].x = ((this.points[p].x * cos) - (this.points[p].y * sin)) + translation.x;
            this.points[p].y = ((this.points[p].x * sin) + (this.points[p].y * cos)) + translation.y;
        }
    }
    this.area = function () { return (this.points[1].x - this.points[0].x) * (this.points[2].y - this.points[0].y) / 10000; }
}
function TriangleObject(pointA, pointB, pointC, mass, Vx, Vy, Fx, Fy, restitution, coffStatic, coffKinetic, static, type) {
    this.points = [pointA, pointB, pointC];
    this.x = this.points[0].x;
    this.y = this.points[0].y;
    this.mass = mass;
    this.Vx = Vx;
    this.Vy = Vy;
    this.Fx = Fx;
    this.Fy = Fy;
    this.restitution = restitution;
    this.coffStatic = coffStatic;
    this.coffKinetic = coffKinetic;
    this.static = static;
    this.type = type;
    this.height = function () { return this.points[2].y - this.points[0].y; }
    this.width = function () { return this.points[1].x - this.points[0].x; }
    this.centerX = function () { return ((this.points[0].x) + (this.width() / 2)); }
    this.centerY = function () { return ((this.points[0].y) + (this.height() / 2)); }
    this.area = function () { return (this.points[1].x - this.points[0].x) * (this.points[2].y - this.points[0].y) / 20000; }
}
