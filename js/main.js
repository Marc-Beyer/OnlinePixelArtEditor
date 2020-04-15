//the size of the canvas
let x = 16;
let y = 16;

//canvasdata
let canvasContext;
let curImg = 0;
let imgs = [{
    name: "img", 
    imgData: undefined
}];
console.log("imgs", imgs);

//the main canvas
const canvas = document.getElementById("mainCanvas");

//The type of tool that is used
const DrawState = Object.freeze({
	PAINT: 0,
    ERASE: 1,
    SELECT: 2,
    MOVE: 3,
    FILL: 4,
    LINE: 5,
    SHAPE: 6,
    PICKER: 7
});

//curDrawState is of type DrawState
let curDrawState = DrawState.PAINT;

//is the user drawing right now
let isDrawing = false;

//the active color and 
let isColorPickerLeftActive = true;
let leftColor = {r:0,g:0,b:0,a:255};
let rightColor = {r:255,g:255,b:255,a:255};


function init(){
    getUrlParameter();

    if (canvas.getContext) {
        canvasContext = canvas.getContext("2d");
        canvasContext.canvas.width = x;
        canvasContext.canvas.height = y;
        //init all animationframes
        for (let index = 0; index < imgs.length; index++) {
            imgs[index].imgData = canvasContext.createImageData(x, y);
        }
        console.log("imgs", imgs);
        console.log("canvasContext", canvasContext);
        console.log("color", rgba(2, 2, 3, 0));

        isColorPickerLeftActive = false;
        changeColor(rgba(255, 255, 255, 255));
        isColorPickerLeftActive = true;
        changeColor(rgba(0, 0, 0, 255));
    }else{
        //canvas is not supported!
        alert('canvas is not supported! Please use a standart browser like firefox or chrome.');
        throw new Error('canvas is not supported!');
    }
}

//get the parameter of the url. parameters that are checked are: size, animationLength, name;
function getUrlParameter(){
    let urlParams = new URLSearchParams(window.location.search);
    let size = urlParams.get('size');
    if(size != null){
        x = parseInt(size);
        y = x;
    }
    let name = urlParams.get('name');
    if(name != null){
        imgs[curImg].name = name; 
    }else{
        name = "newImage";
    }
    let animationLength = urlParams.get('animationLength');
    if(animationLength != null){
        for (let index = 0; index < animationLength; index++) {
            imgs[index] = {
                name: name + "_" + index, 
                imgData: undefined
            }
        }
    }
}

//set the color of a pixel in imgs[curImg].imgData and put imgs[curImg].imgData in canvas
function setPixel(xPos, yPos, color, putImgData = true){
    xPos *= 4;
    xPos += yPos * 4 * x;
    imgs[curImg].imgData.data[xPos + 0] = color.r;
    imgs[curImg].imgData.data[xPos + 1] = color.g;
    imgs[curImg].imgData.data[xPos + 2] = color.b;
    imgs[curImg].imgData.data[xPos + 3] = color.a;
    if(putImgData)canvasContext.putImageData(imgs[curImg].imgData, 0, 0);
}

//get the color of the pixel on pos
function getColorOnPos(xPos, yPos){
    xPos *= 4;
    xPos += yPos * 4 * x;
    let r = imgs[curImg].imgData.data[xPos + 0];
    let g = imgs[curImg].imgData.data[xPos + 1];
    let b = imgs[curImg].imgData.data[xPos + 2];
    let a = imgs[curImg].imgData.data[xPos + 3];
    return rgba(r,g,b,a);
}

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

//r,g,b,a can be between 0 and 255
function rgba(r, g, b, a){
    let color = {};
    color.r = r;
    color.g = g;
    color.b = b;
    color.a = a;
    return color;
}

//checks if both colors match. Resturns true if both Alpha velues are 0
function rgbaEquals(color1, color2){
    //both are not visible -> return true
    if(parseInt(color1.a) === 0 && parseInt(color2.a) === 0)return true;

    //all values match -> return true
    if(parseInt(color1.r) === parseInt(color2.r) && parseInt(color1.g) === parseInt(color2.g) && parseInt(color1.b) === parseInt(color2.b) && parseInt(color1.a) === parseInt(color2.a))return true;

    //else return false;
    return false;

}

//get the current mousecolor
function getCurrentColor(isLeftclick = true){
    if(isLeftclick){
        return leftColor;
    }
    return rightColor;
}

//set the active color (isColorPickerLeftActive defines witch color is set)
function changeColor(color){
    document.getElementById("tool-colorPicker-rgba-r-slider").value = color.r;
    document.getElementById("tool-colorPicker-rgba-g-slider").value = color.g;
    document.getElementById("tool-colorPicker-rgba-b-slider").value = color.b;
    document.getElementById("tool-colorPicker-rgba-a-slider").value = color.a;

    document.getElementById("tool-colorPicker-rgba-r-sliderNumerField").value = color.r;
    document.getElementById("tool-colorPicker-rgba-g-sliderNumerField").value = color.g;
    document.getElementById("tool-colorPicker-rgba-b-sliderNumerField").value = color.b;
    document.getElementById("tool-colorPicker-rgba-a-sliderNumerField").value = color.a;
    try {
        let hexString = intToHex(color.r) + intToHex(color.g) + intToHex(color.b);
        console.log("hexString", hexString);
        document.getElementById("tool-colorPicker-rgba-hex-textField").value = hexString;
        if(isColorPickerLeftActive){
            document.getElementById("tool-colorPicker-left-colorInput").value = "#" + hexString;
            leftColor = color;
        }else{
            document.getElementById("tool-colorPicker-right-colorInput").value = "#" + hexString;
            rightColor = color;
        }
    } catch (error) {
        console.log("error", error);
    }
}

//converts an int to and hex
function intToHex(int){
    let hexString = "";
    if(int < 16){
        hexString = "0";
    }
    hexString += int.toString(16);
    return hexString;
}


////////////////////
// Event Listener //
////////////////////

//add eventlistener to downloadBtn
document.getElementById("downloadBtn").addEventListener('click', () =>{
    canvas.toBlob(function(blob){
        download(blob, imgs[curImg].name + ".png", ".png");
    });
});

document.addEventListener('paste', (e) => {
    let dataTransferItemList = e.clipboardData.items;
    console.log("dataTransferItemList", dataTransferItemList);
    for (const iterator of dataTransferItemList) {
        console.log("iterator", iterator);
    }
    let paste = (event.clipboardData || window.clipboardData).getData('text');
    console.log("paste", paste);
});

init();