const repopulatePalette = () => {
  const palette = document.querySelectorAll('.color');
  const contrastSection = document.querySelectorAll('.contrast-color');

  palette.forEach((item, index) => {
    const newColor = Math.floor(Math.random() * 16777216).toString(16);
    const textColor = getTextColor(newColor);
    item.style.backgroundColor = '#' + newColor;
    item.style.color = '#' + textColor;
    item.querySelector('h2').innerText = '#' + newColor.toUpperCase();
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


document.querySelector('.gnp').addEventListener('click', repopulatePalette);
