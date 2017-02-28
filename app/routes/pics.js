'use strict';

module.exports = function (app, appEnv) {

  let PicHandler = require(appEnv.path + '/app/controllers/picHandler.server.js');
  let picHandler = new PicHandler();

  app.route('/pics')
  	.post(appEnv.middleware.isLoggedIn, function (req, res) {
      console.log("in route add pic");
      let out = {
        picUrl: req.body.picUrl,
        picTitle: req.body.picTitle
      };
      res.json({results: out});
  	});

}
