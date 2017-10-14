const sqlite = require('sqlite'),
      Sequelize = require('sequelize'),
      request = require('request'),
      express = require('express'),
      app = express();

const db = require('./config/sequelize');

const { PORT=3000, NODE_ENV='development'} = process.env;

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

// ROUTES and Route HANDLER
app.get('/films/recommendations/:id', (req, res) => {
	db.sequelize.query("SELECT * FROM films").then(function(films) {
        res.json(films);})
});

app.get('/films/:id', (req, res) => {
    var filimId = req.params.id;
    db.Films.findAll({
    where: {
        id : filimId,}
    }).then(function(getFilm) {
       res.json(getFilm);
   	});
});

// ROUTERS
app.get('/films/:id/recommendations', getFilmRecommendations);

// ROUTE HANDLER
function getFilmRecommendations(req, res) {
	var givenId = req.params.id;
    var genreId;
    var releaseDate;
    var defaultLimit;
    if (req.query.limit == null) {
       defaultLimit = 10;
    } else {
      defaultLimit = req.query.limit;
    }
    var defaultOffset;
    if (req.query.offset == null) {
      defaultOffset = 0;
    } else {
      defaultOffset = req.query.offset;
    }
    var limitCount = defaultLimit;
    var offsetCount = defaultOffset;
    db.Films.findAll({
        where: {
          id : givenId,
        }
    }).then(function(foundFilm) {
        genreId = foundFilm[0].genre_id;
        releaseDate = new Date(foundFilm[0].release_date);
        db.Films.findAll({
            where : {
              genre_id : genreId
            }
        }).then(function(foundFilms) {
            var filteredFilms = []
            for (var i = 0; i < foundFilms.length; i++) {
                var tempDate = new Date(foundFilms[i].release_date);
                var diff = (releaseDate - tempDate)/86400000;
                if (diff <= 5478 && diff >= -5478 && limitCount > 0) {
                  if (givenId != foundFilms[i].id) {
                    if (offsetCount <= 0) {
                      filteredFilms.push(foundFilms[i]);
                      limitCount--;
                    } else {
                      offsetCount--;
                    }
                  }
                }
            }
              res.json({
                'recommendations' : filteredFilms,
                'meta' : {
                  "limit" : defaultLimit,
                  "offset" : defaultOffset,
                }
            })
        });
      });
    };
module.exports = app;
