const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', function(req, res) {
    res.render('home', { title: 'Hey', message: 'Tess here!'});
});

app.get('/profile/:id', function(req, res) {
    res.render('home');
});

app.listen(port, function() {
    console.log(`App de Exemplo escutando na porta ${port}!`);
});

app.engine('html', function (filePath, options, callback) {
    fs.readFile(filePath, function (err, content) {
        if (err) return callback(new Error(err));
        if (options.length < 1) return;
        console.log(options.title);

        var rendered = content.toString().replace('#title#', ''+ options.title +'').replace('#message#', ''+ options.message +'');
        return callback(null, rendered);
    });
});
app.set('views', __dirname + "/Views");
app.set('view engine', 'html');