const repopulatePalette = () => {
  const palette = document.querySelectorAll('.color');
  palette.forEach(item => {
    const newColor = Math.floor(Math.random() * 16777216).toString(16);
    const textColor = getInvertedColor(newColor);
    item.style.backgroundColor = '#' + newColor;
    item.style.color = '#' + textColor;
    item.querySelector('h2').innerText = '#' + newColor.toUpperCase();
  });
}

const getInvertedColor = (string) => {
  const r = parseInt(string.slice(0,2), 16);
  const g = parseInt(string.slice(2,4), 16);
  const b = parseInt(string.slice(4), 16);
  if (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 125) {
    return '0a140f';
  } else {
    return 'e1e1e1';
  }
}

document.querySelector('.gnp').addEventListener('click', repopulatePalette);
