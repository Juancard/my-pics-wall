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
      addPicElement(picAdded);
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

  function addPicElement(pic){
    console.log("creating pic");
    let picTemplate = document.getElementById('picTemplate').firstChild;
    let picElement = picTemplate.cloneNode(true);
    picElement.id = pic._id;

    let picTitle = picElement.getElementsByClassName('picTitle')[0];
    picTitle.innerHTML = pic.title;

    let picImg = picElement.getElementsByClassName('picImg')[0];
    picImg.src = pic.url;
    pic.alt = pic.title;

    let classesPicAction = picElement.getElementsByClassName('action');
    Array.from(classesPicAction).forEach(addPicAction);

    masonryAppend(picElement);
  }

  let classesPicAction = document.getElementsByClassName('action');

  let onPicActionClick = e => {

    let elementClicked = e.target;
    let clickedValue = elementClicked.getAttribute('value');

    let picContainer = helper.findAncestorByClass(elementClicked, 'picContainer');
    let picId;
    if (picId)
      picId = picContainer.id;

    elementClicked.disabled = true;
    let callback = (reload=false) => {
      elementClicked.disabled = false;
    }

    if (clickedValue == 'remove')
      return onRemovePic(picId, callback);
    if (clickedValue == 'toggleLike')
      return onToggleLikePic(picId, callback);
  }

  let addPicAction = (classPicAction) => {
    classPicAction.addEventListener('click', onPicActionClick, false);
  }

  for (let i=0; i<classesPicAction.length; i++)
    addPicAction(classesPicAction[i]);


  //**************** REMOVE PIC ***********************

  function onRemovePic(picId, callback){
    console.log("on remove pic");
    /*
    let url = urlBook + '/' + bookUserId + urlRemove;
    ajaxFunctions.ajaxRequest('DELETE', url,
      null, ajaxFunctions.onDataReceived(
        (err, removed) => {
          if (removed)
            document.getElementById(removed._id).outerHTML = ''
          return callback();
        }
      )
    )
    */
  }

  //**************** END REMOVE PIC ***********************

  //**************** TOGGLE LIKE *************

  function onToggleLikePic(picId, callback){
    console.log("on toggle like pic");
    /*
    let url = urlBook + '/' + bookUserId + urlToggle;
    ajaxFunctions.ajaxRequest('GET', url, null, ajaxFunctions.onDataReceived((err, toggled) => {
      if (toggled) {
        let bookElement = document.getElementById(toggled._id)
        let actionElements = bookElement.getElementsByClassName('action');
        for (let i=0; i<actionElements.length; i++){
          if (actionElements[i].getAttribute('value') == 'toggleRequestable'){
            let span = actionElements[i].getElementsByTagName('SPAN')[0];
            //HARDCODE: SHOULD ASK FOR STATE STRING 'UNAVAILABLE', NOT STATE NUMBER 3
            span.innerHTML = (toggled.state.state != 3)? "Yes" : "No";
          }
        }
      }
      callback();
    }))
    */
  }

  //*********** END TOGGLE LIKE *************



})();
