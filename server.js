const express = require('express');
const app = express();

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

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;
  const palettes = app.locals.palettes;
  const matchingPalettes = palettes.filter(palette => palette.project_id === parseInt(id))
  response.json({matchingPalettes});
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});