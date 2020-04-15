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

function handleColorPickerColorFieldLeftChange(){
    console.log("colorString");
    let colorString = document.getElementById("tool-colorPicker-left-colorInput").value;
    let r = parseInt(colorString.substr(1,2), 16);
    let g = parseInt(colorString.substr(3,2), 16);
    let b = parseInt(colorString.substr(5,2), 16);
    if(!isColorPickerLeftActive){
        isColorPickerLeftActive = true;
    }
    changeColor(rgba(r, g, b, leftColor.a));
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

////////////////////
// Event Listener //
////////////////////

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