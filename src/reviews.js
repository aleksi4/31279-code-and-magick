'use strict';

var reviewsFilter = document.querySelector('.reviews-filter');
var reviewsList = document.querySelector('.reviews-list');
var templateElement = document.querySelector('#review-template');
var elementToClone;

reviewsFilter.classList.add('invisible');

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}


var getReviewElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  var arrReviewRating = ['review-rating', 'review-rating-two', 'review-rating-three', 'review-rating-four', 'review-rating-five'];
  var img = new Image();

  img.onload = function() {
    element.querySelector('.review-author').setAttribute('src', img.src);
    element.querySelector('.review-author').setAttribute('width', 124);
    element.querySelector('.review-author').setAttribute('height', 124);
  };

  img.onerror = function() {
    element.classList.add('review-load-failure');
  };

  img.src = data.author.picture;

  element.querySelector('.review-text').textContent = data.description;
  element.querySelector('.review-rating').classList.add(arrReviewRating[data.rating - 1]);
  container.appendChild(element);
  return element;
};

window.reviews.forEach(function(review) {
  getReviewElement(review, reviewsList);
});

reviewsFilter.classList.remove('invisible');
