	window.onload = function () {
    var canvas = document.getElementById("screen"),
        width = window.innerWidth,
        height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext('2d');

    var particles = [],
        particlesCount = 150,
        minSpeed = 0.06125,
        maxSpeed = 0.125,
        time = 0,
        minSize = 0.7,
        maxSize = 1.3;

    function createParticles() {
        particles = [];
        for (var i = 0; i < particlesCount; i++) {

            var dirX = Math.random() * (maxSpeed - minSpeed) + minSpeed;
            var dirY = Math.random() * (maxSpeed - minSpeed) + minSpeed;
            dirX *= Math.random() > 0.5 ? 1 : -1;
            dirY *= Math.random() > 0.5 ? 1 : -1;

            var position = new Vector(Math.random() * width, Math.random() * height),
                direction = new Vector(dirX, dirY);
            particles.push(new Particle(position, direction, null, minSize, maxSize));
        }
    }

    function update() {
        context.clearRect(0, 0, width, height);

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.update(context, time);

            if (p.position.x < 0 || p.position.x > width) {
                p.direction.x *= -1;
            }
            if (p.position.y < 0 || p.position.y > height) {
                p.direction.y *= -1;
            }

            for (var j = i + 1; j < particles.length; j++) {
                var p2 = particles[j];
                var distance = p.position.distance(p2.position);
                var radiusSum = p.radius + p2.radius;
                if (distance < radiusSum) {
                    context.globalAlpha = 1 - distance / radiusSum;
                    context.beginPath();
                    context.moveTo(p.position.x, p.position.y);
                    context.lineTo(p2.position.x, p2.position.y);
                    context.strokeStyle = 'rgb(127, 127, 127)';
                    context.stroke();
                    context.closePath();
                }
            }
        }

        time += 0.01;
        requestAnimationFrame(update);
    }

    createParticles();
    update();

}

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype = {
    addTo: function (vector) {
        this.x += vector.x;
        this.y += vector.y;
    },
    multiplyBy: function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
    },
    distance: function (vector) {
        var dx = this.x - vector.x;
        var dy = this.y - vector.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

function Particle(position, direction, color, minScale, maxScale, radius) {
    this.hexCoords = [
        5, 0,
        2.5, -4.3,
        -2.5, -4.3,
        -5, 0,
        -2.5, 4.3,
        2.5, 4.3,
        5, 0
    ];

    this.position = position || new Vector(0, 0);
    this.direction = direction || new Vector(0, 0);
    this.color = color || 'rgb(	255, 255, 255)';
    this.alpha = 1;
    this.alphaChangeRate = Math.random();
    this.minScale = minScale || 1;
    this.maxScale = maxScale || 1;
    this.scaleChangeRate = Math.random();
    this.radius = radius || 100;
}

Particle.prototype = {
    update: function (context, time) {
        this.scale = this.minScale + ((this.maxScale - this.minScale) / 2) + Math.cos(time * this.scaleChangeRate) * ((this.maxScale - this.minScale) / 2);

        this.position.addTo(this.direction);

        var posX = this.hexCoords[0] * this.scale + this.position.x;
        var posY = this.hexCoords[i + 1] * this.scale + this.position.y;

        this.alpha = 0.5 + Math.cos(time * this.alphaChangeRate) * 0.5;
        context.globalAlpha = this.alpha;

        context.beginPath();
        context.moveTo(posX, posY);
        for (var i = 2; i < this.hexCoords.length; i += 2) {
            posX = this.hexCoords[i] * this.scale + this.position.x;
            posY = this.hexCoords[i + 1] * this.scale + this.position.y;
            context.lineTo(posX, posY);
        }
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }
}
