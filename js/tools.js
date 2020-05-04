function fill(xPos, yPos, color){
    let baseColor = getColorOnPos(xPos, yPos);
    console.log(baseColor);
    console.log(color);
    console.log("baseColor == color", baseColor == color);
    console.log("baseColor === color", baseColor === color);
    console.log("rgbaEquals(baseColor, color)", rgbaEquals(baseColor, color));
    if(rgbaEquals(baseColor, color))return;

    try {
        fillNeighborWithSameBaseColor(xPos, yPos, baseColor, color);
    } catch (error) {
        console.error(error);
    }
    canvasContext.putImageData(imgs[curImg].imgData, 0, 0);
}

//get all neighbors eith the same color and fill them with the color
function fillNeighborWithSameBaseColor(xPos, yPos, baseColor, color){
    let curXPos = xPos;
    let curYPos = yPos;
    let neighbors = [{x: xPos, y: yPos}];
    setPixel(xPos, yPos, color, false);
    while(neighbors.length > 0){
        let pos = neighbors.pop();
        if(checkPixelForFill(pos.x-1, pos.y, baseColor, color)){
            neighbors.push({x: pos.x-1, y: pos.y});
        }
        if(checkPixelForFill(pos.x+1, pos.y, baseColor, color)){
            neighbors.push({x: pos.x+1, y: pos.y});
        }
        if(checkPixelForFill(pos.x, pos.y-1, baseColor, color)){
            neighbors.push({x: pos.x, y: pos.y-1});
        }
        if(checkPixelForFill(pos.x, pos.y+1, baseColor, color)){
            neighbors.push({x: pos.x, y: pos.y+1});
        }
    }
}

//checks if the pixel has to be filled 
function checkPixelForFill(xPos, yPos, baseColor, color){
    if(xPos < 0 || yPos < 0)return false;
    if(xPos >= x || yPos >= y)return false;
    if(rgbaEquals(getColorOnPos(xPos, yPos), baseColor)){
        setPixel(xPos, yPos, color, false);
        return true;
    }
    return false;
}

//draws a line from pos1 to pos2 in imgs[curImg].imgData and put imgs[curImg].imgData in canvas
function drawLine(xPos1, yPos1, xPos2, yPos2, color) {
    let w = Math.abs(xPos2 - xPos1);
    let h = Math.abs(yPos2 - yPos1);
    let sx = (xPos1 < xPos2) ? 1 : -1;
    let sy = (yPos1 < yPos2) ? 1 : -1;
    let err = w - h;
 
    while(true) {
       setPixel(xPos1, yPos1, color, false);
       if ((xPos1 === xPos2) && (yPos1 === yPos2)) break;
       let e2 = 2*err;
       if (e2 > -h) { err -= h; xPos1  += sx; }
       if (e2 < w) { err += w; yPos1  += sy; }
    }
    canvasContext.putImageData(imgs[curImg].imgData, 0, 0);
}

//draws a line from pos1 to pos2 in tmpImgData and put tmpImgData in canvas
function tmpDrawLine(xPos1, yPos1, xPos2, yPos2, color) {
    canvasContext.putImageData(imgs[curImg].imgData, 0, 0);
    tmpImgData = canvasContext.getImageData(0, 0, x, y);
    let w = Math.abs(xPos2 - xPos1);
    let h = Math.abs(yPos2 - yPos1);
    let sx = (xPos1 < xPos2) ? 1 : -1;
    let sy = (yPos1 < yPos2) ? 1 : -1;
    let err = w - h;
 
    while(true) {
       tmpSetPixel(xPos1, yPos1, color, false);
       if ((xPos1 === xPos2) && (yPos1 === yPos2)) break;
       let e2 = 2*err;
       if (e2 > -h) { err -= h; xPos1  += sx; }
       if (e2 < w) { err += w; yPos1  += sy; }
    }
    canvasContext.putImageData(tmpImgData, 0, 0);
}

//draws a line (with) from pos1 to pos2 in imgs[curImg].imgData and put imgs[curImg].imgData in canvas
function drawLineFuzzy(xPos1, yPos1, xPos2, yPos2, color, lineWidth){
    canvasContext.beginPath();
    let hexString = intToHex(color.r) + intToHex(color.g) + intToHex(color.b);
    canvasContext.strokeStyle = '#' + hexString;
    canvasContext.lineWidth = lineWidth;
    canvasContext.translate(0.5,0.5);
    canvasContext.moveTo(xPos1, yPos1);
    canvasContext.lineTo(xPos2, yPos2);
    canvasContext.stroke(); 
    console.log("canvasContext",canvasContext);
    console.log("canvasContext data", canvasContext.getImageData(0, 0, x, y));
    
    imgs[curImg].imgData = canvasContext.getImageData(0, 0, x, y);
    canvasContext.putImageData(imgs[curImg].imgData, 0, 0);
}

//draws a box from pos1 to pos2 in imgs[curImg].imgData and put imgs[curImg].imgData in canvas
function drawBox(xPos1, yPos1, xPos2, yPos2, color){
    //check if xPos1 is greater then xPos2. If true change xPos1 and xPos2
    if(xPos1 > xPos2){
        let xTemp = xPos2;
        xPos2 = xPos1;
        xPos1 = xTemp;
    }
    //check if yPos1 is greater then yPos2. If true change yPos1 and yPos2
    if(yPos1 > yPos2){
        let yTemp = yPos2;
        yPos2 = yPos1;
        yPos1 = yTemp;
    }
    //set the correct color to all pixel between pos1 and pos2
    for (let x = xPos1; x < xPos2+1; x++) {
        for (let y = yPos1; y < yPos2+1; y++) {
            setPixel(x, y, color, false);
        }
    }
    canvasContext.putImageData(imgs[curImg].imgData, 0, 0);
}

//draws a box from pos1 to pos2 in imgs[curImg].imgData and put imgs[curImg].imgData in canvas
function tmpDrawBox(xPos1, yPos1, xPos2, yPos2, color){
    canvasContext.putImageData(imgs[curImg].imgData, 0, 0);
    tmpImgData = canvasContext.getImageData(0, 0, x, y);
    //check if xPos1 is greater then xPos2. If true change xPos1 and xPos2
    if(xPos1 > xPos2){
        let xTemp = xPos2;
        xPos2 = xPos1;
        xPos1 = xTemp;
    }
    //check if yPos1 is greater then yPos2. If true change yPos1 and yPos2
    if(yPos1 > yPos2){
        let yTemp = yPos2;
        yPos2 = yPos1;
        yPos1 = yTemp;
    }
    //set the correct color to all pixel between pos1 and pos2
    for (let x = xPos1; x < xPos2+1; x++) {
        for (let y = yPos1; y < yPos2+1; y++) {
            tmpSetPixel(x, y, color, false);
        }
    }
    canvasContext.putImageData(tmpImgData, 0, 0);
}