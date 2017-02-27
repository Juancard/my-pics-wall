'use strict';

(function () {

  ajaxFunctions.ready(() => {
    //nothing yet
  });

  let urlPic = appUrl + '/pics';

  let formAddPic = document.forms['formAddPic'] || null;

  let onAddPic = e => {
    console.log("on add pic");
    e.preventDefault();
    e.target.disabled = true;

    let urlGiven = formAddPic.picUrl.value;
    let titleGiven = formAddPic.picTitle.value;

    let onPicAdded = (err, picAdded) => {
      e.target.disabled = false;
      if (!picAdded) return;
      console.log("Pic added", picAdded);
    }

    let sendPic = (picUrl, titleUrl) => {
      console.log("Sending: ", picUrl, titleUrl);
      let data = {
        picUrl: picUrl,
        picTitle: titleUrl
      }
      ajaxFunctions.ajaxRequest('POST', urlPic, data, ajaxFunctions.onDataReceived(onPicAdded));
    }

    let validatePic = (urlGiven, titleGiven, callback) => {
      let toValidate = [
        validator.imageUrl(urlGiven),
        validator.string(titleGiven, 2, 20).then(
          (validated) => Promise.resolve(validated),
          (error) => Promise.reject(Error("Pic Title not valid: " + error.message))
        )
      ];
      Promise.all(toValidate).then(
        (validated) => callback(false, validated),
        (error) => callback(error)
      );
    }

    validatePic(urlGiven, titleGiven, (err, validated) => {
      if (err)
        return errorHandler.onMessage({
          type: 'danger',
          text: err.message
        });
      sendPic(urlGiven, titleGiven);
    })

  }

  if (formAddPic)
    formAddPic.addEventListener('submit', onAddPic);

})();
