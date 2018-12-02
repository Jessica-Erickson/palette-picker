const repopulatePalette = () => {
  const colors = [];

  while (colors.length < 5) {
    colors.push('#' + Math.floor(Math.random() * 16777216).toString(16))
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

document.querySelector('.gnp').addEventListener('click', repopulatePalette);
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('click', toggleLock);
});