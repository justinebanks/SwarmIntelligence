// Utility Functions and Classes

function randRange(min, max) {
	num = Math.random() * (max - min) + min
	return num
}


function randChoice(arr) {
	num = Math.floor(Math.random()*arr.length);
	return arr[num];
}


function range(n){
	arr = []

	for (let i = n; i > 0; i--) {
		arr.push(0)
	}

	return arr
}


function _range(min, max) {
	return [...Array(max-min).keys()].map((n) => n + min)
}


// Each Item in the Array Must Be of Type Number
function average(arr) {
	let sum = 0;

	for (let i = 0; i < arr.length; i++) {
		sum += arr[i];
	}

	return sum / arr.length;
}


class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static fromOne(n) {
		return new Vector(n, n)
	}

	static fromMagnitude(magnitude, direction) {
		direction = direction.getNormalized();
		return direction.mul(magnitude);
	}

	static fromRandom() {
		return new Vector(Math.random(), Math.random()).getNormalized();
	}

	add(vec) {
		return new Vector(this.x + vec.x, this.y + vec.y);
	}

	sub(vec) {
		return new Vector(this.x - vec.x, this.y - vec.y);
	}

	mul(n) {
		return new Vector(this.x * n, this.y * n);
	}

	div(n) {
		return new Vector(this.x / n, this.y / n);
	}

	distanceTo(vec) {
		let xd = Math.abs(this.x - vec.x)
		let yd = Math.abs(this.y - vec.y)

		let distance = Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2))

		return distance
	}

	directionTo(vec) {
		return vec.sub(this).getNormalized()
	}

	magnitude() {
		let a = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		return a;
	}

	getNormalized() {
		let normalized_vec = new Vector(this.x / this.magnitude(), this.y / this.magnitude());
		return normalized_vec;
	}

	isSameAs(vec) {
		if (this.x == vec.x && this.y == vec.y) {
			return true;
		} else {
			return false;
		}
	}
}

