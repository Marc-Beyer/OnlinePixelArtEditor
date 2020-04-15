//ToolSelectionHandler
function handleToolSelectionPaint(){
    resetAllToolselectionClasses();
    document.getElementById("tool-toolSelector-paint").className = "active";
    curDrawState = DrawState.PAINT;
}

function handleToolSelectionErase(){
    resetAllToolselectionClasses();
    document.getElementById("tool-toolSelector-erase").className = "active";
    curDrawState = DrawState.ERASE;
}

function handleToolSelectionSelect(){
    resetAllToolselectionClasses();
    document.getElementById("tool-toolSelector-select").className = "active";
    curDrawState = DrawState.SELECT;
}

function handleToolSelectionMove(){
    resetAllToolselectionClasses();
    document.getElementById("tool-toolSelector-move").className = "active";
    curDrawState = DrawState.MOVE;
}

function handleToolSelectionFill(){
    resetAllToolselectionClasses();
    document.getElementById("tool-toolSelector-fill").className = "active";
    curDrawState = DrawState.FILL;
}

function handleToolSelectionLine(){
    resetAllToolselectionClasses();
    document.getElementById("tool-toolSelector-line").className = "active";
    curDrawState = DrawState.FILL;
}

function handleToolSelectionShape(){
    resetAllToolselectionClasses();
    document.getElementById("tool-toolSelector-shape").className = "active";
    curDrawState = DrawState.FILL;
}

//set the classname of all toolSelector elements to emptyString
function resetAllToolselectionClasses(){
    document.getElementById("tool-toolSelector-paint").className = "";
    document.getElementById("tool-toolSelector-erase").className = "";
    document.getElementById("tool-toolSelector-select").className = "";
    document.getElementById("tool-toolSelector-move").className = "";
    document.getElementById("tool-toolSelector-fill").className = "";
    document.getElementById("tool-toolSelector-line").className = "";
    document.getElementById("tool-toolSelector-shape").className = "";
}

////////////////////
// Event Listener //
////////////////////

document.getElementById("tool-toolSelector-paint").addEventListener('click', handleToolSelectionPaint);
document.getElementById("tool-toolSelector-erase").addEventListener('click', handleToolSelectionErase);
document.getElementById("tool-toolSelector-select").addEventListener('click', handleToolSelectionSelect);
document.getElementById("tool-toolSelector-move").addEventListener('click', handleToolSelectionMove);
document.getElementById("tool-toolSelector-fill").addEventListener('click', handleToolSelectionFill);
document.getElementById("tool-toolSelector-line").addEventListener('click', handleToolSelectionLine);
document.getElementById("tool-toolSelector-shape").addEventListener('click', handleToolSelectionShape);