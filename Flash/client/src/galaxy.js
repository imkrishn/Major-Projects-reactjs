function animate(canvas) {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let c = canvas.getContext("2d");

    class particle {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
        }

        draw() {
            c.beginPath();
            c.shadowColor = this.color;
            c.shadowBlur = 20;
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fillStyle = this.color;
            c.fill();
            c.closePath();
        }

        update() {
            this.draw();
        }
    }

    let particles;
    const galaxyColors = [ /* your colors array */];

    function init() {
        particles = [];
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * (canvas.width + 300) - (canvas.width + 300) / 2;
            const y = Math.random() * (canvas.height + 800) - (canvas.height + 800) / 2;
            const radius = Math.random() * 2;
            const color = galaxyColors[Math.floor(Math.random() * galaxyColors.length)];
            particles.push(new particle(x, y, radius, color));
        }
    }

    let radian = 0;
    let alpha = 1;
    let mouseClick = false;


    addEventListener("mousedown", () => {
        mouseClick = true;
    });

    addEventListener("mouseup", () => {
        mouseClick = false;
    });

    addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    function animateFrame() {
        requestAnimationFrame(animateFrame);

        c.fillStyle = `rgba(10,10,10,${alpha})`;
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.save();
        c.translate(canvas.width / 2, canvas.height / 2);
        c.rotate(radian);
        particles.forEach((element) => {
            element.update();
        });
        c.restore();

        radian += 0.005;
        if (mouseClick && alpha >= 0.1) {
            alpha -= 0.01;
        } else if (!mouseClick && alpha < 1) {
            alpha += 0.01;
        }
    }

    init();
    animateFrame();
}

export default animate;
