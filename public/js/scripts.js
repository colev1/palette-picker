document.addEventListener("DOMContentLoaded", generateAllPalettes);
document.addEventListener("DOMContentLoaded", fetchProjectNames);


var generateBtn = document.querySelector('.generate-btn')
var projectName = document.querySelector('.project-name')
var saveProjectBtn = document.querySelector('.proj-btn');
var newProjectInput = document.querySelector('.proj-input');
var select = document.querySelector('select');
let color1 = document.querySelector('.hex-1')
let color2 = document.querySelector('.hex-2')
let color3 = document.querySelector('.hex-3')
let color4 = document.querySelector('.hex-4')
let color5 = document.querySelector('.hex-5')


var savePaletteBtn = document.querySelector('.save-btn')
var paletteInput = document.querySelector('.palette-name')
var paletteOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
var lockButton = document.querySelectorAll('.fa-lock');

generateBtn.addEventListener('click', generateAllPalettes)
savePaletteBtn.addEventListener('click', savePalette)
saveProjectBtn.addEventListener('click', saveProject)
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

function fetchProjectNames () {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(result => displayProjectNames(result))
}

function displayProjectNames (projects) {
  select.options.length = projects.length;
  for (let i=0; i<projects.length; i++) {
    select.options[i] = new Option(`${projects[i].name}`, `${projects[i].id}`)
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
  console.log(select.value)
  const selectedProjectId = select.value;
  // projectName.innerHTML = paletteInput.value;
  // var div = document.createElement('div');
  // div.innerHTML = ``
  const postPalette = {
      palette: {
      palette_name: paletteInput,
      color_1: color1.innerText,
      color_2: color1.innerText,
      color_3: color1.innerText,
      color_4: color1.innerText,
      color_5: color1.innerText,
    }
  }
  
  fetch(`/api/v1/projects/${selectedProjectId}/palettes`, {
    method: 'POST',
    body: JSON.stringify(postPalette), 
    headers:  {
    'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(result => displayNewPalette(result))
    .catch(error => console.log(error))
}

function displayNewPalette (palette) {
  let paletteText = document.querySelector(`.${palette.project_id}`)
  console.log(paletteText)
  paletteText.innerHTML = palette.color_1
}

function saveProject () {
  const postObj = {
    project: {
      name: newProjectInput.value
    }
  };
  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify(postObj), // data can be `string` or {object}!
    headers:  {
    'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(result => displayNewProject(result))
    .catch(error => console.log(error))
    fetchProjectNames()
}

function displayNewProject (project) {
  var newProject = document.createElement('div');
  newProject.innerHTML = (`<div> 
    <h3 class='project-name'>  ${project.name} </h3>
    <p class=${project.id} > </p>
  </div>`);
  document.querySelector('.project').appendChild(newProject)
  newProjectInput.value = '';
}

function togglePalette (e) {
  e.target.classList.toggle('fa-lock');
  e.target.classList.toggle('fa-unlock');
  e.target.parentElement.classList.toggle('locked');
}