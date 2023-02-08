
const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8]
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

initializeGame();

function initializeGame(){
    cells.forEach(cell => {
        cell.addEventListener("click", cellAni);
    });
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function updateCell(cell, index){
    options[index - 1] = currentPlayer;

    cellClickup(cell);
}

function cellAni(){
    const cellIndex = this.getAttribute("cellIndex");
    
    if(options[cellIndex - 1] != "" || !running){
        return;
    }

    let canvasCell = document.createElement("canvas");
    canvasCell.id = `canvas_${(this.getAttribute("cellIndex"))}`;
    this.append(canvasCell);
    cvsCell = document.querySelector(`#canvas_${(this.getAttribute("cellIndex"))}`);
    cvsCell.style.position = "absolute";
    cvsCell.style.zIndex = -1;
    cvsCell.width = this.clientWidth;
    cvsCell.height = this.clientHeight;
    
    let ctx = cvsCell.getContext("2d");

    ctx.fillStyle = currentPlayer == "X" ? "lightblue" : "green";
    
    let x = this.clientWidth/2;
    let y = this.clientHeight/2;
    x2 = 0;
    y2 = 0;
    const promi = cell => new Promise((resolve) => {
        aniInter = setInterval(frame, 5);
        function frame(){
            console.log(x);
            console.log(x2);
            x = x - 2;
            y = y - 2;
            x2 = (cell.clientWidth/2 - x) * 2;
            y2 = (cell.clientHeight/2 - y) * 2;

            if(x <= 0 || y <= 0){
                clearInterval(aniInter);
                resolve();
            }

            ctx.fillRect(x, y, x2, y2);
            ctx.strokeRect(x, y, x2, y2);
        }
    });
    promi(this).then(() => updateCell(this, cellIndex));
}

function cellClickup(cell){
    ctx = document.querySelector(`#canvas_${cell.getAttribute("cellIndex")}`).getContext("2d");
    if(currentPlayer == "X"){
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(cell.clientWidth - 20, cell.clientHeight - 20);
        ctx.moveTo(cell.clientWidth - 20, 20);
        ctx.lineTo(20, cell.clientHeight - 20);
        ctx.stroke();
    }
    else{
        ctx.lineWidth = 8;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(cell.clientWidth/2, cell.clientHeight/2, cell.clientWidth/2 - 20, 0, 2 * Math.PI);
        ctx.stroke();
    }

    checkWinner();
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        console.log(`A: ${cellA} - B: ${cellB} - c: ${cellC}`);

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }
    console.log("------------------------");

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    }
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
    }
    else{
        changePlayer();
    }
}

function restartGame(){
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}