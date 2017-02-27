'use strict';

(function () {

  ajaxFunctions.ready(() => {
    //nothing yet
  });

  let urlPic = appUrl + '/pics';

  let formAddPic = document.forms['formAddPic'] || null;
  console.log(formAddPic);

  let onAddPic = e => {
    console.log("on add pic");
    e.preventDefault();
    e.target.disabled = true;

    let url = urlPic;
    let data = {
      picUrl: formAddPic.picUrl.value,
      picTitle: formAddPic.picTitle.value
    }

    ajaxFunctions.ajaxRequest(
      'POST',
      url,
      data,
      ajaxFunctions.onDataReceived(
        (err, picAdded) => {
          e.target.disabled = false;
          if (!picAdded) return;
          console.log("Pic added", picAdded);
        }
      )
    );
  }

  if (formAddPic)
    formAddPic.addEventListener('submit', onAddPic);

})();
