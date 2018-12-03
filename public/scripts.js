const repopulatePalette = () => {
  const colors = [];

  while (colors.length < 5) {
    colors.push('#' + Math.floor(Math.random() * 16777216).toString(16));
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

    newProjectElement.innerHTML = `${projectName}<ul class="palettes"></ul>`;
    newProjectElement.id = projectName;
    newSelectElement.value = `${projectName}`;
    newSelectElement.innerText = projectName;

    projectsList.setAttribute('data-projects', newList);
    projectsList.appendChild(newProjectElement);
    projectSelect.appendChild(newSelectElement);

    document.querySelector('.warning').style.display = 'none';
    document.querySelector('.palette-form').style.display = 'block';
  }
}

const savePalette = (event) => {
  event.preventDefault();
  const colors = [];
  for (let i = 0; i < 5; i++) {
    colors.push(document.querySelector('.color-' + i).querySelector('h2').innerText);
  }
}

document.querySelector('.new-palette').addEventListener('click', repopulatePalette);
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('click', toggleLock);
});
document.querySelector('.create-project').addEventListener('click', createProject)
document.querySelector('.save-palette').addEventListener('click', savePalette)