// Portfolio Data Loading

// Portfolio container element
const portfolioContainer = document.querySelector('.portfolio-items-container');

// Stores project data and current selections
let portfolioData = [];
let currentItems = [];
let itemIndex = 0;

// Load project data from JSON file
async function loadPortfolio() {
	try {
		const response = await fetch('js/projects.json');

		portfolioData = await response.json();

		currentItems = portfolioData;

		// Display portfolio items if container exists
		if (portfolioContainer) {
			displayPortfolioItems(portfolioData);

			setupFilterButtons();
		}

		// Initialize carousel if on portfolio page
		if (document.querySelector('.carousel-item')) {
			initCarousel(portfolioData);
		}
	} catch (error) {
		console.error('Error loading JSON', error);
	}
}

// Create portfolio cards dynamically
function displayPortfolioItems(items) {
	portfolioContainer.innerHTML = '';

	items.forEach((item, index) => {
		const portfolioItem = document.createElement('div');

		portfolioItem.classList.add('portfolio-item', 'show');

		portfolioItem.setAttribute('data-category', item.category);

		portfolioItem.innerHTML = `
		<div class = "portfolio-item-inner">
			<div class = "portfolio-img">
				<img src="${item.image}" alt = "${item.title}">
			</div>

			<div class = "portfolio-info">
				<h4>${item.title}</h4>

				<div class = "icon">
					<i class = "fa fa-search"></i>
				</div>
			</div>

			<div class = "portfolio-description">
				<p>${item.description}</p>
			</div>
		</div>
		
		`;

		// Open lightbox when item is clicked
		portfolioItem.addEventListener('click', () => {
			itemIndex = index;
			changeItem();
			toggleLightBox();
		});

		portfolioContainer.appendChild(portfolioItem);
	});
}

/*Navbar Functionality*/
var navbar = document.querySelector('.navbar');

// Add sticky class while scrolling
function handleScroll() {
	const scrollY = window.scrollY;

	if (scrollY > window.innerHeight * 0.2) {
		navbar.classList.add('sticky');
	} else {
		navbar.classList.remove('sticky');
	}
}

window.addEventListener('scroll', handleScroll, { passive: true });

if (
	window.location.pathname.endsWith('index.html') ||
	window.location.pathname === '/'
) {
	window.addEventListener('scroll', scrollActive, { passive: true });
}

/*Mobile navigation menu*/
const navMenu = document.querySelector('.menu');
const navToggle = document.querySelector('.menu-btn');

// Toggle mobile menu visibility
if (navToggle) {
	navToggle.addEventListener('click', () => {
		navMenu.classList.toggle('active');
	});
}

// Close menu after clicking a link
const navLink = document.querySelectorAll('.nav-link');
function linkAction() {
	const navMenu = document.querySelector('.menu');
	navMenu.classList.remove('active');
}
navLink.forEach((n) => n.addEventListener('click', linkAction));

/*Active Navigation Links*/
const sections = document.querySelectorAll('section[id]');

// Highlight current section while scrolling
function scrollActive() {
	const scrollY = window.pageYOffset;

	//Reset all links first
	document.querySelectorAll('.links a').forEach((link) => {
		link.classList.remove('active');
	});

	//Find the active section
	sections.forEach((current) => {
		const sectionHeight = current.offsetHeight;
		const sectionTop = current.offsetTop - 50;
		const sectionId = current.getAttribute('id');

		const link = document.querySelector(`.links a[href*="${sectionId}"]`);
		if (!link) return;

		if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
			link.classList.add('active');
		} else {
			link.classList.remove('active');
		}
	});
}

/*Highlight current page link*/
const currentPage = window.location.pathname.split('/').pop();

const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach((link) => {
	link.classList.remove('active');

	if (link.getAttribute('href') === currentPage) {
		link.classList.add('active');
	}
});

/*Skills Progress Animation*/
const skills_wrap = document.querySelector('.about-skills');
const skills_bar = document.querySelectorAll('.progress-line');
window.addEventListener('scroll', () => {
	skillsEffect();
});

window.addEventListener('load', () => {
	const currentPage = window.location.pathname.split('/').pop();

	if (currentPage === 'about.html') {
		skills_bar.forEach((skill) => {
			skill.style.width = skill.dataset.progress;
		});
	}
});

function checkScroll(el) {
	let rect = el.getBoundingClientRect();

	if (window.innerHeight >= rect.top + el.offsetHeight) {
		return true;
	} else {
		return false;
	}
}

// Animate skill progress bars
function skillsEffect() {
	if (!skills_wrap) return;

	if (!checkScroll(skills_wrap)) return;

	skills_bar.forEach((skill) => (skill.style.width = skill.dataset.progress));
}

/*Portfolio Filtering*/
const filterContainer = document.querySelector('.portfolio-filter');

// Filter projects by category
function setupFilterButtons() {
	const filterBtns = filterContainer.children;

	for (let btn of filterBtns) {
		btn.addEventListener('click', function () {
			filterContainer.querySelector('.active').classList.remove('active');

			this.classList.add('active');

			const filterValue = this.getAttribute('data-filter');

			if (filterValue === 'all') {
				currentItems = portfolioData;

				itemIndex = 0;

				initCarousel(portfolioData);

				displayPortfolioItems(portfolioData);
			} else {
				const filteredItems = portfolioData.filter(
					(item) => item.category === filterValue,
				);

				currentItems = filteredItems;

				itemIndex = 0;

				displayPortfolioItems(filteredItems);

				initCarousel(filteredItems);
			}
		});
	}
}

/*Lightbox*/

// Lightbox elements
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxText = document.querySelector('.caption-text');
const lightboxCounter = document.querySelector('.caption-counter');

// Open/close lightbox
function toggleLightBox() {
	lightbox.classList.toggle('open');
}

// Update lightbox content
function changeItem() {
	const currentItem = currentItems[itemIndex];

	// Update image, text and counter
	lightboxImg.src = currentItem.image;

	lightboxText.innerHTML = currentItem.title;

	lightboxCounter.innerHTML = itemIndex + 1 + ' of ' + currentItems.length;
}

// Navigate through items
function nextItem() {
	itemIndex++;

	if (itemIndex >= currentItems.length) {
		itemIndex = 0;
	}

	changeItem();
}

function prevItem() {
	itemIndex--;

	if (itemIndex < 0) {
		itemIndex = currentItems.length - 1;
	}

	changeItem();
}

/*Lightbox buttons*/

document.querySelector('.next-item').addEventListener('click', nextItem);

document.querySelector('.prev-item').addEventListener('click', prevItem);

lightboxClose.addEventListener('click', toggleLightBox);

lightbox.addEventListener('click', function (event) {
	if (event.target === lightbox) {
		toggleLightBox();
	}
});

/*Carousel*/
let carouselIndex = 0;
let carouselItems = [];
let autoPlay;

// Initialize carousel

function initCarousel(items = portfolioData) {
	carouselItems = items;

	carouselIndex = 0;

	createDots();
	updateCarousel();
	startAutoPlay();
}

// Update displayed carousel item
function updateCarousel() {
	if (!carouselItems.length) return;

	const carouselImg = document.querySelector('.carousel-img');
	const carouselTitle = document.querySelector('.carousel-title');
	const carouselDesc = document.querySelector('.carousel-desc');

	if (!carouselImg || !carouselTitle || !carouselDesc) return;

	const item = carouselItems[carouselIndex];

	carouselImg.src = item.image;
	carouselTitle.textContent = item.title;
	carouselDesc.textContent = item.description;

	updateDots();
}

// Move to next slide
function nextCarousel() {
	if (!carouselItems.length) return;

	carouselIndex = (carouselIndex + 1) % carouselItems.length;

	updateCarousel();
}

// Move to previous slide
function prevCarousel() {
	if (!carouselItems.length) return;

	carouselIndex =
		(carouselIndex - 1 + carouselItems.length) % carouselItems.length;

	updateCarousel();
}

/*Carousel Autoplay*/

// Automatically change slides
function startAutoPlay() {
	clearInterval(autoPlay);

	autoPlay = setInterval(() => {
		nextCarousel();
	}, 3000);
}

/*Carousel Navigation Dots*/

// Create dots dynamically
function createDots() {
	const dotsContainer = document.querySelector('.carousel-dots');

	if (!dotsContainer) return;

	dotsContainer.innerHTML = '';

	carouselItems.forEach((item, index) => {
		const dot = document.createElement('button');

		dot.classList.add('carousel-dot');

		dot.addEventListener('click', () => {
			carouselIndex = index;
			updateCarousel();
			startAutoPlay();
		});
		dotsContainer.appendChild(dot);
	});
}

// Update active dot
function updateDots() {
	const dots = document.querySelectorAll('.carousel-dot');

	dots.forEach((dot, index) => {
		dot.classList.toggle('active', index === carouselIndex);
	});
}

const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');

if (nextBtn && prevBtn) {
	nextBtn.addEventListener('click', () => {
		nextCarousel();
		startAutoPlay();
	});
	prevBtn.addEventListener('click', () => {
		prevCarousel();
		startAutoPlay();
	});
}

/*Initialize Scripts*/

// Load Portfolio Data
if (portfolioContainer) {
	loadPortfolio();
}
