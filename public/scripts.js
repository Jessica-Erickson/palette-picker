const repopulatePalette = () => {
  const colors = [];

  while (colors.length < 5) {
    colors.push('#' + Math.floor(Math.random() * 16777216).toString(16))
  }

  document.querySelectorAll('.first-color').forEach(item => {
    item.style.backgroundColor = colors[0];
  });
  document.querySelectorAll('.second-color').forEach(item => {
    item.style.backgroundColor = colors[1];
  });
  document.querySelectorAll('.third-color').forEach(item => {
    item.style.backgroundColor = colors[2];
  });
  document.querySelectorAll('.fourth-color').forEach(item => {
    item.style.backgroundColor = colors[3];
  });
  document.querySelectorAll('.fifth-color').forEach(item => {
    item.style.backgroundColor = colors[4];
  });
}

document.querySelector('.gnp').addEventListener('click', repopulatePalette);
