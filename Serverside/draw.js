var socket = io();
var canvas = document.getElementsByClassName("canvas");
var context = canvas[0].getContext("2d");
var drawing = false;

canvas.width = 700;
canvas.height = 500;

canvas[0].addEventListener("mousedown", onMouseDown, false);
canvas[0].addEventListener("mouseup", onMouseUp, false);
canvas[0].addEventListener("mousemove", onMouseMove, false);

socket.on("drawing", onDrawingEvent);

var current = { x: 0, y: 0 };

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

function onDrawingEvent(data) {
drawLine(
    data.x0 * canvas.width,
    data.y0 * canvas.height,
    data.x1 * canvas.width,
    data.y1 * canvas.height
);
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