var color = $(".selected").css("background-color");
var $canvas = $("canvas");
var controlsSection = $(".controls");
var context = $canvas[0].getContext("2d");
var lastEvent;
var touchmovezone;
var touchmovectx;
var lastPt = null;
var mouseDown = false;
var stroke = 2;
var opacityVal = 100;
opacityVal = opacityVal / 100;


$('#strokeVal').text(stroke + ' px');
$('#strokeBox').width(stroke).height(stroke).css('background-color', color);
$('#opacityVal').text(opacityVal);
$(window).on('resize load', function(){
  context.canvas.width = $(window).width();
  context.canvas.height = $(window).height();
});
$('.controls-btn').on('click', function() {

  controlsSection.toggleClass('open close');
    if (controlsSection.hasClass('open')){
      $(this).text('-').css({
        'background-color': '#fff',
        'color': '#000'
      });
    } else {
      $(this).text('+').css({
        'background-color': '#000',
        'color': '#fff'
      });
    }
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
    $('#revealColorSelect').attr("disabled", true);
    stroke = 50;
  } else {
    $('#revealColorSelect').attr("disabled", false);
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
  $('#strokeBox').height(stroke);
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var bgcolor = $(".selected").css("background-color");

function changeOpacity() {
  opacityVal = $(this).val() / 100;
  var hex = hexToRgb(bgcolor);
  $(".selected").css("background-color", "rgba(" + hex +"," + opacityVal + ")");
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

//Touch Events Support Starts

function initTouchMoveCanvas() {
  touchmovezone = document.getElementById("canvas");
  touchmovezone.addEventListener("touchmove", drawtouchmove, false);
  touchmovezone.addEventListener("touchend", endtouchmove, false);
  touchmovezone.addEventListener("mousedown", function() {
    touchmovezone.addEventListener("mousemove", drawmousemove, false);
  }, false);
  touchmovezone.addEventListener("mouseup", endmousemove, false);
  touchmovectx = touchmovezone.getContext("2d");
}

  function drawtouchmove(e) {
    e.preventDefault();
    var offset  = $canvas.offset();
    if(lastPt !== null) {
      touchmovectx.beginPath();
      touchmovectx.strokeStyle = color;
      touchmovectx.lineWidth = stroke;
      touchmovectx.lineCap = "round";
      touchmovectx.lineJoin = "round";
      touchmovectx.moveTo(lastPt.x-offset.left, lastPt.y-offset.top);
      touchmovectx.lineTo(e.touches[0].pageX-offset.left, e.touches[0].pageY-offset.top);
      touchmovectx.stroke();
    }
    lastPt = {x:e.touches[0].pageX, y:e.touches[0].pageY};
  }

  function drawmousemove(e) {
    e.preventDefault();
    var offset  = $canvas.offset();
    if(lastPt !== null) {
      touchmovectx.beginPath();
      touchmovectx.strokeStyle = color;
      touchmovectx.lineWidth = stroke;
      touchmovectx.lineCap = "round";
      touchmovectx.moveTo(lastPt.x-offset.left, lastPt.y-offset.top);
      touchmovectx.lineTo(e.pageX-offset.left, e.pageY-offset.top);
      touchmovectx.stroke();
    }
    lastPt = {x:e.pageX, y:e.pageY};
  }

  function endtouchmove(e) {
    e.preventDefault();
    lastPt = null;
  }

  function endmousemove(e) {
    e.preventDefault();
    touchmovezone.removeEventListener("mousemove", drawmousemove, false);
    lastPt = null;
  }

  $('#clear').click(function(){
    context.canvas.width = $(window).width();
    context.beginPath();
  });
