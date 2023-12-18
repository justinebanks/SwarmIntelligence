// General Constants
const WIDTH = window.screen.availWidth - 10;
const HEIGHT = window.screen.availHeight - 150;


// Being Constants
const CELL_COUNT = 1000;
const CELL_SIZE = 1;

const MIN_CELL_SPEED = 1;
const MAX_CELL_SPEED = 2;

const BROADCAST_DISTANCE = 100;


// Target Constants
const TARGET_SIZE = 20;
const TARGET_SPEED = 0.5;


// Defines Array of all Beings (Cells) and all Targets
let beings = [];
let targets = [];


class Target {
	constructor(color) {
		this.position = new Vector(Math.random()*WIDTH, Math.random()*HEIGHT);
		this.direction = Vector.fromRandom();
		this.velocity = TARGET_SPEED;
		this.size = TARGET_SIZE;
		this.color = color;
	}

	draw() {
		c.beginPath();
		c.fillStyle = `hsl(${this.color}, 100%, 50%)`;
		c.arc(this.position.x, this.position.y, this.size, 0, Math.PI*2)
		c.fill()
		c.closePath();
	}

	animate() {
		this.draw();
		
		// Target Movement
		this.position.x += this.direction.x * this.velocity;
		this.position.y += this.direction.y * this.velocity;


		// Bouncing off Walls
		if (this.position.x <= 0 || this.position.x >= canvas.width) {
			this.direction.x *= -1;
		}

		if (this.position.y <= 0 || this.position.y >= canvas.height) {
			this.direction.y *= -1;
		}
	}
}


class Being {
	constructor(x, y, size) {

		// Default Object Properies
		this.position = new Vector(x, y)
		this.size = size;
		this.velocity = randRange(MIN_CELL_SPEED, MAX_CELL_SPEED);
		this.direction = new Vector(randRange(-1, 1), randRange(-1, 1)).getNormalized();
		this.id = Math.random()
		this.broadcastHighlight = false;


		// For Swarm Intelligence
		this.objectiveDest = Math.floor(randRange(0, targets.length)); // The cell's desired target
		this.color = targets[this.objectiveDest].color; // cell is the same color as its desired target

		this.distanceFromDest = []; // Cell's approximated distance from its target
		this.broadcast = [] // The broadcast signal that the cell sends to other cells
		targets.forEach((_, index) => { this.distanceFromDest[index] = 1_000; this.broadcast[index] = 1_000 }) // Dummy values for last 2 properties

	}


	draw() {
		c.beginPath();
		c.fillStyle = `hsl(${this.color}, 100%, 50%)`;
		c.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
		c.fill();
		c.closePath();
	}


	isCollidingWith(being) {
		if (this.position.distanceTo(being.position) <= this.size + being.size) {
			return true;
		}
		else {
			return false;
		}
	}


	// Draws the successful signals between beings in order to produce a lightning-like effect
	drawConnection(being, targetIndex) {
		c.beginPath();
		c.strokeStyle = `hsl(${targets[targetIndex].color}, 100%, 50%)`;
		c.lineWidth = 2.0;
		c.moveTo(being.position.x, being.position.y);
		c.lineTo(this.position.x, this.position.y);
		c.stroke();
		c.closePath();
	}


	animate() {
		this.draw();


		// Swarm Intelligence Code (Follows all directions laid out at timestamp 5:13)
		let broadcastDist = BROADCAST_DISTANCE;
		this.direction.x += randRange(-0.05, 0.05);
		this.direction.y += randRange(-0.05, 0.05);


		// 1+2. Take a step & Increase all counters by one
		for (let i = 0; i < targets.length; i++) {
			this.distanceFromDest[i]++;
		}


		// 3. If you bump into one of the items
		for (let i = 0; i < targets.length; i++) {
			if (this.isCollidingWith(targets[i])) {
				// 3.1 reset all respective counters
				this.distanceFromDest[i] = 0;


				// 3.2 If this is the destination you were willing to reach
				if (this.objectiveDest == i) {

					// Code for the 2 queen targets sucking resources from the 2 resource targets
					if (i == 0 || i == 1) {
						targets[i].size += 0.01
					}
					else {
						if (targets[i].size > 0.1) {
							targets[i].size -= 0.05;
						} else {
							targets[i] = new Target(Math.floor(randRange(180, 360)));
						}
					}
					
					this.color = targets[this.objectiveDest].color;

					// 3.2.1 Turn around 180 degrees
					this.direction = this.direction.mul(-1);
	
					// 3.2.2 Change the destination objective
					let closestQueen = this.position.distanceTo(targets[0].position) < this.position.distanceTo(targets[1].position) ? 0 : 1;
					this.objectiveDest = i == 0 ? randChoice(_range(2, targets.length)) :  i == 1 ? randChoice(_range(2, targets.length)) : closestQueen;
				}
			}
		}

		// 4. Shout out the value of your counters plus the maximum distance you can be heard at
		this.broadcast = []
		targets.forEach((item, index) => this.broadcast.push(this.distanceFromDest[index]+broadcastDist))

		// 5. Listen to what others are shouting
		for (let being of beings) {
			if (this.position.distanceTo(being.position) <= broadcastDist) {
				for (let i = 0; i < targets.length; i++) {
					// 6. If you have heard a value less than in your counter
					if (being.broadcast[i] < this.distanceFromDest[i]) {
						// 6.1 Update your respective counter
						this.distanceFromDest[i] = being.broadcast[i];
						
						if (this.broadcastHighlight == true) {
							this.drawConnection(being, i);
						}
						
						// 6.2 If you need to reach this place
						if (this.objectiveDest == i) {
							// 6.2.1 Turn in the direction of the shouting
							let n = this.position.directionTo(being.position);
							if (n.x) {
								this.direction = this.position.directionTo(being.position);
							}
						}
					}		
				}
			}
		}


		// Being Movement
		being.position.x += this.direction.x * this.velocity;
		being.position.y += this.direction.y * this.velocity;


		// Bouncing off Walls
		if (this.position.x <= 0 || this.position.x >= canvas.width) {
			this.direction.x *= -1;
		}

		if (this.position.y <= 0 || this.position.y >= canvas.height) {
			this.direction.y *= -1;
		}
	}
}
