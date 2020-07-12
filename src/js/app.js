let color = $(".selected").css("background-color");
let $canvas = $("canvas");
let controlsSection = $(".controls");
let context = $canvas[0].getContext("2d");
let lastEvent;
let touchMoveZone;
let touchMoveCTX;
let lastPt = null;
let mouseDown = false;
let stroke = 12;
let opacityVal = 100;
opacityVal = opacityVal / 100;

$('#shadowBrush').css({
	width: stroke,
	height: stroke,
	backgroundColor: color,
	borderColor: color
});

$('#strokeVal').text(stroke + ' px');
$('#strokeBox').width(stroke).height(stroke).css('background-color', color);
$('#opacityVal').text(opacityVal);
$(window).on('resize load', function(){
	context.canvas.width = $(window).width();
	context.canvas.height = $(window).height();
});

// open controls panel
$('.btn-controls').on('click', function() {
  	controlsSection.toggleClass('open close');
    if (controlsSection.hasClass('open')){
		$(this).find('span').text('-');
		$(this).css({
			'background-color': '#fff',
			'color': '#000'
		});
		$('canvas').click(function() {
			controlsSection.removeClass('open');
			controlsSection.addClass('close');
			$('.btn-controls').css({
				'background-color': '#000',
				'color': '#fff'
			}).find('span').text('+');
     	});
    } else {
		$(this).find('span').text('+');
		$(this).css({
			'background-color': '#000',
			'color': '#fff'
		});
    }
});

// generate a random color
$('.btn-random').click(function(){
	let r = Math.floor((Math.random() * 255) + 1);
	let g = Math.floor((Math.random() * 255) + 1);
	let b = Math.floor((Math.random() * 255) + 1);
	let rgba = r+','+g+','+b+', 1';
	$(".selected").css('background-color', 'rgba(' + rgba + ')');
	color = $(".selected").css('background-color');
	$('#shadowBrush').css({
		backgroundColor: 'rgba(' + rgba + ')',
		borderColor: color
	});
});

//When clicking on control list items
controlsSection.on("click", "li", function() {
	//Deselect sibling elements
	$(".controls li").removeClass("selected");
	//Select clicked element
	$(this).addClass("selected");
	//cache current color
	color = $(this).css("background-color");
	$('#strokeBox').css('background-color', color);
	if ( $(this).hasClass('white') ) {
		$('#colorPicker').attr("disabled", true);
		stroke = 50;
		$('#strokeVal').text(stroke + ' px');
		$('#strokeBox').width(stroke);
		$('#strokeBox').height(stroke);
		$("#stroke").val(50);
	} else {
		$('#colorPicker').attr("disabled", false);
	}
});

function changeStroke() {
	stroke = $(this).val();
	$('#strokeVal').text(stroke + ' px');
	$('#strokeBox').width(stroke);
	$('#strokeBox').height(stroke);
	$('#shadowBrush').css({
		width: stroke,
		height: stroke
	});
}

function hexToRgb(hex) {
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	});

	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

let bgColor = $(".selected").css("background-color");

function changeOpacity() {
	opacityVal = $(this).val() / 100;
	console.log('opacityVal: ', opacityVal);
	
	console.log('bgColor: ', bgColor);
	let hex;
	if (String(bgColor).includes('rgb')) {
		hex = bgColor.split('(').pop().split(')')[0];
	} else {
		hex = hexToRgb(bgColor);
	}
	console.log('hex: ', hex);
	$(".selected").css("background-color", "rgba(" + hex +"," + opacityVal + ")");
	color = $(".selected").css("background-color");
	console.log('color: ', color);
	$('#opacityVal').text(opacityVal);
}

//When color sliders change
$("#stroke").on('input', changeStroke);
$("#opacity").on('input', changeOpacity);

//When "Add Color" is pressed
$("#addNewColor").click(function(){
	//Append the color to the controls ul
	let $newColor = $("<li></li>");
	$newColor.css("background-color", $("#colorPicker").val());
	$(".color-picker").append($newColor);
	//Select the new color
	$newColor.click();
});

//Touch Events Support Starts

function initTouchMoveCanvas() {
	touchmovezone = document.getElementById("canvas");
	touchmovezone.addEventListener("touchmove", drawTouchMove, false);
	touchmovezone.addEventListener("touchend", endTouchMove, false);
	touchmovezone.addEventListener("mousedown", function() {
		touchmovezone.addEventListener("mousemove", drawMouseMove, false);
	}, false);
	touchmovezone.addEventListener("mouseup", endMouseMove, false);
	touchMoveCTX = touchmovezone.getContext("2d");
}

  function drawTouchMove(e) {
    e.preventDefault();
    let offset  = $canvas.offset();
    if(lastPt !== null) {
		touchMoveCTX.beginPath();
		touchMoveCTX.strokeStyle = color;
		touchMoveCTX.lineWidth = stroke;
		touchMoveCTX.lineCap = "round";
		touchMoveCTX.lineJoin = "round";
		touchMoveCTX.moveTo(lastPt.x-offset.left, lastPt.y-offset.top);
		touchMoveCTX.lineTo(e.touches[0].pageX-offset.left, e.touches[0].pageY-offset.top);
		touchMoveCTX.stroke();
    }
    lastPt = {x:e.touches[0].pageX, y:e.touches[0].pageY};
  }

  function drawMouseMove(e) {
    e.preventDefault();
    let offset  = $canvas.offset();
    if(lastPt !== null) {
      touchMoveCTX.beginPath();
      touchMoveCTX.strokeStyle = color;
      touchMoveCTX.lineWidth = stroke;
      touchMoveCTX.lineCap = "round";
      touchMoveCTX.moveTo(lastPt.x-offset.left, lastPt.y-offset.top);
      touchMoveCTX.lineTo(e.pageX-offset.left, e.pageY-offset.top);
      touchMoveCTX.stroke();
    }
    lastPt = {x:e.pageX, y:e.pageY};
  }

  function endTouchMove(e) {
    e.preventDefault();
    lastPt = null;
  }

  function endMouseMove(e) {
    e.preventDefault();
    touchmovezone.removeEventListener("mousemove", drawMouseMove, false);
    lastPt = null;
  }

  function save() {
	document.getElementById("canvasimg").style.border = "2px solid";
	let dataURL = canvas.toDataURL();
	document.getElementById("canvasimg").src = dataURL;
	document.getElementById("canvasimg").style.display = "inline";
}

$('#clear, .btn-clear').click(function(){
    context.canvas.width = $(window).width();
    context.beginPath();
});
  