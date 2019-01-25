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


//get all projects
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
app.get('/api/v1/projects/:id', (request, response) => {
  const id = parseInt(request.params.id);
  database('palettes').select()
    .then((palettes) => {
      //find the palettes whose project_id matches the request params id
      const matchingPalettes = palettes.filter(palette => palette.project_id === id )
      response.status(200).json(matchingPalettes);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

//get specific palette by using palette id
app.get('/api/v1/projects/:id/palettes/:palette_id', (request, response) => {
  const projectId = parseInt(request.params.id);
  const paletteId = parseInt(request.params.palette_id);
  database('palettes').select()
    .then((palettes) => {
      const matchingPalette = palettes.find(palette => palette.id === paletteId )
      response.status(200).json(matchingPalette);
    })
  .catch((error) => {
      response.status(500).json({ error });
  });
})

//post request for adding a new project
app.post('/api/v1/projects', (request, response) => {
  //desctructure the new project from the body of the post request
  const { project } = request.body;
  //create a unique id for the new project
  for( let requiredParameter of ['name'] ) {
    if( !project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  database('projects').insert(project, 'id')
    .then(projectId => {
      response.status(201).json({ ...project, id: projectId[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//post for adding palette to existing project that has already been created
app.post('/api/v1/projects/:id/palettes', (request, response) => {
  //desctructure the new project from the body of the post request
  const { palette } = request.body;
  const project_id = parseInt(request.params.id)
  for( let requiredParameter of ['palette_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5'] ) {
    if( !palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { palette_name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  database('palettes').insert({...palette, project_id}, 'id')
    .then(paletteId => {
      response.status(201).json({...palette, id: paletteId[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


//delete a palette from a project
app.delete('/api/v1/projects/:id/palettes/:palette_id', (request, response) => {
  const projectId = parseInt(request.params.id);
  const paletteId = parseInt(request.params.palette_id);
  database('palettes').select()
    .then((palettes) => {
      const matchingPalette = palettes.filter(palette => palette.id !== paletteId )
      response.status(200).json(matchingPalette);
    })
  .catch((error) => {
      response.status(500).json({ error });
  })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});