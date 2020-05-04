let lastCanvasMousePos = {
    x: null,
    y: null
};
let startMouseDownCanvasPos = {
    x: null,
    y: null,
    isLeftclick: true
};


//transform globalMousePos to canvasMousePos
function mousePosToCanvas(mousePosX, mousePosY){
    let boundingClientRect = canvas.getBoundingClientRect();
    let xPos = mousePosX - boundingClientRect.x;
    let yPos = mousePosY - boundingClientRect.y;
    xPos = Math.floor(xPos * (x/boundingClientRect.width));
    yPos = Math.floor(yPos * (x/boundingClientRect.height));
    return {
        x: xPos,
        y: yPos
    }
}

//handle the mouseup event on canvas
function handleMouseUpEvent(e){
    let mouseUpCanvasPos = mousePosToCanvas(e.clientX, e.clientY);
    switch (curDrawState) {
        case DrawState.FILL:
            fill(mouseUpCanvasPos.x, mouseUpCanvasPos.y, getCurrentColor(startMouseDownCanvasPos.isLeftclick));
            break;
        case DrawState.LINE:
            drawLine(startMouseDownCanvasPos.x, startMouseDownCanvasPos.y, mouseUpCanvasPos.x, mouseUpCanvasPos.y, getCurrentColor(startMouseDownCanvasPos.isLeftclick));
            break;
        case DrawState.SHAPE:
            drawBox(startMouseDownCanvasPos.x, startMouseDownCanvasPos.y, mouseUpCanvasPos.x, mouseUpCanvasPos.y, getCurrentColor(startMouseDownCanvasPos.isLeftclick));
            break;
        case DrawState.PICKER:
            changeColor(getColorOnPos(mouseUpCanvasPos.x, mouseUpCanvasPos.y));
            handleToolSelectionPaint();
            break;
    }
    updateAnimationBtnCanvas();
}

//handle a click on canvas
function handleMouseEvent(e, isLeftclick = true){
    let mouseUpCanvasPos = mousePosToCanvas(e.clientX, e.clientY);
    switch (curDrawState) {
        case DrawState.PAINT:
            paintMouseHandler(e, isLeftclick);
            break;
        case DrawState.ERASE:
            eraseMouseHandler(e, isLeftclick);
            break;
        case DrawState.SELECT:
            break;
        case DrawState.MOVE:
            break;
        case DrawState.FILL:
            break;
        case DrawState.LINE:
            tmpDrawLine(startMouseDownCanvasPos.x, startMouseDownCanvasPos.y, mouseUpCanvasPos.x, mouseUpCanvasPos.y, getCurrentColor(startMouseDownCanvasPos.isLeftclick));
            break;
        case DrawState.SHAPE:
            tmpDrawBox(startMouseDownCanvasPos.x, startMouseDownCanvasPos.y, mouseUpCanvasPos.x, mouseUpCanvasPos.y, getCurrentColor(startMouseDownCanvasPos.isLeftclick));
            break;
        case DrawState.PICKER:
            break;
    }
    //set the lastCanvasMousePos to the current mousePos
    lastCanvasMousePos = mousePosToCanvas(e.clientX, e.clientY);
}


function shapeMouseHandler(e, isLeftclick){
    
}

function lineMouseHandler(e, isLeftclick){
    
}

function eraseMouseHandler(e, isLeftclick){
    let curCanvasMousePos = mousePosToCanvas(e.clientX, e.clientY);
    drawLine(lastCanvasMousePos.x, lastCanvasMousePos.y, curCanvasMousePos.x, curCanvasMousePos.y, rgba(0,0,0,0));
    lastCanvasMousePos = curCanvasMousePos;
}

function paintMouseHandler(e, isLeftclick){
    let curCanvasMousePos = mousePosToCanvas(e.clientX, e.clientY);
    drawLine(lastCanvasMousePos.x, lastCanvasMousePos.y, curCanvasMousePos.x, curCanvasMousePos.y, getCurrentColor(startMouseDownCanvasPos.isLeftclick));
    lastCanvasMousePos = curCanvasMousePos;
}

////////////////////
// Event Listener //
////////////////////

//add eventlistener to canvas
canvas.addEventListener('contextmenu', (e) => {
    //prevent contectmenu to show up on canvas
    e.preventDefault();
});
canvas.addEventListener('mousedown', e => {
    isDrawing = true;
    lastCanvasMousePos = mousePosToCanvas(e.clientX, e.clientY);
    startMouseDownCanvasPos = lastCanvasMousePos;
    startMouseDownCanvasPos.isLeftclick = e.buttons == 1;
    handleMouseEvent(e, e.buttons == 1);
});
canvas.addEventListener('mousemove', e => {
    if(isDrawing){
        handleMouseEvent(e, e.buttons == 1);
    }
});
canvas.addEventListener('mouseup', e => {
    isDrawing = false;
    handleMouseUpEvent(e);
});
canvas.addEventListener('mouseleave', e => {
    isDrawing = false;
});
canvas.addEventListener('mouseenter', e => {
    if(e.buttons == 1){
        isDrawing = true;
        handleMouseEvent(e, true);
    }else if(e.buttons == 2){
        isDrawing = true;
        handleMouseEvent(e, false);
    }
});