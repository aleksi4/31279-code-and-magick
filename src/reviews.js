'use strict';

var reviewsContainer = document.querySelector('.reviews');
var reviewsFilter = document.querySelector('.reviews-filter');
var reviewsList = document.querySelector('.reviews-list');
var templateElement = document.querySelector('#review-template');
var elementToClone;

reviewsFilter.classList.add('invisible');
reviewsContainer.classList.add('reviews-list-loading');

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}

var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

var reviews = [];

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

var getReviews = function(callback) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callback(loadedData);
    if (xhr.status !== 200) {
      reviewsContainer.classList.add('reviews-load-failure');
    }
  };

  xhr.open('GET', REVIEWS_LOAD_URL);
  xhr.send();

  xhr.timeout = 30000;
};

var renderReviews = function(reviewsArr) {
  reviewsList.innerHTML = '';

  reviewsArr.forEach(function(review) {
    getReviewElement(review, reviewsList);
  });
};


var getFilteredReviews = function(reviewsArr, filter) {
  var reviewsToFilter = reviewsArr.slice(0);
  var text = 'Нет подходящих отзывов';
  var alert = document.querySelector('.alert');

  reviewsFilter.classList.remove('invisible');


  switch (filter) {
    case 'reviews-all':
      break;
    case 'reviews-recent':
      reviewsToFilter = reviewsToFilter.filter(function(item) {
        return new Date(item.date).getTime() > new Date().setDate(new Date().getDate() - 4);
      }).sort(function(a, b) {
        return (new Date(b.date) - new Date(a.date));
      });
      break;
    case 'reviews-good':
      reviewsToFilter = reviewsToFilter.filter(function(item) {
        return item.rating >= 3;
      }).sort(function(a, b) {
        return b.rating - a.rating;
      });
      break;
    case 'reviews-bad':
      reviewsToFilter = reviewsToFilter.filter(function(item) {
        return item.rating < 3;
      }).sort(function(a, b) {
        return a.rating - b.rating;
      });
      break;
    case 'reviews-popular':
      reviewsToFilter.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
  }

  if (reviewsToFilter.length === 0 && !alert) {
    var p = document.createElement('p');
    p.className = 'alert';
    p.appendChild(document.createTextNode(text));
    reviewsContainer.insertBefore(p, reviewsList);
  } else if (reviewsToFilter.length !== 0 && alert) {
    reviewsContainer.removeChild(alert);
  }

  return reviewsToFilter;
};

var setFilterEnabled = function(filter) {
  var filteredReviews = getFilteredReviews(reviews, filter);
  renderReviews(filteredReviews);
};

var setFiltrationEnabled = function() {
  reviewsFilter.onchange = function(evt) {
    setFilterEnabled(evt.target.value);
  };
};

getReviews(function(loadedReviews) {
  reviews = loadedReviews;
  setFiltrationEnabled();
  setFilterEnabled('reviews-all');
  reviewsContainer.classList.remove('reviews-list-loading');
});
