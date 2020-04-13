let x = 16;
let y = 16;
let canvasContext;
let imgData;

const canvas = document.getElementById("mainCanvas");

let isDrawing = false;
let isColorPickerLeftActive = true;
let leftColor = {r:0,g:0,b:0,a:255};
let rightColor = {r:255,g:255,b:255,a:255};

function init(){
    if (canvas.getContext) {
        canvasContext = canvas.getContext("2d");
        canvasContext.canvas.width = x;
        canvasContext.canvas.height = y;
        imgData = canvasContext.createImageData(16, 16);
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

//handle a click on canvas
function handleMouseEvent(e, isLeftclick = true){
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

//r,g,b,a can be between 0 and 255
function rgba(r, g, b, a){
    let color = {};
    color.r = r;
    color.g = g;
    color.b = b;
    color.a = a;
    return color;
}

//ColorPicker handlers
function handleColorPickerSliderChange(){
    let r = parseInt(document.getElementById("tool-colorPicker-rgba-r-slider").value);
    let g = parseInt(document.getElementById("tool-colorPicker-rgba-g-slider").value);
    let b = parseInt(document.getElementById("tool-colorPicker-rgba-b-slider").value);
    let a = parseInt(document.getElementById("tool-colorPicker-rgba-a-slider").value);

    changeColor(rgba(r, g, b, a));
}

function handleColorPickerSliderNumerFieldChange(){
    let r = parseInt(document.getElementById("tool-colorPicker-rgba-r-sliderNumerField").value);
    let g = parseInt(document.getElementById("tool-colorPicker-rgba-g-sliderNumerField").value);
    let b = parseInt(document.getElementById("tool-colorPicker-rgba-b-sliderNumerField").value);
    let a = parseInt(document.getElementById("tool-colorPicker-rgba-a-sliderNumerField").value);
    
    changeColor(rgba(r, g, b, a));
}

function handleColorPickerHexTextFieldChange(){
    let hexString = document.getElementById("tool-colorPicker-rgba-hex-textField").value;
    let r = parseInt(hexString.substr(0,2), 16);
    let g = parseInt(hexString.substr(2,2), 16);
    let b = parseInt(hexString.substr(4,2), 16);

    let a = parseInt(document.getElementById("tool-colorPicker-rgba-a-slider").value);

    changeColor(rgba(r, g, b, a));
}

//colorPicker handler
function handleColorPickerLeft(){
    isColorPickerLeftActive = true;
    changeColor(leftColor);
    document.getElementById("tool-colorPicker-left").className = "active";
    document.getElementById("tool-colorPicker-right").className = "";
}
function handleColorPickerRight(){
    isColorPickerLeftActive = false;
    changeColor(rightColor);
    document.getElementById("tool-colorPicker-left").className = "";
    document.getElementById("tool-colorPicker-right").className = "active";
}
function handleColorPickerColorFieldLeftChange(){
    console.log("colorString");
    let colorString = document.getElementById("tool-colorPicker-left-colorInput").value;
    let r = parseInt(colorString.substr(1,2), 16);
    let g = parseInt(colorString.substr(3,2), 16);
    let b = parseInt(colorString.substr(5,2), 16);
    if(!isColorPickerLeftActive){
        isColorPickerLeftActive = true;
    }
    changeColor(rgba(r, g, b, rightColor.a));
}

function handleColorPickerColorFieldRightChange(){
    console.log("colorString");
    let colorString = document.getElementById("tool-colorPicker-right-colorInput").value;
    let r = parseInt(colorString.substr(1,2), 16);
    let g = parseInt(colorString.substr(3,2), 16);
    let b = parseInt(colorString.substr(5,2), 16);
    if(isColorPickerLeftActive){
        isColorPickerLeftActive = false;
    }
    changeColor(rgba(r, g, b, rightColor.a));
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

//add eventlistener to colorpickerslider
document.getElementById("tool-colorPicker-rgba-r-slider").onchange = handleColorPickerSliderChange;
document.getElementById("tool-colorPicker-rgba-g-slider").onchange = handleColorPickerSliderChange;
document.getElementById("tool-colorPicker-rgba-b-slider").onchange = handleColorPickerSliderChange;
document.getElementById("tool-colorPicker-rgba-a-slider").onchange = handleColorPickerSliderChange;
document.getElementById("tool-colorPicker-rgba-r-sliderNumerField").onchange = handleColorPickerSliderNumerFieldChange;
document.getElementById("tool-colorPicker-rgba-g-sliderNumerField").onchange = handleColorPickerSliderNumerFieldChange;
document.getElementById("tool-colorPicker-rgba-b-sliderNumerField").onchange = handleColorPickerSliderNumerFieldChange;
document.getElementById("tool-colorPicker-rgba-a-sliderNumerField").onchange = handleColorPickerSliderNumerFieldChange;
document.getElementById("tool-colorPicker-rgba-hex-textField").onchange = handleColorPickerHexTextFieldChange;
document.getElementById("tool-colorPicker-left-colorInput").onchange = handleColorPickerColorFieldLeftChange;
document.getElementById("tool-colorPicker-right-colorInput").onchange = handleColorPickerColorFieldRightChange;

document.getElementById("tool-colorPicker-left").addEventListener('click', handleColorPickerLeft);
document.getElementById("tool-colorPicker-right").addEventListener('click', handleColorPickerRight);

init();