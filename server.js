const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use( bodyParser.json() );

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.locals.projects = [
  {
    id: 1,
    name: 'Project 1'
  },
  {
    id: 2,
    name: 'Project 2'
  },
  {
    id: 3,
    name: 'Project 3'
  }
]

app.locals.palettes = [
  {
    id: 1,
    name: 'cool colors',
    project_id: 1,
    color_1: '#61E45C',
    color_2: '#B6B2F0',
    color_3: '#613D0E',
    color_4: '#D67F0B',
    color_5: '#D0D714'
  },
  {
    id: 2,
    name: 'dark colors',
    project_id: 1,
    color_1: '#61FFCF',
    color_2: '#FF00F2',
    color_3: '#ABC123',
    color_4: '#11FFAA',
    color_5: '#1F2A3A'
  },
  {
    id: 3,
    name: 'pastels',
    project_id: 2,
    color_1: '#61FFCF',
    color_2: '#FF00FC',
    color_3: '#ABC123',
    color_4: '#11FFAA',
    color_5: '#1F2A3A'
  },
  {
    id: 4,
    name: 'pastels',
    project_id: 3,
    color_1: '#61FFCF',
    color_2: '#FF00FC',
    color_3: '#ABC123',
    color_4: '#11FFAA',
    color_5: '#1F2A3A'
  }
]

app.use(express.static('public'));


//get request to all projects 
// app.get('/api/v1/projects', (request, response) => {
//   const projects = app.locals.projects;
//   response.json({projects});
// });

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

//get all palettes from a specific project 
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  //get the id of project from the request path 
  const { id } = request.params;
  const palettes = app.locals.palettes;
  //filter through the palettes and find the ones whose foreign key(project id) matches the proj id
  const matchingPalettes = palettes.filter(palette => palette.project_id === parseInt(id))
  if(matchingPalettes) {
    response.json({matchingPalettes});
  } else {
    response.sendStatus(404)
  }
});

//post request for adding a new project
app.post('/api/v1/projects', (request, response) => {
  //desctructure the new project from the body of the post request
  const { project } = request.body;
  //create a unique id for the new project
  const id = Date.now();
  if(!project) {
    return response.status(422).send({
      error: 'No project provided'
    });
  } else {
    //add the new project to the array of current projects
    app.locals.projects.push(project);
    return response.status(201).json({ id, project });
  }
});

//post for adding palette to existing project that has already been created
//what should this path be?
app.post('/api/v1/palettes', (request, response) => {
  const { palette } = request.body;
  // const id = Date.now();
  const { project_id } = palette;
  if(!palette) {
    return response.status(422).send({
      error: 'No palette property provided'
    });
  } else {
    app.locals.projects[project_id].push(palette);
    // const project = app.locals.projects.find(currProj => currProj.id === project_id);
    return response.status(201).json({ id, palette });
  }
});

//delete a palette from a specific project
app.delete('/api/v1/palettes/:id', (request, response) => {
  const palettes = app.locals.palettes;
  const id = parseInt(request.params.id)
  let filteredPalettes = palettes.filter((palette) => {
    return palette.id !== id
  })
  palettes = filteredPalettes
  response.status(200).json({filteredPalettes})
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});