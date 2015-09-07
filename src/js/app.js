var color = $(".selected").css("background-color");
var $canvas = $("canvas");
var context = $canvas[0].getContext("2d");
var lastEvent;
var mouseDown = false;
var stroke = 7;
var opacityVal = 100;
opacityVal = opacityVal / 100;

context.canvas.width = $('.container').width();
$('#strokeVal').text(stroke + ' px');
$('#strokeBox').width(stroke).css('background-color', color);
$('#opacityVal').text(opacityVal);
$(window).on('resize', function(){
  context.canvas.width = $('.container').width();
});


//When clicking on control list items
$(".controls").on("click", "li", function(){
  //Deselect sibling elements
  console.log($(this));
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

//On mouse events on the canvas
$canvas.mousedown(function(e){
  lastEvent = e;
  mouseDown = true;
}).mousemove(function(e){
  //Draw lines
  if(mouseDown) {
    context.beginPath();
    context.moveTo(lastEvent.offsetX, lastEvent.offsetY);
    context.lineTo(e.offsetX, e.offsetY);
    context.strokeStyle = color;
    context.lineWidth = stroke;
    context.stroke();
    lastEvent = e;
  }
}).mouseup(function(){
  mouseDown = false;
}).mouseleave(function(){
  $canvas.mouseup();
});
