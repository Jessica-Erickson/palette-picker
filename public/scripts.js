const repopulatePalette = () => {
  const palette = document.querySelectorAll('.color');
  const contrastSection = document.querySelectorAll('.contrast-color');
  const colors = [];

  palette.forEach((item, index) => {
    const newColor = Math.floor(Math.random() * 16777216).toString(16);

    colors.push(newColor);
    setPaletteItemStyle(item, newColor);
  });

  contrastSection.forEach((item, index) => {
    const currentColor = colors[index];
    const newColors = colors.filter(color => {
      return color !== currentColor;
    });

    setContrastItemStyle(item, currentColor, newColors);
  });
}

const getTextColor = (string) => {
  const r = parseInt(string.slice(0,2), 16);
  const g = parseInt(string.slice(2,4), 16);
  const b = parseInt(string.slice(4), 16);

  if (((r * 0.21) + (g * 0.72) + (b * 0.07)) >= 125) {
    return '0a140f';
  } else {
    return 'e1e1e1';
  }
}

const setPaletteItemStyle = (item, newColor) => {
  item.style.backgroundColor = '#' + newColor;
  item.style.color = '#' + getTextColor(newColor);
  item.querySelector('h2').innerText = '#' + newColor.toUpperCase();
}

const setContrastItemStyle = (item, currentColor, newColors) => {
  item.style.backgroundColor = '#' + currentColor;
  item.style.boxShadow = `2.5rem 2.5rem #${newColors[0]}, -2.5rem 2.5rem #${newColors[1]}, -2.5rem -2.5rem #${newColors[2]}, 2.5rem -2.5rem #${newColors[3]}`;
}

document.querySelector('.gnp').addEventListener('click', repopulatePalette);
