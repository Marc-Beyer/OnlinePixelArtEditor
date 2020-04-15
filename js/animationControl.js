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
function handleanimationControlPanelBtnNext(){
    setCurImg(curImg + 1);
}

//handle click on backBtn set the curImg -1
function handleanimationControlPanelBtnBack(){
    setCurImg(curImg - 1);
}

//handle click on playBtn
function handleanimationControlPanelBtnPlay(){
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

//Wait the animationspeed time anch change the curImg and putImageData in canvas. If isPlayingAnimation repeat
async function playAnimation(){
    setTimeout(function(){
        setCurImg(curImg + 1);
        if(isPlayingAnimation){
            playAnimation();
        }
    }, animationspeed);
}

//handle click on a animationImgBtn. Set curImg to index and putImageData in canvas 
function handleAnimationImgBtn(index){
    return () => {
        setCurImg(index);
        canvasContext.putImageData(imgs[curImg].imgData, 0, 0);
	};
}


////////////////////
// Event Listener //
////////////////////

//add eventlistener to animationControlPanelBtns
document.getElementById("tool-animationControl-panel-backBtn").addEventListener('click', handleanimationControlPanelBtnBack);
document.getElementById("tool-animationControl-panel-playBtn").addEventListener('click', handleanimationControlPanelBtnPlay);
document.getElementById("tool-animationControl-panel-nextBtn").addEventListener('click', handleanimationControlPanelBtnNext);

////////////////////
//      INIT      //
////////////////////

function initAnimationControler(){
    let animationControlContent = document.getElementById("tool-animationControl-content");
    for (let index = 0; index < imgs.length; index++) {
        let btn = document.createElement("button");
        btn.addEventListener('click', handleAnimationImgBtn(index));
        btn.textContent = imgs[index].name;
        btn.id = "tool-animationControl-content-btn" + index;
        if(curImg == index){
            btn.className = "active";
        }
        animationControlContent.appendChild(btn);
    }
}

initAnimationControler();