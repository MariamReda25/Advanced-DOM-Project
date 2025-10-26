'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('header');
const sections = document.querySelectorAll('.section');
const lazyImages = document.querySelectorAll('.lazy-img');
const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const dotContainer = document.querySelector('.dots');
const maxSlide = slides.length;
let currentSlide = 0;

const openModal = function () {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btnOpenModal =>
  btnOpenModal.addEventListener('click', openModal)
);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////////////////////////////
// Scrolling Button
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////
//  Page Navigation based on Event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////
//  Tabbed Component
tabContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // clause Guard
  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  const tab = clicked.dataset.tab;
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////
//// Menu fade animation
const hoverHandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', hoverHandler.bind(0.5));
nav.addEventListener('mouseout', hoverHandler.bind(1));

///////////////////////////////
//// Sticky Navigation
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
/////////////////////////////
//// Reveling Elements

const revealElment = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');

    // Stop Observer
    observer.unobserve(entry.target);
  });
};

const sectionsObserver = new IntersectionObserver(revealElment, {
  root: null,
  threshold: 0.15,
});
sections.forEach(section => {
  sectionsObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////
//// Lazy loading image

const lazyLoading = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  // Replace low quality by original one
  entry.target.src = entry.target.dataset.src;

  // Wait for loading image then remove filter
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // Stop Observer
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(lazyLoading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
lazyImages.forEach(img => imageObserver.observe(img));

////////////////////////////////
/// Slider Comonent

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class='dots__dot' data-slide='${i}'></button>`
    );
  });
};

const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
// Adjust slide transfrom property
const goToSlide = function (currentSlide) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
  });
};

const init = function () {
  createDots();
  // Initial State
  goToSlide(0);
  activateDots(0);
};

// Next slide
const nextSlide = function () {
  if (currentSlide === maxSlide - 1) currentSlide = 0;
  else currentSlide++;
  goToSlide(currentSlide);
  activateDots(currentSlide);
};

// Previous Slide
const prevSlide = function () {
  if (currentSlide === 0) currentSlide = maxSlide - 1;
  else currentSlide--;
  goToSlide(currentSlide);
  activateDots(currentSlide);
};

init();

// Based on buttons
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// Based on keys
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  else if (e.key === 'ArrowLeft') prevSlide();
});

// Based on dots
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = Number(e.target.dataset.slide);
    goToSlide(slide);
    activateDots(slide);
  }
});
