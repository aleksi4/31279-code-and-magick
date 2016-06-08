'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var reviewForm = document.querySelector('.review-form');
  var reviewMark = reviewForm.elements['review-mark'];
  var reviewText = reviewForm.elements['review-text'];
  var reviewName = reviewForm.elements['review-name'];
  var reviewFields = document.querySelector('.review-fields');
  var reviewSubmit = document.querySelector('.review-submit');
  var reviewFormGroupMark = document.querySelector('.review-form-group-mark');
  var divNameError = document.getElementById('review-name-error');
  divNameError.appendChild(document.createTextNode(reviewName.validationMessage));
  var divTextError = document.getElementById('review-text-error');
  divTextError.appendChild(document.createTextNode(reviewText.validationMessage));
  var browserCookies = require('browser-cookies');
  reviewName.value = browserCookies.get('name');
  reviewMark.value = browserCookies.get('mark');

  var dateNow = new Date(2016, 5, 16);
  var birthday = new Date().setFullYear(dateNow.getFullYear(), 5, 17);
  if (dateNow.getMonth() <= 5 && dateNow.getDate() <= 17) {
    birthday = new Date().setFullYear(dateNow.getFullYear() - 1, 5, 17);
  }
  var timeNow = dateNow.getTime();
  var cookTime = Math.ceil((timeNow - birthday) / 1000 / 60 / 60 / 24);

  console.log(cookTime);


  var setSubmitDisabled = function() {
    if (reviewForm.checkValidity()) {
      reviewSubmit.disabled = false;
      reviewFields.classList.add('invisible');
    } else {
      reviewSubmit.disabled = true;
      reviewFields.classList.remove('invisible');
    }
  };

  var setVisibility = function(field) {
    var label = document.getElementById(field.getAttribute('id') + '-label');
    var error = document.getElementById(field.getAttribute('id') + '-error');
    if (field.validity.valid) {
      label.classList.add('invisible');
      error.classList.add('invisible');
    } else {
      label.classList.remove('invisible');
      error.classList.remove('invisible');
    }
  };

  var setTextRequired = function() {
    if (reviewMark.value > 3) {
      reviewText.removeAttribute('required');
    } else {
      reviewText.setAttribute('required', 'required');
    }
  };

  setTextRequired();
  setVisibility(reviewName);
  setVisibility(reviewText);
  setSubmitDisabled();

  reviewForm.onsubmit = function() {
    browserCookies.set('name', reviewName.value, {expires: cookTime});
    browserCookies.set('mark', reviewMark.value, {expires: cookTime});
  };

  reviewFormGroupMark.onchange = function() {
    setTextRequired();
    setVisibility(reviewText);
    setSubmitDisabled();
  };

  reviewName.oninput = function() {
    setVisibility(reviewName);
    setSubmitDisabled();
  };

  reviewText.oninput = function() {
    setVisibility(reviewText);
    setSubmitDisabled();
  };

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };
})();
