'use strict';

module.exports = function (app, appEnv) {

  app.route('/pics')
  	.post(/*appEnv.middleware.isLoggedIn,*/ function (req, res) {
      console.log("in route add pic");
      let out = {
        picUrl: req.body.picUrl,
        picTitle: req.body.picTitle
      };
      res.json({results: out});
  	});

}
