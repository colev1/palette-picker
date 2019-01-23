const express = require('express');
const app = express();
const bodyParser = require('body-parser');

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

app.get('/api/v1/projects', (request, response) => {
  const projects = app.locals.projects;
  response.json({projects});
});


//post request for adding a new project
app.post('/api/v1/projects', (request, response) => {
  const { project } = request.body;
  const id = Date.now();
  if(!project) {
    return response.status(422).send({
      error: 'No project property provided'
    });
  } else {
    app.locals.projects.push(project);
    return response.status(201).json({ id, project });
  }
});

//post for adding palette to existing project
app.post('/api/v1/projects/:project_id/palettes', (request, response) => {
  const { palette } = request.body;
  const id = Date.now();
  const { project_id } = request.params;
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

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;
  const palettes = app.locals.palettes;
  const matchingPalettes = palettes.filter(palette => palette.project_id === parseInt(id))
  response.json({matchingPalettes});
});

app.delete('/api/v1/projects/:project_id/palettes/:id', (request, response) => {
  const { id } = request.params;
  // const palettes = app.locals.palettes;
  // const matchingPalettes = palettes.filter(palette => palette.project_id !== parseInt(id))
  // response.json({matchingPalettes});
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});