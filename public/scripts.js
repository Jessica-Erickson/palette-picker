const toggleLock = (event) => {
  const lock = event.target.getAttribute('src');
  if (lock === 'assets/padlock-unlock.svg') {
    event.target.setAttribute('src', 'assets/padlock.svg')
  } else {
    event.target.setAttribute('src', 'assets/padlock-unlock.svg')
  }
}

const handleControlsClick = (event) => {
  event.preventDefault();
  const etc = event.target.classList;

  if (etc.contains('new-palette')) {
    repopulatePalette();
  } else if (etc.contains('create-project')) {
    saveProject();
  } else if (etc.contains('save-palette')) {
    savePalette();
  } else if (etc.contains('existing-palette')) {
    event.target.querySelectorAll('.palette-color').forEach((paletteColor, index) => {
      setPaletteColor(paletteColor.dataset.hex, index);
    });
  }
}

const repopulatePalette = () => {
  for (let i = 0; i < 5; i++) {
    const newColor = '000000' + Math.floor(Math.random() * 16777216).toString(16).toUpperCase();
    setPaletteColor('#' + newColor.slice(-6), i);
  }
}

const setPaletteColor = (colorCode, position) => {
  const lock = document.querySelector('.color-' + position).querySelector('.lock').getAttribute('src');

  if (lock === 'assets/padlock.svg') {
    return;
  }

  document.querySelectorAll('.color-' + position).forEach((colorDisplay, index) => {
    if (!index) {
      colorDisplay.querySelector('h2').innerText = colorCode;
      colorDisplay.style.backgroundColor = colorCode;
    } else {
      colorDisplay.style.backgroundColor = colorCode;
    }
  });
}

const saveProject = async () => {
  const name = document.querySelector('#new-project-name').value;
  const options = { method: 'POST',
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name }) };
  const response = await fetch('/api/v1/projects', options);
  
  if (response.status === 201) {
    const data = await response.json();
    const projectId = data.project_id;

    appendProject(name);
    addProjectOption(name, projectId);
    hideProjectWarnings();
    showPaletteForm();
  } else {
    showProjectWarning();
  }
}

const appendProject = (projectName) => {
  const projectsList = document.querySelector('.projects');
  const newProjectElement = document.createElement('li');

  newProjectElement.innerHTML = `${projectName}<ul class="palettes"></ul>`;
  newProjectElement.setAttribute('name', projectName);
  
  projectsList.appendChild(newProjectElement);
}

const addProjectOption = (projectName, id) => {
  const projectSelect = document.querySelector('#project-select');
  const newSelectElement = document.createElement('option');
  
  newSelectElement.value = projectName;
  newSelectElement.innerText = projectName;
  newSelectElement.dataset.id = id;

  projectSelect.appendChild(newSelectElement);
}

const hideProjectWarnings = () => {
  document.querySelector('.warning').style.display = 'none';
  document.querySelector('.project-error').style.display = 'none';
}

const showPaletteForm = () => {
  document.querySelector('.palette-form').style.display = 'block';
}

const showProjectWarning = () => {
  document.querySelector('.project-error').style.display = 'inline';
}

const savePalette = async () => {
  const paletteName = document.querySelector('#palette-name').value;
  const project = document.querySelector('#project-select');
  const projectName = project.value;
  const projectId = project.querySelector(`option[value='${projectName}']`).dataset.id;
  const projectToSaveTo = document.querySelector(`li[name='${projectName}']`).querySelector('ul');
  const colors = [];

  for (let i = 0; i < 5; i++) {
    colors.push(document.querySelector('.color-' + i).querySelector('h2').innerText);
  }

  const newPaletteData = { name: paletteName, 
                           values: colors, 
                           project_id: projectId };
  const options = { method: 'POST',
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newPaletteData) };
  const response = await fetch('/api/v1/palettes', options);

  if (response.status === 201) {
    appendPalette(paletteName, colors, projectToSaveTo);
    hidePaletteWarning();
  } else {
    showPaletteWarning();
  } 
}

const appendPalette = (name, colorList, project) => {
  const newPaletteElement = document.createElement('li');
  newPaletteElement.innerText = name;
  newPaletteElement.classList.add('existing-palette');

  const paletteContainer = document.createElement('div');
  paletteContainer.setAttribute('class', 'palette-display');


  colorList.forEach(color => {
    const newColorDiv = document.createElement('div');
    newColorDiv.setAttribute('class', 'palette-color');
    newColorDiv.style.backgroundColor = color;
    newColorDiv.setAttribute('data-hex', color);
    paletteContainer.appendChild(newColorDiv);
  });

  newPaletteElement.appendChild(paletteContainer);
  project.appendChild(newPaletteElement);
}

const hidePaletteWarning = () => {
  document.querySelector('.palette-error').style.display = 'none';
}

const showPaletteWarning = () => {
  document.querySelector('.palette-error').style.display = 'inline';
}

document.querySelector('aside').addEventListener('click', handleControlsClick);

document.querySelectorAll('.lock').forEach(lock => {
  lock.addEventListener('click', toggleLock);
});
