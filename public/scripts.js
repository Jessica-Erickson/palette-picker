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

  } else if (etc.contains('palette-display')) {
    event.target.querySelectorAll('.palette-color').forEach((paletteColor, index) => {
      setPaletteColor(paletteColor.dataset.hex, index);
    });
  }
}

const saveProject = async () => {
  const name = document.querySelector('#new-project-name').value;
  const options = { method: 'POST',
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: name }) };
  const response = await fetch('/api/v1/projects', options);
  
  if (response.status === 201) {
    const projectsList = document.querySelector('.projects');
    const newProjectElement = document.createElement('li');
    const projectSelect = document.querySelector('#project-select');
    const newSelectElement = document.createElement('option');

    newProjectElement.innerHTML = `${name}<ul class="palettes"></ul>`;
    newSelectElement.value = `${name}`;
    newSelectElement.innerText = name;

    projectsList.appendChild(newProjectElement);
    projectSelect.appendChild(newSelectElement);

    document.querySelector('.warning').style.display = 'none';
    document.querySelector('.project-error').style.display = 'none';
    document.querySelector('.palette-form').style.display = 'block';
  } else {
    document.querySelector('.project-error').style.display = 'inline';
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

document.querySelector('aside').addEventListener('click', handleControlsClick);

document.querySelectorAll('.lock').forEach(lock => {
  lock.addEventListener('click', toggleLock);
});
