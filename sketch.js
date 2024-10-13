let cols, rows;
let flowField;
let resolution = 20;
let particles = [];
let zoff = 0; // Noise offset in the z-axis for 3D noise

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  flowField = new Array(cols * rows);

  // Create particles
  for (let i = 0; i < 1000; i++) { // Increased the number of particles
    particles[i] = new Particle();
  }

  // Set up Perlin noise
  noiseDetail(8, 0.5); // Optional: to fine-tune noise
  background(0); // Set the background only once
}

function draw() {
  // Update the flow field using Perlin noise
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4; // Create angle from noise
      let v = p5.Vector.fromAngle(angle); // Create vector from the angle
      v.setMag(1); // Set the vector magnitude (speed)
      flowField[index] = v; // Store in flow field array
      xoff += 0.1; // Increment noise for the next x position
    }
    yoff += 0.1; // Increment noise for the next y position
  }
  zoff += 0.01; // Move through the Perlin noise field over time

  // Update and display each particle
  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowField); // Make particle follow flow field
    particles[i].update(); // Update particle position
    particles[i].edges(); // Handle wrapping at edges
    particles[i].show(); // Draw the particle
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height)); // Start at random position
    this.vel = createVector(0, 0); // Initial velocity
    this.acc = createVector(0, 0); // Acceleration starts at zero
    this.maxSpeed = 4; // Increased speed to make particles more visible
  }

  // Apply the force from the flow field to the particle
  applyForce(force) {
    this.acc.add(force); // Add force to acceleration
  }

  // Make particle follow the flow field
  follow(vectors) {
    let x = floor(this.pos.x / resolution);
    let y = floor(this.pos.y / resolution);
    let index = x + y * cols; // Get index from flow field
    let force = vectors[index]; // Get the vector at that position
    this.applyForce(force); // Apply the force to the particle
  }

  // Update the particle's position
  update() {
    this.vel.add(this.acc); // Update velocity with acceleration
    this.vel.limit(this.maxSpeed); // Limit speed to maxSpeed
    this.pos.add(this.vel); // Update position
    this.acc.mult(0); // Reset acceleration to 0 for the next frame
  }

  // Wrap the particle around edges if it goes off-screen
  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  // Display the particle on the canvas
  show() {
    stroke(255, 50); // White color with more transparency for a glowing effect
    strokeWeight(2); // Increased stroke weight for better visibility
    point(this.pos.x, this.pos.y); // Draw particle as a point
  }
}

function mousePressed() {
  // Save the canvas as an image when the mouse is pressed
  saveCanvas('flowfield', 'png');
}






















































































































































































































































































































