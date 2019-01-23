var generateBtn = document.querySelector('.generate-btn')
var savePaletteBtn = document.querySelector('.save-btn')
var paletteInput = document.querySelector('.palette-name')
var paletteOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

generateBtn.addEventListener('click', generateNewPalette)
savePaletteBtn.addEventListener('click', savePalette)

function generateNewPalette () {
  let randomHex = [];
  for (var i=0; i< 6; i++) {
    let randomVal = paletteOptions[Math.floor(Math.random() * paletteOptions.length)];
    randomHex.push(randomVal);
  }
  let newHex = randomHex.join('').toUpperCase();
  document.querySelector('.hex-1').innerHTML = `#${newHex}`;
  document.querySelector('.circle').style.backgroundColor = `#${newHex}`;
}

function savePalette () {
  console.log(paletteInput.value)
}