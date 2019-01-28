const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use( bodyParser.json() );
app.use(express.static('public'));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

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
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  console.log(request.params)
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
  console.log(project_id)
  for( let requiredParameter of ['palette_name', 'color_1', 'color_2', 'color_3', 'color_4', 'color_5'] ) {
    if( !palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { palette_name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  database('palettes').insert({...palette, project_id}, 'id')
    .then(paletteId => {
      response.status(201).json({...palette, project_id, id: paletteId[0] })
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