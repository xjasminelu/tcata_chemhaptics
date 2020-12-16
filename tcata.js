let sessionOutput;
var tcataState;
let attributes;

var state = 'INIT';
var canvas;

//init_view
var init_div;
var on_set_up_view;
var tcata_view;
var off_setup_view;
var name;
var chemID;


function preload() {
	attributes = loadStrings('Attributes.txt');
}

function setup() {
	canvas = createCanvas(windowWidth,windowHeight);
	noLoop();
	textSize(20);
	textAlign(LEFT, 'BASELINE');
	state = 'INIT';
}

function initializeCheckboxes() {
	let checkBoxes = [];
	attr_rand = shuffleArray(attributes);
	let ids = [];
	attr_rand.forEach(function(item, index, array) {
		checkBoxes[index] = createCheckbox(index+1 +". " + item, false);
		checkBoxes[index].changed(onAttributeChange);
		checkBoxes[index].addClass('checkmark');
		checkBoxes[index].addClass(state);
		checkBoxes[index].id("check" + (index+1));
		checkBoxes[index].parent('checkboxes');
	})
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
		return array;
}

function init_view() {
	init_div = createDiv();
	init_div.id('init_view');
	init_div.addClass('page');

	enterName = text("Name:", windowWidth/2 - 160, windowHeight/2-130);
	name_input = createInput();
	name_input.input(function(){name = this.value()});
	name_input.position(windowWidth/2, windowHeight/2 - 148);
	name_input.parent('init_view');

	enterChemID = text("Chemical ID:", windowWidth/2 - 160, windowHeight/2 - 60);
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
		//text("test", windowWidth/2, windowHeight/2);
		on_set_up_view = select('#on_setup_view');
		on_set_up_view.show();
		canvas.hide();
		im_ready_btn = createButton("I'm ready! Start trial.");
		//im_ready_btn.position(windowWidth/2, windowHeight - 150);
		//im_ready_btn.center('horizontal');
		im_ready_btn.addClass('button btn btn-success');
		im_ready_btn.parent('on_setup_view');
		im_ready_btn.mousePressed(click_im_ready);

	}
	if(state == 'ON_TCATA') {
		//text("Please check and uncheck the sensations listed below as you feel them.", windowWidth/2, 40);

		tcata_view = select('#tcata_view');
		tcata_view.show();
		initializeCheckboxes();
		s_stopped = createButton('Sensations have stopped for over 30sec.');
		s_stopped.addClass('button btn btn-primary');
		s_stopped.parent('on_tcata');
		s_stopped.mousePressed(click_s_stopped);
		canvas.hide();
	}

	if(state == 'OFF_SETUP') {
		off_setup_view = select('#off_setup_view');
		off_setup_view.show();
		continue_btn = createButton("Continue to next phase of trial.");
		//continue_btn.position(windowWidth/2, windowHeight - 150);
		//continue_btn.center('horizontal');
		continue_btn.addClass('button btn btn-primary');
		continue_btn.parent('off_setup_view');
		continue_btn.mousePressed(click_continue);
	}

	if(state == 'OFF_TCATA') {
		//initializeCheckboxes();
		//s_stopped2 = createButton('Sensations have stopped for over 30sec.');
		//s_stopped2.addClass('button btn btn-primary');
		//s_stopped2.parent('on_tcata');
		//s_stopped2.mousePressed(click_s_stopped2);
		//canvas.hide();
	}

	if(state== 'COLLECT_DATA') {
		get_file = createButton('Download Session CSV');
		get_file.addClass('button btn btn-success');
		get_file.parent('collect_data_view');
		get_file.mousePressed(closeFile);
	}

	window.scrollTo(0,0);
}

function click_continue() {

	state='OFF_TCATA';
	off_setup_view = select('#off_setup_view');
	off_setup_view.hide();
	tcata_view = select('#tcata_view');
	tcata_view.show();
	redraw();
}

function click_s_stopped() {
	if(state == 'ON_TCATA'){
		console.log("OFF_SETUP");
		state='OFF_SETUP';
	}
	if(state == 'OFF_TCATA') {
		state='COLLECT_DATA';
		collect_data_view = select('#collect_data_view');
		collect_data_view.show();
	}

	tcata_view = select('#tcata_view');
	tcata_view.hide();
	redraw();

}

function click_im_ready() {
	on_set_up_view.hide();
	state='ON_TCATA';
	redraw();
}

function click_on_setup() {
	init_div.hide();
	state = 'ON_SETUP';
	redraw();
	sessionOutput = createWriter("session_"+name+chemID+".csv");
	sessionOutput.write(['Time,Attribute,State,Phase\n']);
}

function keyTyped() {
	var re = new RegExp('[1-9]');
	let timeStamp = millis();
	var cb_key;
	if (key.match(re)) {
		cb_key = select("input", "#check"+int(key));
		cb_key.elt.click();
	}
}

function onAttributeChange() {
	let timestamp = millis();
	let attribute = this.value().substring(3);
	let attributeState;

	if (this.checked()) {
		console.log(attribute + ' checked at ' + millis());
		attributeState = 1;
	} else {
		console.log(attribute + ' unchecked at ' + millis());
		attributeState = 0;
	}

	sessionOutput.write([timestamp + ',' + attribute + ',' + attributeState + ',' + state +'\n']);
}

function closeFile() {
	sessionOutput.close();
}
