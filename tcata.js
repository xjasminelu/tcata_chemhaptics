let sessionOutput;
var tcataState;
let attributes;

var tick;
var clap;

var state = 'INIT';
var canvas;

//init_view
var init_div;
var on_set_up_view;
var tcata_view;
var off_setup_view;
var name = '';
var chemID = '';

var time_counter;
var action = "Compress";
var timer;

function preload() {
	attributes = loadStrings('Attributes.txt');

	soundFormats('wav');
  tick = loadSound('assets/tick.wav');
	clap = loadSound('assets/clap.wav');
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

	onTapText = createDiv("<b>On Tap: </b>");
	onTapText.parent('checkboxes');
	let tapCheckbox = [];
	tapCheckbox[0] = createCheckbox("10. increasing sensation", false);
	tapCheckbox[0].changed(onAttributeChange);
	tapCheckbox[0].addClass('checkmark');
	tapCheckbox[0].addClass(state);
	tapCheckbox[0].id("check" + 10);
	tapCheckbox[0].parent('checkboxes');

	tapCheckbox[1] = createCheckbox("11. decreasing sensation", false);
	tapCheckbox[1].changed(onAttributeChange);
	tapCheckbox[1].addClass('checkmark');
	tapCheckbox[1].addClass(state);
	tapCheckbox[1].id("check" + 11);
	tapCheckbox[1].parent('checkboxes');
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
		on_set_up_view = select('#on_setup_view');
		on_set_up_view.show();
		canvas.hide();
		im_ready_btn = createButton("I'm ready! Start trial.");
		im_ready_btn.addClass('button btn btn-success');
		im_ready_btn.parent('on_setup_view');
		im_ready_btn.mousePressed(click_im_ready);

	}
	if(state == 'ON_TCATA') {
		tcata_view = select('#tcata_view');
		tcata_view.style('display','flex');
		initializeCheckboxes();
		s_stopped = createButton('10 minutes have elapsed - Proceed.');
		s_stopped.addClass('button btn btn-primary');
		s_stopped.parent('on_tcata');
		s_stopped.mousePressed(click_s_stopped);
		canvas.hide();
		let timestamp = millis();
		sessionOutput = sessionOutput + timestamp + ',,, START\n';
		actionStr = "<span class=\"active\">Compress</span><span class=\"inactive\"> / Tap</span>";
		timer = createP("<h3> 0:00 </h3><h4>" + actionStr + "</h4> <h5> Alternate between compressing the pipette and tapping the patch every 5 seconds.</h5>");
		timer.id('timer');
		timer.parent('tcata_help');
		time_counter = 0;
  	setInterval(timeIt, 1000);
		tick.play();
	}

	if(state == 'OFF_SETUP') {
		off_setup_view = select('#off_setup_view');
		off_setup_view.show();
		continue_btn = createButton("Continue to next phase of trial.");
		continue_btn.addClass('button btn btn-primary');
		continue_btn.parent('off_setup_view');
		continue_btn.mousePressed(click_continue);
	}

	if(state == 'OFF_TCATA') {
		let timestamp = millis();
		sessionOutput = sessionOutput + timestamp + ',,, START\n';
		time_counter = 0;
		timer.html("<h3> 0:00 </h3><h4><b> Tap </b></h4> <h5> Tap the patch every 10 seconds.</h5>");
		action = "<span class=\"active\">Tap</span>";
	}

	if(state== 'COLLECT_DATA') {
		get_file = createButton('Submit Session Data');
		get_file.addClass('button btn btn-success');
		get_file.parent('collect_data_view');
		get_file.mousePressed(closeFile);
	}

	window.scrollTo(0,0);
}


function timeIt() {
  // 1 counter = 1 second
  time_counter++;

	minutes = floor(time_counter/60);
  seconds = time_counter % 60;

  // if (counter < 60)
	if(seconds < 10){
		sec_str = "0" + seconds;
	}
	else {
		sec_str = seconds;
	}

	if(state == 'ON_TCATA'){
		if(time_counter%5 == 0 && time_counter != 0){
			if(action == "Compress"){
				actionStr = "<span class=\"inactive\">Compress / </span><span class=\"active\">Tap</span>";
				action = "Tap"
				clap.play();
			}
			else if(action == "Tap"){
				actionStr = "<span class=\"active\">Compress</span><span class=\"inactive\"> / Tap</span>";
				action = "Compress"
				tick.play();
			}
		}
		if(time_counter %5 == 2){
			actionStr = "<span class=\"inactive\">Compress / Tap</span>";
		}
	  timer.html("<h3>" + minutes + ":" + sec_str + "</h3><h4>" + actionStr + "</h4> <h5> Alternate between compressing the pipettes and tapping the patch every 5 seconds.</h5>");
	}
	else if (state == 'OFF_TCATA'){
		if(time_counter%10 == 0 && time_counter != 0){
			if(action == "<span class=\"inactive\">Tap</span>"){
				action = "<span class=\"active\">Tap</span>";
				clap.play();
			}
		}
		if(time_counter %10 == 2){
			action = "<span class=\"inactive\">Tap</span>";
		}
	  timer.html("<h3>" + minutes + ":" + sec_str + "</h3><h4>" + action + "</h4> <h5> Tap the patch every 10 seconds.</h5>");
	}

}

function click_continue() {

	state='OFF_TCATA';
	off_setup_view = select('#off_setup_view');
	off_setup_view.hide();
	tcata_view = select('#tcata_view');
	tcata_view.style('display','flex');
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
	let timestamp = millis();
	sessionOutput = sessionOutput + timestamp + ',,, S_STOPPED\n';

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
	sessionOutput = 'Time,Attribute,State,Phase\n';
}

function keyTyped() {
	var re = new RegExp('[1-9]');
	let timeStamp = millis();
	var cb_key;
	if (key.match(re)) {
		cb_key = select("input", "#check"+int(key));
		cb_key.elt.click();
	}
	else if (key == 'q') {
		cb_key = select("input", "#check10");
		cb_key.elt.click();
	}
	else if (key == 'w') {
		cb_key = select("input", "#check11");
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
	sessionOutput = sessionOutput + timestamp + ',' + attribute + ',' + attributeState + ',' + state +'\n';
}

function closeFile() {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", window.location.href, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
	    data: sessionOutput,
			filename: "session_" + name + chemID + ".csv"
	}));
}
