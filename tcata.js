let sessionOutput;
var tcataState;
let attributes;

function preload() {
	attributes = loadStrings('Attributes.txt');
}

function setup() {
	sessionOutput = createWriter('session01.csv');
	sessionOutput.write(['Time,Attribute,State\n']);
	text('Please check and uncheck the sensations listed below as you feel them.');
	initializeCheckboxes();

	save = createButton('Save session');
	save.addClass('button');
	save.mousePressed(closeFile);
}

function initializeCheckboxes() {
	let checkBoxes = [];
	attributes.forEach(function(item, index, array) {
		checkBoxes[index] = createCheckbox(item, false);
		checkBoxes[index].changed(onAttributeChange);
		checkBoxes[index].addClass('checkmark');
	})
}

function draw() { // Update function.

}

function keyTyped() {
	console.log('press');
	let timeStamp = millis();
	if (key === 's') {
		sessionOutput.write([timeStamp + ',,,' + 'Stimulus\n']);
	} else if (key === 'm') {
		sessionOutput.write([timeStamp + ',,,' + 'Modulator\n']);
	}
}

function onAttributeChange() {
	let timestamp = millis();
	let attribute = this.value();
	let attributeState;

	if (this.checked()) {
		console.log(attribute + ' checked at ' + millis());
		attributeState = 1;
	} else {
		console.log(attribute + ' unchecked at ' + millis());
		attributeState = 0;
	}

	sessionOutput.write([timestamp + ',' + attribute + ',' + attributeState + '\n']);
}

function closeFile() {
	sessionOutput.close();
}
