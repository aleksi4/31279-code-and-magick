'use strict';

var reviewsContainer = document.querySelector('.reviews');
var reviewsFilter = document.querySelector('.reviews-filter');
var reviewsList = document.querySelector('.reviews-list');
var templateElement = document.querySelector('#review-template');
var elementToClone;
var reviewsMore = document.querySelector('.reviews-controls-more');

reviewsFilter.classList.add('invisible');
reviewsContainer.classList.add('reviews-list-loading');

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}

var REVIEWS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

var reviews = [];

var PAGE_SIZE = 3;

var pageNumber = 0;

var filteredReviews = [];

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


/**
 * @param {Array.<Object>} reviewsArr
 * @param {number} page
 */
var renderReviews = function(reviewsArr, page) {
  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  reviewsArr.slice(from, to).forEach(function(review) {
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
  filteredReviews = getFilteredReviews(reviews, filter);
  pageNumber = 0;
  renderReviews(filteredReviews, pageNumber);
};

var setFiltrationEnabled = function() {
  reviewsFilter.onchange = function(evt) {
    reviewsList.innerHTML = '';
    setFilterEnabled(evt.target.value);
    showControlsMoreReviews();
  };
};

var isNextPageAvailable = function(reviewsArr, page, pageSize) {
  return page < Math.floor(reviewsArr.length / pageSize);
};


var showMoreRevsiews = function() {
  if (isNextPageAvailable(reviews, pageNumber, PAGE_SIZE)) {
    pageNumber++;
    renderReviews(filteredReviews, pageNumber);
  }
  showControlsMoreReviews();
};

var showControlsMoreReviews = function() {
  if (isNextPageAvailable(filteredReviews, pageNumber, PAGE_SIZE)) {
    reviewsMore.classList.remove('invisible');
  } else {
    reviewsMore.classList.add('invisible');
  }
};

reviewsMore.onclick = function() {
  showMoreRevsiews();
};

getReviews(function(loadedReviews) {
  reviews = loadedReviews;
  setFiltrationEnabled();
  setFilterEnabled('reviews-all');
  reviewsContainer.classList.remove('reviews-list-loading');
  reviewsList.innerHTML = '';
  showControlsMoreReviews();
  showMoreRevsiews();
});
