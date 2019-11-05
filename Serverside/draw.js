var socket = io();
var canvas = document.getElementsByClassName("canvas");
var clearButton = document.getElementsByClassName("clearButton");
var context = canvas[0].getContext("2d");
var drawing = false;
var clear = false;

canvas.width = 700;
canvas.height = 500;

canvas[0].addEventListener("mousedown", onMouseDown, false);
canvas[0].addEventListener("mouseup", onMouseUp, false);
canvas[0].addEventListener("mousemove", onMouseMove, false);
clearButton[0].addEventListener("click", onButtonClick, false);
// clearButton[0].addEventListener("click", clearCanvas, false);
// clearButton[0].addEventListener("click", clear);

socket.on("drawing", onDrawingEvent);
socket.on("clear", onButtonClick)

var current = { x: 0, y: 0 };

// function clearCanvas(e) {
    // clear(true);
    // context.clearRect(0, 0, canvas.width, canvas.height);
// }

// function clear(emit) {
    // if (!emit) {
    //     return;
    // }
    // context.clearRect(0, 0, canvas.width, canvas.height);
    // socket.emit("clearCanvas");
// }


function drawLine(x0, y0, x1, y1, emit) {
context.beginPath();
context.moveTo(x0, y0);
context.lineTo(x1, y1);
context.lineWidth = 3;
context.stroke();
context.closePath();

if (!emit) {
    return;
}

socket.emit("drawing", {
    x0: x0 / canvas.width,
    y0: y0 / canvas.height,
    x1: x1 / canvas.width,
    y1: y1 / canvas.height
});
}

function clearCanvas(emit) {
    if (!emit) {
        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear");
}

function onDrawingEvent(data) {
drawLine(
    data.x0 * canvas.width,
    data.y0 * canvas.height,
    data.x1 * canvas.width,
    data.y1 * canvas.height
);
}

function onButtonClick(e) {
    clear = true;
    if (!clear) {
        return;
    }

    clearCanvas(true);
    clear = false;
}

function onMouseDown(e) {
drawing = true;
current.x = e.clientX;
current.y = e.clientY;
}

function onMouseUp(e) {
if (!drawing) {
    return;
}
drawing = false;
drawLine(current.x, current.y, e.clientX, e.clientY, true);
}

function onMouseMove(e) {
if (!drawing) {
    return;
}
drawLine(current.x, current.y, e.clientX, e.clientY, true);
current.x = e.clientX;
current.y = e.clientY;
}