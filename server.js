const express = require('express');
const app = express();

app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), () => {
  console.log(`Palette Picker is running on ${app.get('port')}.`);
});