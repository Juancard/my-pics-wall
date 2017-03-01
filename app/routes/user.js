'use strict';

module.exports = function (app, appEnv) {

  let UserHandler = require(appEnv.path + '/app/controllers/userHandler.server.js');
  let userHandler = new UserHandler();
  let PicHandler = require(appEnv.path + '/app/controllers/picHandler.server.js');
  let picHandler = new PicHandler();

  app.param("tw_username",  function (req, res, next, username) {
    console.log("Requested username: ", username);
    userHandler.getUserByUsername(username)
      .then((user) => {
        if (!user)
          return next(
            new appEnv.errors.NotFound(
              "The resource requested is not available"
            )
          );
        req.userRequested = user;
        return next();
      })
      .catch((err) => {
        return next(
          new appEnv.errors.InternalError(
            err,
            "Error in retrieving the requested user"
          )
        );
      });
  });

  app.route('/api/user/:user_id([a-fA-F0-9]{24})')
  	.get(appEnv.middleware.isLoggedIn, (req, res) => {
  		res.json(req.user.twitter);
  	});

  app.route('/pics/:tw_username([a-zA-Z0-9_]+)')
  	.get( (req, res) => {
      picHandler
        .getPicsByUser(req.userRequested)
        .catch((err) => reject(
          err,
          "Error in retrieving pics from user %s",
          req.userRequested.twitter._id
        ))
        .then((pics) => {
          pics = pics.filter(p => p.state.state != 'inactive');
          let picsId = pics.map(p => p._id);
          picHandler
            .getLikesFromPics(picsId)
            .then((likes) => {
              likes = likes.filter(l => l.state.state != 'inactive');
              pics = pics.map(p => {
                p.likes = likes.filter(l => l.pic.equals(p._id));
                return p;
              });
              let out = {
                pics
              }
              res.render(appEnv.path + '/app/views/pages/index.pug', out);
            })
            .catch((err) => next(
                new appEnv.errors.InternalError(
                  err,
                  "Error in recollecting likes from our database"
                )
              )
            );
          });
        });

}
