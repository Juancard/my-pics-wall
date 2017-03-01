'use strict';

let PicHandler = require(process.cwd() + '/app/controllers/picHandler.server.js');
let picHandler = new PicHandler();

let pics = {
  isOwner: function isOwner(iWantTheOwner){
    return (req, res, next) => {
      let isOwner = req.user._id.equals(req.pic.user._id);
      if (isOwner == iWantTheOwner) return next();
      if (req.xhr) {
        let out = {
          message: {
            type: "danger",
          }
        }
        if (isOwner)
          out.message.text = "The owner of the pic can not perform this action.";
        else
          out.message.text = "Only the owner of the pic can perform this action.";
        return res.json(out);
      }
    }
  }
}

module.exports = pics;
