//Is the animation playing right now.
let isPlayingAnimation = false;

//the speed the imgs are changing (milisecs)
let animationspeed = 500;

//reset all classnames of imgBtns
function resetImgBtnsClassName(){
    for (let index = 0; index < imgs.length; index++) {
        document.getElementById("tool-animationControl-content-btn" + index).className = "";
    }
}

//set the currentImage to nr and change the imgBtns
function setCurImg(nr){
    curImg = nr;
    if(curImg >= imgs.length){
        curImg = 0;
    } else if(curImg < 0){
        curImg = imgs.length-1;
    }
    canvasContext.putImageData(imgs[curImg].imgData, 0, 0);
    resetImgBtnsClassName();
    document.getElementById("tool-animationControl-content-btn" + curImg).className = "active";
}

//handle click on nextBtn set the curImg +1
function handleAnimationControlPanelBtnNext(){
    setCurImg(curImg + 1);
}

//handle click on backBtn set the curImg -1
function handleAnimationControlPanelBtnBack(){
    setCurImg(curImg - 1);
}

//handle click on playBtn
function handleAnimationControlPanelBtnPlay(){
    if(isPlayingAnimation){
        isPlayingAnimation = false;
        document.getElementById("tool-animationControl-panel-playBtn").textContent = ">";
        document.getElementById("tool-animationControl-panel-playBtn").style.background = "#ffffff";
        document.getElementById("tool-animationControl-panel-playBtn").style.border = "1px solid #ffffff";
    }else{
        isPlayingAnimation = true;
        playAnimation();
        document.getElementById("tool-animationControl-panel-playBtn").textContent = "||";
        document.getElementById("tool-animationControl-panel-playBtn").style.background = "#9e9e9e";
        document.getElementById("tool-animationControl-panel-playBtn").style.border = "1px solid #9e9e9e";
    }
}

//handle the click on addBtn
function handleAnimationControlPanelBtnAdd(){
    imgs.push({
        name: projectName + "_" + imgs.length, 
        imgData: canvasContext.createImageData(x, y)
    });
    initAnimationControler();
    setCurImg(imgs.length-1);
}

//handle the click on copyBtn
function handleAnimationControlPanelBtnCopy(){
    imgs.push({
        name: projectName + "_" + imgs.length, 
        imgData: canvasContext.getImageData(0, 0, x, y)
    });
    initAnimationControler();
    setCurImg(imgs.length-1);
}

//Wait the animationspeed time anch change the curImg and putImageData in canvas. If isPlayingAnimation repeat
async function playAnimation(){
    setTimeout(function(){
        if(isPlayingAnimation){
            setCurImg(curImg + 1);
            playAnimation();
        }
    }, animationspeed);
}

//update the imgData of the current animationBtnCanvas
function updateAnimationBtnCanvas(){
    document.getElementById("tool-animationControl-content-btn" + curImg + "-canvas").getContext("2d").putImageData(imgs[curImg].imgData, 0, 0);
}

//handle change of AnimationspeedSlider
function handleAnimationspeedSliderChange(){
    changeAnimationSpeed(document.getElementById("tool-animationControl-speed-slider").value);
}

//handle change of AnimationspeedSliderNumerField
function handleAnimationspeedSliderNumerFieldChange(){
    changeAnimationSpeed(document.getElementById("tool-animationControl-speed-sliderNumerField").value);
}

//change the animationspeed and update the silder
function changeAnimationSpeed(speed){
    animationspeed = speed*1000;
    document.getElementById("tool-animationControl-speed-slider").value = speed;
    document.getElementById("tool-animationControl-speed-sliderNumerField").value = speed;
}

////////////////////
// Event Listener //
////////////////////

//add eventlistener to animationControlPanelBtns
document.getElementById("tool-animationControl-panel-backBtn").addEventListener('click', handleAnimationControlPanelBtnBack);
document.getElementById("tool-animationControl-panel-playBtn").addEventListener('click', handleAnimationControlPanelBtnPlay);
document.getElementById("tool-animationControl-panel-nextBtn").addEventListener('click', handleAnimationControlPanelBtnNext);
document.getElementById("tool-animationControl-add-btn").addEventListener('click', handleAnimationControlPanelBtnAdd);
document.getElementById("tool-animationControl-copy-btn").addEventListener('click', handleAnimationControlPanelBtnCopy);

document.getElementById("tool-animationControl-speed-slider").onchange = handleAnimationspeedSliderChange;
document.getElementById("tool-animationControl-speed-sliderNumerField").onchange = handleAnimationspeedSliderNumerFieldChange;

////////////////////
//      INIT      //
////////////////////

function initAnimationControler(){
    let animationControlContent = document.getElementById("tool-animationControl-content");
    animationControlContent.innerHTML = ''; //TODO innerHTML is not stable
    for (let index = 0; index < imgs.length; index++) {
        animationControlContent.appendChild(getAnimationBtn(index));
    }
}

initAnimationControler();

////////////////////
//      BTNS      //
////////////////////

//returns an animationBtn 
function getAnimationBtn(index){
    let btn = document.createElement("div");
    btn.addEventListener('click', handleAnimationImgBtn(index));
    btn.id = "tool-animationControl-content-btn" + index;
    if(curImg == index){
        btn.className = "active";
    }
    btn.appendChild(getAnimationBtnCanvasNode(index));
    btn.appendChild(getTextNode(imgs[index].name));

    let div = document.createElement("div");
    div.appendChild(getUpBtn(index));
    div.appendChild(getDownBtn(index));
    div.appendChild(getDeleteBtn(index));
    btn.appendChild(div);

    return btn;
}

//handle click on a animationImgBtn. Set curImg to index and putImageData in canvas 
function handleAnimationImgBtn(index){
    return () => {
        setCurImg(index);
        canvasContext.putImageData(imgs[curImg].imgData, 0, 0);
	};
}

//returns a canvas
function getAnimationBtnCanvasNode(index){
    let animationBtnCanvasNode = document.createElement("canvas");
    animationBtnCanvasNode.id = "tool-animationControl-content-btn" + index + "-canvas";
    
    let animationBtnCanvasContext = animationBtnCanvasNode.getContext("2d");
    animationBtnCanvasContext.canvas.width = x;
    animationBtnCanvasContext.canvas.height = y;
    try {
        animationBtnCanvasContext.putImageData(imgs[index].imgData, 0, 0);
    } catch (error) {
        
    }
    return animationBtnCanvasNode;
}

//returns a TextNode
function getTextNode(text){
    let textNode = document.createElement("h4");
    textNode.textContent = text;
    return textNode;
}

//returns an delete Btn
function getDeleteBtn(index){
    let btn = document.createElement("button");
    btn.addEventListener('click', handleDeleteBtn(index));
    btn.textContent = "X";
    btn.className = "deleteBtn";
    return btn;
}

//handle click on a deleteBtn.
function handleDeleteBtn(index){
    return () => {
        if(imgs.length <= 1){
            throw new Error("There is just one element in the animationlist! You can't remove the last element!");
        }
        imgs.splice(index, 1);
        setCurImg(curImg);
        canvasContext.putImageData(imgs[curImg].imgData, 0, 0);
        initAnimationControler();
	};
}

//returns an Up Btn
function getUpBtn(index){
    let btn = document.createElement("button");
    btn.addEventListener('click', handleAnimatorBtnSwitch(index, index-1));
    btn.textContent = "^";
    btn.className = "upBtn";
    return btn;
}

//returns an Down Btn
function getDownBtn(index){
    let btn = document.createElement("button");
    btn.addEventListener('click', handleAnimatorBtnSwitch(index, index+1));
    btn.textContent = "v";
    btn.className = "downBtn";
    return btn;
}

//handle click on a up/downBtn. 
function handleAnimatorBtnSwitch(index1, index2){
    return () => {
        if(index1 < 0 || index2 < 0 || index1 >= imgs.length || index2 >= imgs.length)return;

        let tmpImg = imgs[index1];
        imgs[index1] = imgs[index2];
        imgs[index2] = tmpImg;
        initAnimationControler();
	};
}