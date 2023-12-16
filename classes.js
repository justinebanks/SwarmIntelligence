// General Constants
const WIDTH = window.screen.availWidth - 10;
const HEIGHT = window.screen.availHeight - 150;
const CELL_COUNT = 1000;
const CELL_SIZE = 1;
const DEFAULT_CELL_SPEED = 5;
const MOUSE_RANGE = 50;

// Being Joining Constants
const CELL_BOND_FREQUENCY = 3; // Cells can bond with other cells who's age is within this number distance from the cell's age


// Swarm Intelligence Constants
const BROADCAST_DISTANCE = 50;


// Defines Important Program Variables
let mouseClicked = false
let mousePosition = new Vector(0, 0);

let pinPoints = [new Vector(0,0)]
let frame = 0;

let beings = [];
let targets = [];
let queens = []


// Mouse Event Listeners
document.addEventListener("mousemove", (event) => {
	mousePosition = new Vector(event.clientX, event.clientY);
})

document.addEventListener("mousedown", (event) => {
	selectedBeings = [];
	mouseClicked = true;
})

document.addEventListener("mouseup", (event) => {
	mouseClicked = false;
})



class Target {
	constructor(color) {
		this.position = new Vector(Math.random()*WIDTH, Math.random()*HEIGHT);
		this.direction = Vector.fromRandom();
		this.velocity = 1;
		this.size = 20;
		this.color = color;

		//targets.push(this);
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


class Queen {
	constructor(color) {
		this.position = new Vector(Math.random()*WIDTH, Math.random()*HEIGHT);
		this.direction = Vector.fromRandom();
		this.size = 10;
		this.color = 60;
	}	
}


class Being {
	constructor(x, y, size) {
		this.position = new Vector(x, y)
		this.color = 240;
		this.size = size;
		this.velocity = randRange(2, 4);
		this.direction = new Vector(randRange(-1, 1), randRange(-1, 1)).getNormalized();
		this.id = Math.random()

		// For Being Joining
		this.joinedWith = null;
		this.age = Math.floor(Math.random()*50) + 1;

		// For Swarm Intelligence
		this.objectiveDest = Math.floor(randRange(0, targets.length));
		this.distanceFromDest = [];
		this.broadcast = []
		targets.forEach((_, index) => { this.distanceFromDest[index] = 1_000; this.broadcast[index] = 1_000 })

		this.color = targets[this.objectiveDest].color;
	}


	draw() {
		c.beginPath();
		c.fillStyle = `hsl(${this.color}, 100%, 50%)`;
		c.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
		c.fill();
		c.closePath();
	}

	onEnterMouseRange() {
		if (mouseClicked) {
			selectedBeings.push(this.id);
		}
	}

	onLeaveMouseRange() {}


	isCollidingWith(being) {
		if (this.position.distanceTo(being.position) <= this.size + being.size) {
			return true;
		}
		else {
			return false;
		}
	}


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

		if (this.position.distanceTo(mousePosition) <= MOUSE_RANGE) {
			this.onEnterMouseRange();
		}
		else {
			this.onLeaveMouseRange();
		}


		/*
		// Being Joining Functionality
		if (this.joinedWith != null) {
			this.direction = this.joinedWith.direction;
			this.speed = this.joinedWith.speed;

			while (this.isCollidingWith(this.joinedWith) && this.joinedWith == null && this.position.distanceTo(this.joinedWith.position) >= this.size+this.joinedWith.size+10) {
				let randDirection = new Vector(Math.random()-0.5, Math.random()-0.5).getNormalized();
				this.position = this.joinedWith.position.add(Vector.fromMagnitude(this.size+this.joinedWith.size, randDirection));	
			}
		}

		// The Actual Joining of Beings
		let diff = CELL_BOND_FREQUENCY;

		for (let being of beings) {
			if (this.isCollidingWith(being) && being.id != this.id && being.age <= this.age+diff && being.age >= this.age-diff) {
				this.joinedWith = being;
			}
		}*/



		// Swarm Intelligence
		const broadcastDist = BROADCAST_DISTANCE;
		this.direction.x += randRange(-0.05, 0.05);
		this.direction.y += randRange(-0.05, 0.05);

		this.distanceFromDest[0]++;
		this.distanceFromDest[1]++;


		for (let i = 0; i < targets.length; i++) {
			if (this.isCollidingWith(targets[i])) {
				this.distanceFromDest[i] = 0;

				if (this.objectiveDest == i) {
	
					let possibleNewDests = [];

					targets.forEach((target, index) => {
						if (index != i) {
							possibleNewDests.push(index);
						}
					})


					this.objectiveDest = i == 0 ? randChoice(possibleNewDests)
										: i == 1 ? randChoice(possibleNewDests)
										//: i == 2 ? randChoice(possibleNewDests)
										: 3;

					this.direction = this.direction.mul(-1);
					this.color = targets[this.objectiveDest].color;
				}
			}	
		}


		this.broadcast = []
		targets.forEach((item, index) => this.broadcast.push(this.distanceFromDest[index]+broadcastDist))

		for (let being of beings) {
			if (this.position.distanceTo(being.position) <= broadcastDist) {
				for (let i = 0; i < targets.length; i++) {
					if (being.broadcast[i] < this.distanceFromDest[i]) {
						this.distanceFromDest[i] = being.broadcast[i];
						this.drawConnection(being, i);

						if (this.objectiveDest == i) {
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




class BeingGroup {
	constructor(beings=[]) {
		this.beings = beings;
		this.size = beings.length;
		this.id = Math.random();
	}

	add(being) {
		this.beings.push(being);
		this.size = this.beings.length;
	}


	validateBeings(validation_func) {
		for (let being of this.beings) {
			if (being.direction.y == beings[beings.indexOf(being)+1].direction.y) {
				return true;
			}
			else {
				return false;
			}
		}
	}


	getAveragePosition() {
		let x_arr = [];
		let y_arr = [];

		for (let being of this.beings) {
			x_arr.push(being.position.x);
			y_arr.push(being.position.y);
		}

		let position = new Vector(average(x_arr), average(y_arr));
		return position;
	}


	getAverageAge() {
		let ages = [];

		for (let being of this.beings) {
			ages.push(being.age);
		}

		return average(ages);
	}


	getGroupWidth() {
		let xs = [];

		for (let being of this.beings) {
			xs.push(being.position.x);
		}

		return Math.max(...xs) - Math.min(...xs);
	}


	getGroupHeight() {
		let ys = [];

		for (let being of this.beings) {
			ys.push(being.position.y);
		}

		return Math.max(...ys) - Math.min(...ys);
	}


	getTopLeft() {
		let xs = [];
		let ys = [];

		for (let being of this.beings) {
			xs.push(being.position.x);
			ys.push(being.position.y);
		}

		return new Vector(Math.min(...xs), Math.min(...ys));
	}
}