'use strict';

module.exports = function (app, appEnv) {

  let PicHandler = require(appEnv.path + '/app/controllers/picHandler.server.js');
  let picHandler = new PicHandler();

  app.route('/pics')
  	.post(appEnv.middleware.isLoggedIn, (req, res, next) => {
      console.log("in route add pic");
      picHandler.addPic(req.user, req.body.picUrl, req.body.picTitle)
        .then(
          (newPic) => res.json({results: newPic})
        )
        .catch(
          (err) => next(
            new appEnv.errors.InternalError(
              err,
              "Error in adding pic"
            )
          )
        );
    });

}
