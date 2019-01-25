let projectsData = [
  {
    name: 'project 1', 
    palettes: [
      {
        palette_name: 'cool colors',
        color_1: '#61E45C',
        color_2: '#B6B2F0',
        color_3: '#613D0E',
        color_4: '#D67F0B',
        color_5: '#D0D714'
      },
      {
        palette_name: 'dark colors',
        color_1: '#61FFCF',
        color_2: '#FF00F2',
        color_3: '#ABC123',
        color_4: '#11FFAA',
        color_5: '#1F2A3A'
      }
    ]
  },
  {
    name: 'project 2', 
    palettes: [
      {
        palette_name: 'pastels',
        color_1: '#61FFCF',
        color_2: '#FF00FC',
        color_3: '#ABC123',
        color_4: '#11FFAA',
        color_5: '#1F2A3A'
      },
      {
        palette_name: 'darks',
        color_1: '#61AFCF',
        color_2: '#FF00FC',
        color_3: '#ABC123',
        color_4: '#11FFAA',
        color_5: '#1F2A3A'
      }
    ]
  }
]

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name
  }, 'id')
  .then(projectId => {
    let palettePromises = [];

    project.palettes.forEach(palette => {
      palettePromises.push(
        createPalette(knex, {...palette, 
          project_id: projectId[0]
        })
      )
    });
    return Promise.all(palettePromises);
  })
}

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette)
}

exports.seed = (knex, Promise) => {
  return knex('palettes').del()
    .then(() => knex('projects').del()) 
    .then(() => {
      let projectPromises = [];

      projectsData.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });

      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};