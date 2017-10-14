//This configuration file is to set up sequelize using a SQLite dialect
//Also loops through model files and imports them

const sqlite = require('sqlite'),
      Sequelize = require('sequelize'),
      path = require('path'),
      fs = require('fs');

var sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/database.db',
});

var rootPath = path.normalize(__dirname + '/..');

var modelsDir = rootPath + '/app/models';

global.db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
}

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDir)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    // import model files and save model names
    .forEach(function (file) {
        var model = sequelize.import(path.join(modelsDir, file));
        global.db[model.name] = model;
    });

sequelize.sync();


module.exports = global.db;
