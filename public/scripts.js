const repopulatePalette = () => {
  const colors = [];

  while (colors.length < 5) {
    colors.push('#' + Math.floor(Math.random() * 16777216).toString(16))
  }

  colors.forEach((color, index) => {
    if (color is not locked) {
      document.querySelectorAll('.color-' + index).forEach(item => {
        item.style.backgroundColor = colors[0];
      });
    }
  });
}

document.querySelector('.gnp').addEventListener('click', repopulatePalette);
