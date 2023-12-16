

// Set Up Canvas
const canvas = document.querySelector("canvas")
canvas.width = WIDTH;
canvas.height = HEIGHT

const offscreen = canvas.transferControlToOffscreen();
const c = offscreen.getContext("2d");



targets.push(new Target(60));
targets.push(new Target(240));

// Spawn Beings
for (i in range(CELL_COUNT)) {
	let being = new Being(Math.random() * canvas.width, Math.random() * canvas.height, CELL_SIZE)
	beings.push(being)
}




function animate() {
	//worker.requestAnimationFrame(animate);
	requestAnimationFrame(animate)
	c.clearRect(0, 0, canvas.width, canvas.height)
	frame++


	for (let target of targets) {
		target.animate();
	}


	/*
	// Draw All PinPoint Rects
	for (let pinPoint of pinPoints) {
		c.beginPath();
		c.strokeStyle = "red";
		c.strokeRect(pinPoint.x-25, pinPoint.y-25, 50, 50);
		c.closePath();
	}


	
	// Draw Glue Holding Groups Together
	let groups = getGroups();

	for (let group of groups) {
		let position = group.getTopLeft();
		let width = group.getGroupWidth();
		let height = group.getGroupHeight();

		c.beginPath();
		c.fillStyle = "white";
		c.fillRect(position.x, position.y, width, height);
		c.closePath();
	}
	*/

	// Animate Mouse Tracker Circle
	c.beginPath();
	c.strokeStyle = "yellow"
	c.arc(mousePosition.x, mousePosition.y, MOUSE_RANGE, 0, Math.PI*2);
	c.stroke();
	c.closePath();
	




	// Update Beings
	for (being of beings) {
		being.animate()
	}
}

animate()