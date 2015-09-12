var color = $(".selected").css("background-color");
var $canvas = $("canvas");
var context = $canvas[0].getContext("2d");
var lastEvent;
var canvas;
var ctx;
var lastPt=null;
var mouseDown = false;
var stroke = 7;
var opacityVal = 100;
opacityVal = opacityVal / 100;

context.canvas.width = $(window).width();
$('#strokeVal').text(stroke + ' px');
$('#strokeBox').width(stroke).css('background-color', color);
$('#opacityVal').text(opacityVal);
$(window).on('resize', function(){
  context.canvas.width = $(window).width();
});


//When clicking on control list items
$(".controls").on("click", "li", function(){
  //Deselect sibling elements
  $(".controls li").removeClass("selected");
  //Select clicked element
  $(this).addClass("selected");
  //cache current color
  color = $(this).css("background-color");
  $('#strokeBox').css('background-color', color);
  if ( $(this).hasClass('white') ) {
    $('#strokeBox').css('border', '1px solid #000');
  } else {
    $('#strokeBox').css('border', 'none');
  }
});

//When "New Color" is pressed
$("#revealColorSelect").click(function(){
  //Show color select or hide the color select
  changeColor();
  $("#colorSelect").slideToggle();
});

//update the new color span
function changeColor() {
  var r = $("#red").val();
  var g = $("#green").val();
  var b = $("#blue").val();
  var opacity = $("#opacity").val() / 100;
  $("#newColor").css("background-color", "rgba(" + r + "," + g +", " + b + ", " + opacity + ")");
}

function changeStroke() {
  stroke = $(this).val();
  $('#strokeVal').text(stroke + ' px');
  $('#strokeBox').width(stroke);
}

function changeOpacity() {
  opacityVal = $(this).val() / 100;
  var r = $("#red").val();
  var g = $("#green").val();
  var b = $("#blue").val();
  var opacity = opacityVal;
  $(".selected").css("background-color", "rgba(" + r + "," + g +", " + b + ", " + opacity + ")");
  color = $(".selected").css("background-color");
  $('#opacityVal').text(opacityVal);
}

//When color sliders change
$("#stroke").change(changeStroke);
$(".sliders input[type=range]").change(changeColor);
$("#opacity").change(changeOpacity);

//When "Add Color" is pressed
$("#addNewColor").click(function(){
  //Append the color to the controls ul
  var $newColor = $("<li></li>");
  $newColor.css("background-color", $("#newColor").css("background-color"));
  $(".color-picker").append($newColor);
  //Select the new color
  $newColor.click();
});

function init() {
  var touchzone = document.getElementById("canvas");
  touchzone.addEventListener("touchmove", draw, false);
  touchzone.addEventListener("touchend", end, false);
  ctx = touchzone.getContext("2d");
}

function draw(e) {
  e.preventDefault();
  if(lastPt!=null) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = stroke;
    ctx.lineCap = "round";
    ctx.moveTo(lastPt.x, lastPt.y);
    ctx.lineTo(e.touches[0].pageX, e.touches[0].pageY);
    ctx.stroke();
  }
  lastPt = {x:e.touches[0].pageX, y:e.touches[0].pageY};
}

function end(e) {
  e.preventDefault();
  // Terminate touch path
  lastPt=null;
}
