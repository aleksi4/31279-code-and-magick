'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var reviewForm = document.querySelector('.review-form');
  var reviewMark = reviewForm.elements['review-mark'];
  var reviewText = reviewForm.elements['review-text'];
  var reviewName = reviewForm.elements['review-name'];
  var reviewFieldsText = document.querySelector('.review-fields-text');
  var reviewFieldsName = document.querySelector('.review-fields-name');
  var reviewFields = document.querySelector('.review-fields');
  var reviewSubmit = document.querySelector('.review-submit');

  var disableSubmit = function() {
    if (reviewName.validity.valid && reviewText.validity.valid) {
      reviewSubmit.removeAttribute('disabled');
      reviewFields.classList.add('invisible');
    } else {
      reviewSubmit.setAttribute('disabled', 'disabled');
      reviewFields.classList.remove('invisible');
    }
  };

  var setInvisible = function(field, label) {
    if (field.validity.valid) {
      label.classList.add('invisible');
    } else {
      label.classList.remove('invisible');
    }
  };

  for (var i = 0; i < reviewMark.length; i++) {
    reviewMark[i].onchange = function() {
      if (reviewMark.value > 3) {
        reviewText.removeAttribute('required');
      } else {
        reviewText.setAttribute('required', 'required');
      }
      setInvisible(reviewText, reviewFieldsText);
      disableSubmit();
    };
  }

  reviewName.oninput = function() {
    setInvisible(reviewName, reviewFieldsName);
    disableSubmit();
  };

  reviewText.oninput = function() {
    setInvisible(reviewText, reviewFieldsText);
    disableSubmit();
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
