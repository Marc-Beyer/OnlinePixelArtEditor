//the size of the canvas
let x = 16;
let y = 16;

//canvasdata
let canvasContext;
let imgData;

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
    SHAPE: 6
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
        imgData = canvasContext.createImageData(x, y);
        console.log("canvasContext", canvasContext);
        console.log("color", rgba(2, 2, 3, 0));
        
        canvasContext.fillStyle = "#FF0000";
        canvasContext.fillRect(3, 5, 1, 3);
        setPixel(0, 0, rgba(255, 2, 3, 255));

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

//get the parameter of the url. parameters that are checked are: size, animationLength;
function getUrlParameter(){
    let urlParams = new URLSearchParams(window.location.search);
    let size = urlParams.get('size');
    if(size != null){
        x = parseInt(size);
        y = x;
    }
    let animationLength = urlParams.get('animationLength');
    if(animationLength != null){
        //TODO
    }
}

//set the color of a pixel in imgData and put imgData in canvas
function setPixel(xPos, yPos, color){
    xPos *= 4;
    xPos += yPos * 4 * x;
    imgData.data[xPos + 0] = color.r;
    imgData.data[xPos + 1] = color.g;
    imgData.data[xPos + 2] = color.b;
    imgData.data[xPos + 3] = color.a;
    canvasContext.putImageData(imgData, 0, 0);
}

//draws a line from pos1 to pos2 in imgData and put imgData in canvas
function drawLine(xPos1, yPos1, xPos2, yPos2, color){
    setPixel(xPos1, yPos1, color);

    setPixel(xPos2, yPos2, color);
}

//draws a box from pos1 to pos2 in imgData and put imgData in canvas
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
    for (let x = xPos1; x < xPos2; x++) {
        for (let y = yPos1; y < yPos2; y++) {
            setPixel(x, y, color);
        }
    }
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
        download(blob, "img.png", ".png");
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