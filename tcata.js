let sessionOutput;
var tcataState;
let attributes;

var state = 'INIT';
var canvas;

//init_view
var init_div;
var name;
var chemID;


function preload() {
	attributes = loadStrings('Attributes.txt');
}

function setup() {
	sessionOutput = createWriter('session01.csv');
	sessionOutput.write(['Time,Attribute,State\n']);
	canvas = createCanvas(windowWidth,windowHeight);
	noLoop();
	textSize(20);
	textAlign(LEFT, 'BASELINE');
	state = 'INIT';
}

function initializeCheckboxes() {
	let checkBoxes = [];
	attributes.forEach(function(item, index, array) {
		checkBoxes[index] = createCheckbox(item, false);
		checkBoxes[index].changed(onAttributeChange);
		checkBoxes[index].addClass('checkmark');
	})
}

function init_view() {
	init_div = createDiv();
	init_div.id('init_view');
	enterName = text("Name:", windowWidth/2 - 160, windowHeight/2-120);
	name_input = createInput();
	name_input.input(function(){name = this.value()});
	name_input.position(windowWidth/2, windowHeight/2 - 148);
	name_input.parent('init_view');

	enterChemID = text("Chemical ID:", windowWidth/2 - 160, windowHeight/2 - 50);
	chemID_input = createInput();
	chemID_input.input(function(){chemID = this.value()});
	chemID_input.position(windowWidth/2, windowHeight/2 - 80);
	chemID_input.parent('init_view');

	get_setup_btn = createButton('Get set up!');
	get_setup_btn.position(windowWidth/2, windowHeight/2 - 60)
	get_setup_btn.center('horizontal');
	get_setup_btn.addClass('button btn btn-success');
	get_setup_btn.parent('init_view');
	get_setup_btn.mousePressed(click_on_setup);
}

function draw() { // Update function.
	background(255,255,255);
	if(state == 'INIT') {
		init_view();
	}
	if(state == 'ON_SETUP') {
		text("test", windowWidth/2, windowHeight/2);
	}
	if(state == 'ON_TCATA') {
		text("Please check and uncheck the sensations listed below as you feel them.", windowWidth/2, 40);
		initializeCheckboxes();
		save = createButton('Save session');
		save.addClass('button');
		save.mousePressed(closeFile);
	}

}

function click_on_setup() {
	console.log(name);
	console.log(chemID);
	init_div.hide();
	state = 'ON_SETUP';
	console.log("ON SET UP");
	redraw();

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
