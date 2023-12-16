let prevVelocities = []
let selectedBeings = []

function getBeing(id) {
	for (let being of beings) {
		if (being.id == id) {
			return being;
		}
	}
}


function logSelectedBeings() {
	let noCopies = new Set(selectedBeings)

	for (let id of noCopies) {
		console.log(getBeing(id));
	}
}


function pauseProgram() {
	for (let i = 0; i < beings.length; i++) {
		prevVelocities.push(beings[i].velocity)
		beings[i].velocity = 0;
	}
}


function unpauseProgram() {
	for (let i = 0; i < beings.length; i++) {
		beings[i].velocity = prevVelocities[i]
	}
}


function setProgramSpeed(newSpeed) {
	for (let being of beings) {
		being.velocity = newSpeed;
	}
}


function getGroups() {
	let speedSet = new Set();
	let speedArr = [];

	let groups = [];

	beings.forEach((being) => speedSet.add(being.direction.x));
	speedSet.forEach((item) => speedArr.push(item));
	speedArr.forEach((item) => groups.push(new BeingGroup()));

	for (let being of beings) {
		let group = groups[speedArr.indexOf(being.direction.x)];
		group.add(being);
	}

	return groups;
}


function getGroup(id) {
	let groups = getGroups();
	return groups.filter((group) => group.id == id)[0];
}