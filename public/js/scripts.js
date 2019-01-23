var generateBtn = document.querySelector('.generate-btn')
var savePaletteBtn = document.querySelector('.save-btn')
var paletteInput = document.querySelector('.palette-name')

generateBtn.addEventListener('click', generateNewPalette)
savePaletteBtn.addEventListener('click', savePalette)

function generateNewPalette () {
  console.log('new palette')
}

function savePalette () {
  console.log(paletteInput.value)
}