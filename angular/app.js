const express = require('express');
const path = require('path');

const pjson = require('./package.json');

const app = express();

app.use(express.static(path.join(__dirname, `dist/${pjson.name}`)));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + `/dist/${pjson.name}/index.html`));
});

console.log(`${pjson.name} running`)

app.listen(process.env.PORT || 8097);