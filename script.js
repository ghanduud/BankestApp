'use strict';

//decleration
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelectorAll('.nav__link');
const navContainer = document.querySelector('.nav__links');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const operationTabs = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const navHeight = nav.getBoundingClientRect().height;

let currentSlide = 0;

//seting page

//initial slider
positionSlides(currentSlide);
//create dots for the slider
createDots();
//opservers
observers();
//event listeners
settingEventListeners();

//Functions
function observers() {
	const headerObsOptions = {
		root: null,
		threshold: 0,
		rootMargin: `-${navHeight}px`,
	};
	const headerObserver = new IntersectionObserver(stickyNav, headerObsOptions);
	headerObserver.observe(header);

	const sectionObsOptions = {
		root: null,
		threshold: 0.15,
	};
	const sectionObserver = new IntersectionObserver(revealSection, sectionObsOptions);
	allSections.forEach((s) => {
		s.classList.add('section--hidden');
		sectionObserver.observe(s);
	});

	const imgOpsOptions = {
		root: null,
		threshold: 0,
		rootMargin: '200px',
	};
	const imgObserver = new IntersectionObserver(loadImg, imgOpsOptions);
	imgTargets.forEach((img) => imgObserver.observe(img));
}

function settingEventListeners() {
	btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));

	btnCloseModal.addEventListener('click', closeModal);

	overlay.addEventListener('click', closeModal);

	document.addEventListener('keydown', checkingPressedKey);

	btnScrollTo.addEventListener('click', scrollToSection1);

	navContainer.addEventListener('click', scrollToSection);

	tabContainer.addEventListener('click', changeTap);

	nav.addEventListener('mouseover', handleHover.bind(0.5));

	nav.addEventListener('mouseout', handleHover.bind(1));

	btnRight.addEventListener('click', moveRight);

	btnLeft.addEventListener('click', moveLeft);

	dotContainer.addEventListener('click', movingWithDots);
}
function checkingPressedKey(e) {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	} else if (e.key === 'ArrowLeft') {
		moveLeft();
	} else if (e.key === 'ArrowRight') {
		moveRight();
	}
}

function scrollToSection(e) {
	e.preventDefault();
	const id = e.target.getAttribute('href');
	if (id) {
		document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
	}
}

function scrollToSection1() {
	// const s1coords = section1.getBoundingClientRect();
	// console.log(s1coords);
	// window.scrollTo(s1coords.left + window.scrollX, s1coords.top + window.scrollY);
	// window.scrollTo({
	// 	left: s1coords.left + window.scrollX,
	// 	top: s1coords.top + window.scrollY,
	// 	behavior: 'smooth',
	// });
	section1.scrollIntoView({ behavior: 'smooth' });
}

function closeModal() {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
}

function openModal(e) {
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
}

function changeTap(e) {
	e.preventDefault();
	const clicked = e.target.closest('.operations__tab');
	if (!clicked) return;
	//change the active button
	const tapNumber = clicked.dataset.tab;
	tabs.forEach((btn) => btn.classList.remove('operations__tab--active'));
	clicked.classList.add('operations__tab--active');

	//changing tap
	operationTabs.forEach((tap) => tap.classList.remove('operations__content--active'));
	document.querySelector(`.operations__content--${tapNumber}`).classList.add('operations__content--active');
}

function handleHover(e) {
	if (!e.target.classList.contains('nav__link')) return;
	const link = e.target;

	const sibling = link.closest('.nav').querySelectorAll('.nav__link');
	const logo = link.closest('.nav').querySelector('img');

	sibling.forEach((el) => {
		if (el === link) return;
		el.style.opacity = this;
	});
	logo.style.opacity = this;
}

function stickyNav(entries) {
	const [entry] = entries;
	entry.isIntersecting ? nav.classList.remove('sticky') : nav.classList.add('sticky');
}

function revealSection(entries, observer) {
	const [entry] = entries;
	if (!entry.isIntersecting) return;
	entry.target.classList.remove('section--hidden');
	observer.unobserve(entry.target);
}

function loadImg(entries, observer) {
	const [entry] = entries;
	if (!entry.isIntersecting) return;
	entry.target.src = entry.target.dataset.src;
	entry.target.addEventListener('load', () => entry.target.classList.remove('lazy-img'));
	observer.unobserve(entry.target);
}

function positionSlides(curSlide) {
	currentSlide = Number(curSlide);
	slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`));
}

function moveRight() {
	if (currentSlide === slides.length - 1) currentSlide = 0;
	else currentSlide++;
	positionSlides(currentSlide);
	activateDot(currentSlide);
}

function moveLeft() {
	if (currentSlide === 0) currentSlide = slides.length - 1;
	else currentSlide--;
	positionSlides(currentSlide);
	activateDot(currentSlide);
}

function createDots() {
	slides.forEach((_, i) => {
		const html = `
		<button class="dots__dot" data-slide="${i}"></button>
		`;
		dotContainer.insertAdjacentHTML('beforeend', html);
	});
	activateDot(currentSlide);
}

function movingWithDots(e) {
	if (!e.target.classList.contains('dots__dot')) return;
	const { slide } = e.target.dataset;
	positionSlides(slide);
	activateDot(slide);
}

function activateDot(slide) {
	document.querySelectorAll('.dots__dot').forEach((dot) => dot.classList.remove('dots__dot--active'));
	document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

////////////////////////////////////////////////////////////////////

// const obsCallback = function (entries, observer) {
// 	entries.forEach((entry) => {
// 		console.log(entry);
// 	});
// };

// const obsOptions = {
// 	root: null,
// 	threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);

// observer.observe(section1);

// const obsCallback = function (entries, observer) {
// 	entries.forEach((entry) => {
// 		console.log(entry);
// 	});
// };

// const obsOptions = {
// 	root: null,
// 	threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// console.log(document.documentElement);
// console.log(document.body);

// const header = document.querySelector('.header');
// const t = document.querySelector('img[alt="Minimalist bank items"]');
// console.log(t);
// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// const all = document.querySelectorAll('*');
// console.log(all);

// document.getElementById('section--1');
// const btns = document.getElementsByTagName('button');
// const alsec = document.getElementsByClassName('section');

// console.log(alsec);
// console.log(btns);

// //////////////////////////////////////////////////////////
// const massage = document.createElement('div');
// // TWO WAYS TO SET CLASS NAMES

// // massage.classList.add('cookie-massage');
// massage.className = 'cookie-massage';

// // massage.textContent = 'we use cookie for improve functionality and analytic';
// massage.innerHTML =
// 	"we use cookie for improve functionality and analytic <button class='btn btn--close-cookie'>Got it!</button>";
// console.log(massage.classList);
// header.prepend(massage);
// header.append(massage);
// header.before(massage);
// header.after(massage);

// document.querySelector('.btn--close-cookie').addEventListener('click', () => massage.remove());

// massage.style.backgroundColor = '#37383d';
// massage.style.width = '80%';

// console.log(massage.style.backgroundColor);

// console.log(getComputedStyle(massage).height);
// massage.style.height = Number.parseFloat(getComputedStyle(massage).height, 10) + 40 + 'px';

// console.log(getComputedStyle(massage).height);

// document.documentElement.style.setProperty('--color-primary', 'red');

// const logo = document.querySelector('.nav__logo');

// console.log(logo.alt);
// console.log(logo.src);

// //non standerd

// console.log(logo.designer);

// console.log(logo.getAttribute('src'));
// console.log(logo.getAttribute('designer'));

// logo.setAttribute('alt', 'Hello');
// console.log(logo.getAttribute('alt'));

// console.log(logo.dataset.versionNumber);

// const h1 = document.querySelector('h1');

// h1.addEventListener('mouseenter', function (e) {
// 	alert('addEventListener: great!');
// });

// h1.onmouseenter = function (e) {
// 	alert('addEventListener: great!');
// };

// h1.addEventListener('mouseenter', function (e) {
// 	alert('addEventListener: great!');
// });

// const alertH1 = function (e) {
// 	alert('addEventListener: great!');
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
// 	this.style.backgroundColor = randomColor();
// 	console.log(e.target, e.currentTarget);
// 	e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
// 	this.style.backgroundColor = randomColor();
// 	console.log(e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
// 	this.style.backgroundColor = randomColor();
// 	console.log(e.target, e.currentTarget);
// });

// document.addEventListener('DOMContentLoaded', (e) => {
// 	console.log('HTML parsed and Dom tree Built', e);
// });
