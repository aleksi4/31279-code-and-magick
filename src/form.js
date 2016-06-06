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

  reviewFormGroupMark.onchange = function() {
    if (reviewMark.value > 3) {
      reviewText.removeAttribute('required');
    } else {
      reviewText.setAttribute('required', 'required');
    }
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
