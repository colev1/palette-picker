document.addEventListener("DOMContentLoaded", generateAllPalettes);

var generateBtn = document.querySelector('.generate-btn')
var savePaletteBtn = document.querySelector('.save-btn')
var paletteInput = document.querySelector('.palette-name')
var paletteOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
var lockButton = document.querySelectorAll('.fa-lock');

generateBtn.addEventListener('click', generateAllPalettes)
savePaletteBtn.addEventListener('click', savePalette)
lockButton.forEach(element => {
  element.addEventListener('click', togglePalette)
})

function generateAllPalettes() {
  let palettesArray = [];
  for(let i=0; i<5; i++) {
    let newPalette = generateNewPalette();
    palettesArray.push(newPalette)
  }
  let allHexes = document.querySelectorAll('.hex');
  let allCircles = document.querySelectorAll('.circle');
  for(let i=0; i<allHexes.length; i++) {
    if(!allCircles[i].classList.contains('locked')) {
      allHexes[i].innerHTML = `#${palettesArray[i]}`
      allCircles[i].style.backgroundColor = `#${palettesArray[i]}`
    }
  }
}

function generateNewPalette () {
    let randomHex = [];
    let newHex;
      for (let i=0; i< 6; i++) {
      let randomVal = paletteOptions[Math.floor(Math.random() * paletteOptions.length)];
      randomHex.push(randomVal);
      newHex = randomHex.join('').toUpperCase();
    }
    return newHex
}

function savePalette () {
  console.log(paletteInput.value)
}

function togglePalette (e) {
  e.target.classList.toggle('fa-lock');
  e.target.classList.toggle('fa-unlock');
  e.target.parentElement.classList.toggle('locked');
}