'use strict';

module.exports = function (app, appEnv) {

  let PicHandler = require(appEnv.path + '/app/controllers/picHandler.server.js');
  let picHandler = new PicHandler();

  app.route('/')
    .get(function (req, res) {
      console.log("in route get all pics");
      picHandler.getAllPics().then((pics) => {
          pics = pics.filter(p => p.state.state != 'inactive');
          let picsId = pics.map(p => p._id);
          picHandler.getLikesFromPics(picsId).then((likes) => {
            likes = likes.filter(l => l.state.state != 'inactive');
            pics = pics.map(p => {
              p.likes = likes.filter(l => l.pic.equals(p._id));
              return p;
            });
            let out = {
              pics
            }
            res.render(appEnv.path + '/app/views/pages/index.pug', out);
          }).catch((err) => next(
              new appEnv.errors.InternalError(
                err,
                "Error in recollecting likes from our database"
              )
            )
          );
      }).catch((err) => next(
          new appEnv.errors.InternalError(
            err,
            "Error in recollecting pics from our database"
          )
        )
      );
    });

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
