/*
Inspired By Simulife Hub's YouTube Video
on is "Screaming Insects" Project

Link to video right here: "https://www.youtube.com/watch?v=Yu7sF9rcVJY"

Full description of how swarm intelligence is simulated
is at the timestamp 5:13 in the video

*/


// Set Up Canvas
const canvas = document.querySelector("canvas")
canvas.width = WIDTH;
canvas.height = HEIGHT

const offscreen = canvas.transferControlToOffscreen();
const c = offscreen.getContext("2d");


// Spawn Targets (and Chooses their default colors)
targets.push(new Target(60));
targets.push(new Target(50));
targets.push(new Target(240));
targets.push(new Target(180));


// Spawn Beings
for (i in range(CELL_COUNT)) {
	let being = new Being(Math.random() * canvas.width, Math.random() * canvas.height, CELL_SIZE)
	beings.push(being)
}


function animate() {
	requestAnimationFrame(animate)
	c.clearRect(0, 0, canvas.width, canvas.height)

	// Updates targets
	for (let target of targets) {
		target.animate();
	}

	// Update Beings
	for (being of beings) {
		being.animate()
	}
}

animate()