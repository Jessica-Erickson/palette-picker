const repopulatePalette = () => {
  const colors = [];

  while (colors.length < 5) {
    const newColor = '000000' + Math.floor(Math.random() * 16777216).toString(16)
    colors.push('#' + newColor.slice(-6));
  }

  colors.forEach((color, index) => {
    const paletteColor = document.querySelector('.color-' + index);
    const lock = paletteColor.querySelector('img').getAttribute('src');
    if (lock === 'assets/padlock-unlock.svg') {
      document.querySelectorAll('.color-' + index).forEach(item => {
        item.style.backgroundColor = colors[index];
      });
      paletteColor.querySelector('h2').innerText = colors[index].toUpperCase();
    }
  });
}

const toggleLock = (event) => {
  const lock = event.target.getAttribute('src');
  if (lock === 'assets/padlock-unlock.svg') {
    event.target.setAttribute('src', 'assets/padlock.svg')
  } else {
    event.target.setAttribute('src', 'assets/padlock-unlock.svg')
  }
}

const createProject = (event) => {
  event.preventDefault();
  const projectName = document.querySelector('#new-project-name').value;
  const projectsList = document.querySelector('.projects');
  const existingProjects = projectsList.getAttribute('data-projects').split(', ');
  const isUnique = !existingProjects.includes(projectName);

  if (projectName !== '' && isUnique) {
    const newList = [...existingProjects, projectName].join(', ');
    const newProjectElement = document.createElement('li');
    const projectSelect = document.querySelector('#project-select');
    const newSelectElement = document.createElement('option');

    newProjectElement.innerHTML = `${projectName}<ul class="palettes" data-palettes=""></ul>`;
    newProjectElement.setAttribute('name', projectName);
    newSelectElement.value = `${projectName}`;
    newSelectElement.innerText = projectName;

    projectsList.setAttribute('data-projects', newList);
    projectsList.appendChild(newProjectElement);
    projectSelect.appendChild(newSelectElement);

    document.querySelector('.warning').style.display = 'none';
    document.querySelector('.project-error').style.display = 'none';
    document.querySelector('.palette-form').style.display = 'block';
  } else {
    document.querySelector('.project-error').style.display = 'inline';
  }
}

const savePalette = (event) => {
  event.preventDefault();

  const projectName = document.querySelector('#project-select').value;
  const paletteName = document.querySelector('#palette-name').value;

  let projectToSaveTo;
  let existingPalettes;
  let isUnique;

  if (document.querySelector(`li[name='${projectName}']`)) {
    projectToSaveTo = document.querySelector(`li[name='${projectName}']`).querySelector('ul');
    existingPalettes = projectToSaveTo.getAttribute('data-palettes').split(', ');
    isUnique = !existingPalettes.includes(paletteName);
  }

  if (paletteName !== '' && isUnique) {
    const newList = [...existingPalettes, paletteName].join(', ');
    projectToSaveTo.setAttribute('data-palettes', newList);

    const newPaletteElement = document.createElement('li');
    newPaletteElement.innerText = paletteName;

    const paletteContainer = document.createElement('div');
    paletteContainer.setAttribute('class', 'palette-display');

    const colors = [];

    for (let i = 0; i < 5; i++) {
      colors.push(document.querySelector('.color-' + i).querySelector('h2').innerText);
    }

    colors.forEach(color => {
      const newColorDiv = document.createElement('div');
      newColorDiv.setAttribute('class', 'palette-color');
      newColorDiv.style.backgroundColor = color;
      newColorDiv.setAttribute('data-hex', color);
      paletteContainer.appendChild(newColorDiv);
    });

    newPaletteElement.appendChild(paletteContainer);
    projectToSaveTo.appendChild(newPaletteElement);
    document.querySelector('.palette-error').style.display = 'none';
  } else {
    document.querySelector('.palette-error').style.display = 'inline';
  }
  
}

document.querySelector('.new-palette').addEventListener('click', repopulatePalette);
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('click', toggleLock);
});
document.querySelector('.create-project').addEventListener('click', createProject)
document.querySelector('.save-palette').addEventListener('click', savePalette)