'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHight = nav.getBoundingClientRect().height;
const allSections = document.querySelectorAll('.section');
const imgesLazy = document.querySelectorAll('img[data-src]');
// console.log(imgesLazy);

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Event delegeation

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //check to click on the item itself. Guard clause
  if (!clicked) return;

  //Remove active classes

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');
  //Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animation

const hoverNavLink = function (e) {
  //e.currentValue === this //true,because obveusly this is exactly the same
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); //so we choose only links wich include a header navigation,especially if there are any navigtion link on the page. We get a parent element and then from this on get initial link
    const logo = link.closest('.nav').querySelector('img'); //It's the same for the logo
    siblings.forEach(el => {
      //we need to use an arrow fucntion here, because this one does't have it's "this" word
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  } else if (e.target.classList.contains('nav__logo'))
    logo.style.opacity = this;
};

//passing "argument" into handler
nav.addEventListener('mouseover', hoverNavLink.bind(0.5)); //we pass this argument into handler function

nav.addEventListener('mouseout', hoverNavLink.bind(1));

//Implimenting intersection of the  header

const navInter = function (entries) {
  const [entry] = entries;
  // console.log(entries);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserv = new IntersectionObserver(navInter, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHight}px`,
});

headerObserv.observe(header);

//Revealing Elements on scroll

const revealSection = function (entiers, observer) {
  //observer is an observing element
  const [entry] = entiers;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); // need to delet for clear a log console. It's a little bet better for proformance
};

const sectionObserv = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserv.observe(section);
  // section.classList.add('section--hidden');
});

//lazzy Loading Images

const loadImg = function (entiers, observer) {
  const [entry] = entiers;
  console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src; // replace blured picture with original one(see in img folder)
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgesLazy.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');

  let currSlide = 0; // need for moving slides wille we looping over slides HTML collection
  const maxSlids = slides.length;

  //functions
  const createSlides = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const addActiveSlide = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(function (s) {
      s.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    /*need to subsruct "currSlide" to currectly (translateX) moving through slides to
  get this:slide=-1:-100px 0px 100px 200px 300px (width of every slide equal 100px)
  currSlide(slide here) incrise only one time by one 
  */
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    //lentgh isn't zero based(slides.lenght=4,but max index is three).So we need to subsrect one(-1) from maxSlidex(our length)

    if (currSlide === maxSlids - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }

    goToSlide(currSlide);
    addActiveSlide(currSlide);
  };

  const perviousSlide = function () {
    if (currSlide === 0) {
      currSlide = maxSlids - 1;
    } else {
      currSlide--;
    }

    goToSlide(currSlide);
    addActiveSlide(currSlide);
  };

  const init = function () {
    goToSlide(0); // needs to execute here before our code  for starting our slider with first slide...REMEBER that is  currSlide will be incresed to one(1) in the handle at once
    createSlides();
    addActiveSlide(0); //it also need to set fitst active slide every time like we reload page
  };

  init();

  //Event handlers

  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', perviousSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e);
    e.key === 'ArrowLeft' && perviousSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      //if yes,then get the slide through destracturing object "data-slide" specifically the number of slide, wich the data object stores
      const { slide } = e.target.dataset;
      goToSlide(slide);
      addActiveSlide(slide);
    }
  });
};

slider();
//Sticky navigation.
//1.Bad way for performance. Don't use in real projects

// const initialCoards = section1.getBoundingClientRect(); //coards form top of the view till section1
// console.log(initialCoards);
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY); // current scrolling from the top of the view
//   if (window.scrollY > initialCoards.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//2.A Better way:The Intersection Observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, // the area of viewport, now we specify it as all viewport(fullscreen)
//   threshold: [0, 0.2], // it's a need procentag when event intersection happends.Otherwords when the element would be apeard in view(intersecting:true). If <specifed that event.intersecting:false
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions); //create observer

// observer.observe(section1); // it has a own methot - observe in which we pass our element to intersect with root(viewport)

// //Selecting,creating and Deleting elements

// //Selecting

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// console.log(allSections);

// //HTML collections(it isn't the same as nodlist above)

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons); //if delete the element from the html collection manually, then it would deleated at once(in nodelist the element is still storing in list)
// console.log(document.getElementsByClassName('btn'));

// //creating and inserting elements
// const message = document.createElement('div');
// message.classList.add('cookie-message');

// // message.textContent = 'We use cookied for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));

// // header.before(message);
// // header.after(message);

// // Delete elements
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove();
//     message.parentElement.removeChild(message);
//   });

// //Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// console.log(message.style.color); // it works only inline styles
// console.log(message.style.backgroundColor);

// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Atributes

// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.getAttribute('src'));

// logo.alt = 'Butiful minimalist aplication"s logo';

// // console.log(logo.designer); //non standard it doesn't work
// console.log(logo.className);
// console.log(logo.getAttribute('desinger'));

// logo.setAttribute('company', 'Bankist');

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// //Data-attributes
// console.log(logo.dataset.versionNumber);

// //Classes
// logo.classList.add('c', 'h');
// logo.classList.remove('c', 'h');
// logo.classList.contains('hutin puy');
// logo.classList.toggle('c');

// //Don't use this. It's override all the existing classes
// logo.clasName = 'jonas';

// btnScrollTo.addEventListener('click', function (e) {
//   const s1scrollto = section1.getBoundingClientRect();

//   console.log('Current scroll(X/Y)', window.pageXOffset, window.pageYOffset); //distance from the top of the viewport to the top of the browser

//   console.log(
//     'hieght/width viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   ); //width and hieght of the viewport

//   //scrolling
//   // window.scrollTo({
//   //   left: s1scrollto.left + window.pageXOffset,
//   //   top: s1scrollto.top + window.pageYOffset,
//   //   behavior: 'smooth',
//   // }); //oldschool way

//   section1.scrollIntoView({
//     behavior: 'smooth',
//   }); //modern way
// });

//
// const h1 = document.querySelector('h1');

// const alertH1 = function (e) {
//   alert('Greate! You are reading this heading!');
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('Greate! You are reading this heading!');
// };

//Event Propagation in Practice

//rgb(255,255,255)

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// });
/////////////////////////////////////////////////////////////////

//page navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// }); //this way isn't right for performance because we have lot's of links in our app and it would have had a negative effect on performance

//DOM Traversing
// const h1 = document.querySelector('h1');

// console.log(h1);

// //work with child elements
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// console.log(h1.firstElementChild);
// console.log(h1.lastElementChild);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'red';

// //work with parent elements

// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// //work with sibling elements
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling); //it's almotst not use
// console.log(h1.nextSibling); //it's almotst not use

// console.log(h1.parentElement.children);//get all siblings including the element itself

// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });
