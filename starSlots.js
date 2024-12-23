// put sounds on calculate payout
let jackpotHit = false
let twoTypesHit = false

const spinStartSound = new Audio('..\\soundboardFiles\\pomidorClock\\flash3.ogg');
const firstColumnHitSound = new Audio('..\\soundboardFiles\\pomidorClock\\flash3.ogg');
const secondColumnHitSound = new Audio('..\\soundboardFiles\\pomidorClock\\flash3.ogg');
const resultSound = new Audio('..\\soundboardFiles\\pomidorClock\\flash3.ogg');

// const jack1gif = "./img/queen1.gif"
const spinImgArr = [
    "./img/spin2.gif",
    "./img/spin3.gif",
    "./img/spin4.gif",
    "./img/spin5.gif"
]

// gets a random whole number between the min and max integers given as inputs
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function getRandItemFromArr(inputArr){
    const chosenIndex = (getRandInt(0, inputArr.length - 1))
    console.log(`spin arr idx => ${chosenIndex}`)
    return inputArr[chosenIndex]
}
  
function getSpaceValue(intMin, intMax){
    let d10Roll = getRandInt(intMin, intMax);
    if ((d10Roll == 1) || (d10Roll) == 2) {
        return [d10Roll, "Jack"]
    } else if ((d10Roll == 3) || (d10Roll) == 4) {
        return [d10Roll, "Queen"]
    } else if ((d10Roll == 5) || (d10Roll) == 6) {
        return [d10Roll, "King"]
    } else {
        console.log(`Anomaly occurred on dice roll (result of roll) => ${d10Roll} `)
    }
}

// expects and input Int. & gives an output array of tha many random numbers 
//    all will be between the intMin and intMax provided
function getArrayOfRandNums(arrSize=10, intMin=1, intMax=6){
    outArr = []
    for (let i = 1; i < arrSize; i++) {
        let rolledInfo = getSpaceValue(intMin, intMax)
        let rollVal = rolledInfo[0]
        let rolledIcon = rolledInfo[1]
        outArr.push(rolledIcon)
        // console.log(`Rolled ${rollVal} => ${rolledIcon}`);
      }
    // console.log("--------------")
    // console.log(outArr)
    return outArr
}


// assign indexes of output arr to correlate to the 9 slots available

// visual reference:
            // 0, 1, 2
            // 3, 4, 5
            // 6, 7, 8

const validLines = [
    [0, 1, 2], // topRow
    [3, 4, 5], // middleRow
    [6, 7, 8], // bottomRow
    [0, 4, 8], // hiToLoDiagonal
    [6, 4, 2]  // loToHiDiagonal
    // naught: [1, 3, 5, 7],
    // cross: [0, 2, 4, 6, 8]
    // zags, like 0, 4, 2 paying half?
]

const pointPayouts = {
    "Jack": 10,
    "Queen": 15,
    "King": 20
};

function determineLineName(lineIdx){
    if (lineIdx == 0){
        return "Top Row"
    } else if (lineIdx == 1){
        return "Middle Row"
    } else if (lineIdx == 2){
        return "Bottom Row"
    } else if (lineIdx == 3){
        return "High-to-low diagonal"
    } else if (lineIdx == 4){
        return "Low-to-high diagonal"
    } 
}

function updateColumn(columnIndex, spinResult, sound, final = false) {
    const slotDivs = document.querySelectorAll('.slot');
    for (let i = columnIndex; i < 9; i += 3) {
        const item = spinResult[i];
        const slotDiv = slotDivs[i];
        slotDiv.className = 'slot'; // Remove spinning effect
        slotDiv.innerHTML = `<img src="" alt="${item}">`;
    }
    sound.play();
    // use a boolean input on the laast one as the last param, "true" when it's the last reel
    if (final) {
        // the payout determine the results, or if it's a miss
        calculatePayout(spinResult);
    }
}

document.getElementById('spin-btn1').addEventListener('click', () => {
    const spinResult = getArrayOfRandNums(); // This returns the 3x3 spin result, an array 9 items long
    const payoutResultDiv = document.getElementById('payout-result');
    payoutResultDiv.innerHTML = 'spinning...'
    // could do an arr for multiple spin motions
    let spinningGif = getRandItemFromArr(spinImgArr)
    displaySpinBG(spinningGif)
    // NYI BG-img
    // const spinImgPath = getRandItemFromArr(spinImgArr)
    // displaySpinBG(spinImgPath)

    const slotMachine = document.getElementById('slot-machine');
    slotMachine.innerHTML = '';
    // Initially render empty slots with spinning effect
    for (let i = 0; i < 9; i++) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'slot spinning';
        slotMachine.appendChild(slotDiv);
    }
    
    
    // NYI START TO SPIN CLICKY SOUND
    // spinStartSound.play();


    // Delay logic for column reveals
    setTimeout(() => {
        updateColumn(0, spinResult, firstColumnHitSound);
        setTimeout(() => {
            updateColumn(1, spinResult, secondColumnHitSound);
            setTimeout(() => {
                updateColumn(2, spinResult, resultSound, true);
            }, 300);
        }, 300);
    }, 300);
    });

    function checkForAllOneItem(arr){
        // will return true if the board is blacked out as one value
        jackpotHit = arr.every(value => value === firstValue)
    }

    function calculatePayout(spinResult) {
        let totalPoints = 0;
        let hitLines = [];
        let uniqueIcons = new Set();
        let idxCounter = 0
        // Check for matches in valid lines
        validLines.forEach(line => {
            const [a, b, c] = line;
            if (spinResult[a] === spinResult[b] && spinResult[b] === spinResult[c]) {
                const iconHit = spinResult[a];
        // mention the index of the line (relting to the valid lines arr)
            // also note which icon got hit
                const tempArr = [determineLineName(idxCounter), iconHit];
                hitLines.push(tempArr);

                line.forEach(index => {
                    const slotDivs = document.querySelectorAll('.slot');
                    const slotDiv = slotDivs[index];
                    slotDiv.classList.add('highlight');
                    slotDiv.classList.add('grow');
                
                    setTimeout(() => {
                        slotDiv.classList.remove('grow');
                    }, 600);
                });
                
                
                uniqueIcons.add(iconHit);
            }
            
            idxCounter += 1
        });
        
        // console.log(`unique icons are --> ${uniqueIcons}`)
    
        // Calculate base points
        hitLines.forEach(hit => {
            console.log(`hit item payout --> ${pointPayouts[hit[1]]} for a ${hit[1]}`)
            totalPoints += pointPayouts[hit[1]];
        });
        
        let lineMultiplier = 1
        // Apply line-based multiplier
        if (hitLines.length > 1) {
            lineMultiplier = Math.pow(2, hitLines.length - 1);
            totalPoints *= lineMultiplier;
        }
    
        // Apply multi-item multiplier
        if (uniqueIcons.size === 2) {
            twoTypesHit = true
            totalPoints *= 2; // Two different types
        } else if (uniqueIcons.size === 3) {
            totalPoints *= 10; // Three different types
            jackpotHit = true
        }

        displayOutputHits(hitLines, totalPoints, lineMultiplier)
        //  NYI usee hitLines.length for seeing how many lines were hit...
        // use twoTypesHit to control output image
        // 
        // console.log(`multiplication amount => x${lineMultiplier}`)
    }
function displayOutputHits(hitLines, totalPoints, lineMultiplier){
    const payoutResultDiv = document.getElementById('payout-result');
        payoutResultDiv.innerHTML = '';

    if (hitLines.length > 0) {
        hitLines.forEach(hit => {
            console.log(`****** hit info = index should be => `)
            payoutResultDiv.innerHTML += `<p class="line-hit">${hit[0]} of ${hit[1]}s - Points: ${pointPayouts[hit[1]]}</p>`;
        });

        // if (multiplier === 100) {
        //     payoutResultDiv.innerHTML += `<p class="line-hit">Jackpot!</p>`;
        // }
    if (lineMultiplier > 1) {
        payoutResultDiv.innerHTML += `<p>Multi-line bonus!  x${lineMultiplier}</p>`
    }
    if (twoTypesHit) {
        payoutResultDiv.innerHTML += `<p>Different Suit bonus! x2</p>`
    }
        payoutResultDiv.innerHTML += `<p>Total Winnings: ${totalPoints}</p>`;
    } else {
        payoutResultDiv.innerHTML = '<p class="miss">Miss!</p>';
    }

    // Play the determined GIF with a delay
    // if (gifToPlay) {
    //     setTimeout(() => displayGifOverlay(gifToPlay), 1000);
    // }
}
    
    function displayGifOverlay(gifPath) {
        const slotMachine = document.getElementById('slot-machine');
    
        // Create a new overlay element
        const overlay = document.createElement('div');
        overlay.className = 'gif-overlay';
        overlay.style.backgroundImage = `url(${gifPath})`;
    
        // Add the overlay to the slot-machine container
        slotMachine.appendChild(overlay);
    
        // Remove the overlay after the GIF has played (assume 3 seconds duration)
        setTimeout(() => {
            slotMachine.removeChild(overlay);
        }, 3000);
    }
    
    function displaySpinBG(imgpath) {
        const displayScreen = document.getElementById('top-container');
        displayScreen.style.backgroundImage = `url(${imgpath})`;
        const overlay = document.createElement('div');
        overlay.className = 'text-overlay';
        overlay.textContent = "- spinning -"
        displayScreen.appendChild(overlay);
        // Remove the overlay after the GIF has played (assume 3 seconds duration)
        setTimeout(() => {
            displayScreen.style.backgroundImage = 'url(./img/ship1.png)';
            displayScreen.removeChild(overlay);
        }, 1200);
    }
    
