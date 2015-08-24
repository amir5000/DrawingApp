var color = $(".selected").css("background-color");
var $canvas = $("canvas");
var context = $canvas[0].getContext("2d");
var lastEvent;
var mouseDown = false;
var stroke = 15;

context.canvas.width = $('.container').width();
$('#strokeVal').text(stroke + ' px');
$('#strokeBox').width(stroke).css('background-color', color);
$(window).on('resize', function(){
  context.canvas.width = $('.container').width();
});


//When clicking on control list items
$(".controls").on("click", "li", function(){
  //Deselect sibling elements
  $(this).siblings().removeClass("selected");
  //Select clicked element
  $(this).addClass("selected");
  //cache current color
  color = $(this).css("background-color");
  $('#strokeBox').css('background-color', color);
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
  $("#newColor").css("background-color", "rgb(" + r + "," + g +", " + b + ")");
}

function changeStroke() {
  stroke = $(this).val();
  $('#strokeVal').text(stroke + ' px');
  $('#strokeBox').width(stroke);
}

//When color sliders change
$("#stroke").change(changeStroke);
$(".sliders input[type=range]").change(changeColor);

//When "Add Color" is pressed
$("#addNewColor").click(function(){
  //Append the color to the controls ul
  var $newColor = $("<li></li>");
  $newColor.css("background-color", $("#newColor").css("background-color"));
  $(".controls ul").append($newColor);
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
