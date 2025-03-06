const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const points = [];
const numPoints = 60; // Number of points
const maxDistance = 100; // Maximum distance to connect points
const mouse = { x: width / 2, y: height / 2, radius: 50 }; // Mouse interaction area

// Create gradient for fill and stroke
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(1, "#43baff"); // First color
gradient.addColorStop(0, "#7141b1"); // Second color

// Create points
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = Math.random() * 1 - 0.5;
    this.velocityY = Math.random() * 1 - 0.5;
    this.size = Math.random() * 3 + 1;
  }
  update() {
    // Move points
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Bounce off walls
    if (this.x < 0 || this.x > width) this.velocityX *= -1;
    if (this.y < 0 || this.y > height) this.velocityY *= -1;

    // Mouse interaction
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      const force = (mouse.radius - distance) / mouse.radius;
      const angle = Math.atan2(dy, dx);
      this.x -= Math.cos(angle) * force * 3;
      this.y -= Math.sin(angle) * force * 3;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = gradient; // Use gradient for fill
    ctx.fill();
  }
}

// Initialize points
for (let i = 0; i < numPoints; i++) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  points.push(new Point(x, y));
}

// Draw lines between points
function drawLines() {
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.strokeStyle = gradient; // Use gradient for stroke
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Update and draw points
  points.forEach((point) => {
    point.update();
    point.draw();
  });

  // Draw lines between points
  drawLines();

  requestAnimationFrame(animate);
}

// Handle mouse movement
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Handle window resize
window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

// Start animation
animate();
