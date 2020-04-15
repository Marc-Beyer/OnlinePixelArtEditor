//handle a click on canvas
function handleMouseEvent(e, isLeftclick = true){
    switch (curDrawState) {
        case DrawState.PAINT:
            paintMouseHandler(e, isLeftclick);
            break;
        case DrawState.ERASE:
            eraseMouseHandler(e, isLeftclick);
            break;
        case DrawState.SELECT:
            eraseMouseHandler(e, isLeftclick);
            break;
        case DrawState.MOVE:
            eraseMouseHandler(e, isLeftclick);
            break;
        case DrawState.FILL:
            eraseMouseHandler(e, isLeftclick);
            break;
        case DrawState.LINE:
            lineMouseHandler(e, isLeftclick);
            break;
        case DrawState.SHAPE:
            shapeMouseHandler(e, isLeftclick);
            break;
    }
    
}

function shapeMouseHandler(e, isLeftclick){
    let boundingClientRect = canvas.getBoundingClientRect();
    boundingClientRect.width
    let xPos = e.clientX - boundingClientRect.x;
    let yPos = e.clientY - boundingClientRect.y;
    xPos = Math.floor(xPos * (x/boundingClientRect.width));
    yPos = Math.floor(yPos * (x/boundingClientRect.height));
    if(isLeftclick){
        setPixel(xPos, yPos, rgba(0,0,0,0));
    }else{
        setPixel(xPos, yPos, rgba(0,0,0,0));
    }
}

function lineMouseHandler(e, isLeftclick){
    let boundingClientRect = canvas.getBoundingClientRect();
    boundingClientRect.width
    let xPos = e.clientX - boundingClientRect.x;
    let yPos = e.clientY - boundingClientRect.y;
    xPos = Math.floor(xPos * (x/boundingClientRect.width));
    yPos = Math.floor(yPos * (x/boundingClientRect.height));
    if(isLeftclick){
        setPixel(xPos, yPos, rgba(0,0,0,0));
    }else{
        setPixel(xPos, yPos, rgba(0,0,0,0));
    }
}

function eraseMouseHandler(e, isLeftclick){
    let boundingClientRect = canvas.getBoundingClientRect();
    boundingClientRect.width
    let xPos = e.clientX - boundingClientRect.x;
    let yPos = e.clientY - boundingClientRect.y;
    xPos = Math.floor(xPos * (x/boundingClientRect.width));
    yPos = Math.floor(yPos * (x/boundingClientRect.height));
    if(isLeftclick){
        setPixel(xPos, yPos, rgba(0,0,0,0));
    }else{
        setPixel(xPos, yPos, rgba(0,0,0,0));
    }
}

function paintMouseHandler(e, isLeftclick){
    let boundingClientRect = canvas.getBoundingClientRect();
    boundingClientRect.width
    let xPos = e.clientX - boundingClientRect.x;
    let yPos = e.clientY - boundingClientRect.y;
    xPos = Math.floor(xPos * (x/boundingClientRect.width));
    yPos = Math.floor(yPos * (x/boundingClientRect.height));
    if(isLeftclick){
        setPixel(xPos, yPos, leftColor);
    }else{
        setPixel(xPos, yPos, rightColor);
    }
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
    handleMouseEvent(e, e.buttons == 1);
});
canvas.addEventListener('mousemove', e => {
    if(isDrawing){
        handleMouseEvent(e, e.buttons == 1);
    }
});
canvas.addEventListener('mouseup', e => {
    isDrawing = false;
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