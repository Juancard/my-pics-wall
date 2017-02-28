'use strict';

module.exports = function (app, appEnv) {

  let PicHandler = require(appEnv.path + '/app/controllers/picHandler.server.js');
  let picHandler = new PicHandler();

  app.route('/pics')
  	.post(appEnv.middleware.isLoggedIn, function (req, res) {
      console.log("in route add pic");
      picHandler.addPic(req.user, req.body.picUrl, req.body.picTitle, (err, newPic) => {
        if (err)
         return callback(
           new appEnv.errors.InternalError(
             err,
             "Error in adding pic"
           )
         );
        res.json({results: newPic});
      });
  	});

}
