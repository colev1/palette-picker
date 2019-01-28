document.addEventListener("DOMContentLoaded", generateAllPalettes);
document.addEventListener("DOMContentLoaded", fetchProjectNames);

var generateBtn = document.querySelector('.generate-btn')
var projectName = document.querySelector('.project-name')
var saveProjectBtn = document.querySelector('.proj-btn');
var newProjectInput = document.querySelector('.proj-input');
var smallPalettes = document.querySelector('.project');
var allHexes = document.querySelectorAll('.hex');
var allCircles = document.querySelectorAll('.circle');

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
smallPalettes.addEventListener('click', displaySinglePalette)

function generateAllPalettes () {
  let palettesArray = [];
  for(let i=0; i<5; i++) {
    let newPalette = generateNewPalette();
    palettesArray.push(newPalette)
  }
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
  document.querySelector('.project').innerText = '';
  for (let i=0; i < projects.length; i++) {
    select.options[i] = new Option(`${projects[i].name}`, `${projects[i].id}`)
    displayNewProject(projects[i])
    fetchPalettes(projects[i].id)
  }
}

function fetchPalettes (id) {
  
  fetch(`/api/v1/projects/${id}/palettes`)
    .then(response => response.json())
    .then(result => displayPalettes(result))
}

function displayPalettes (palettes) {
  palettes.forEach(palette => {
    displayNewPalette(palette)
  })
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
  const selectedProjectId = select.value;
  const postPalette = {
      palette: {
      palette_name: paletteInput.value,
      color_1: color1.innerText,
      color_2: color2.innerText,
      color_3: color3.innerText,
      color_4: color4.innerText,
      color_5: color5.innerText,
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
  let paletteContainer = document.querySelector(`.proj-${palette.project_id}`)
  let newPalette = document.createElement('li');
  newPalette.className = `small-palettes p-id-${palette.id}`
  newPalette.innerHTML = (`
    <p>${palette.palette_name} </p>
    <div class='small-circle palette-1' style='background-color:${palette.color_1}'>
    </div>
    <div class='small-circle palette-2'
    style='background-color:${palette.color_2}'>
    </div>
    <div class='small-circle palette-3'
    style='background-color:${palette.color_3}'>
    </div>
    <div class='small-circle palette-4'
    style='background-color:${palette.color_4}'>
    </div>
    <div class='small-circle palette-5'
    style='background-color:${palette.color_5}'>
    </div>
    <i class="fa fa-trash" aria-hidden="true"></i>
    `
    
  )
  paletteContainer.appendChild(newPalette)
}

function displaySinglePalette (e) {
  const paletteId = e.target.closest('li').classList[1].slice(5)
  if (!e.target.classList.contains('fa-trash')) {
  fetch(`api/v1/projects/1/palettes/${paletteId}`)
    .then(response => response.json())
    .then(result => showSelectedPalette(result))
  } else {
    deletePalette(paletteId)
  }
}

function deletePalette (id) {
  
}

function showSelectedPalette (palette) {
  let palettesArray = [palette.color_1, palette.color_2, palette.color_3, palette.color_4, palette.color_5]
  for(let i=0; i<allHexes.length; i++) {
      allHexes[i].innerHTML = `${palettesArray[i]}`
      allCircles[i].style.backgroundColor = `${palettesArray[i]}`
  }
}

function saveProject () {
  const postObj = {
    project: {
      name: newProjectInput.value
    }
  };
  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify(postObj), 
    headers:  {
    'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(result => displayNewProject(result))
    .then(result => fetchProjectNames())
    .catch(error => console.log(error))
}

function displayNewProject (project) {
  var newProject = document.createElement('div');
  let projectClass = `proj-${project.id}`
  newProject.innerHTML = (`<div> 
    <h3 class='project-name'>  ${project.name} </h3>
    <p class=${projectClass} > </p>
  </div>`);
  document.querySelector('.project').appendChild(newProject)
  newProjectInput.value = '';
}

function togglePalette (e) {
  e.target.classList.toggle('fa-lock');
  e.target.classList.toggle('fa-unlock');
  e.target.parentElement.classList.toggle('locked');
}