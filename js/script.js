document.addEventListener('DOMContentLoaded', () => {
    // Function to toggle the visibility of the navigation menu
function toggleMenu() {
    var nav = document.querySelector('nav');
    nav.classList.toggle('active');
}

// Adding event listener to the menu icon
document.getElementById('menuIcon').addEventListener('click', toggleMenu);
  
    // Smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
  
    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = event.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        targetElement.scrollIntoView({ behavior: 'smooth' });
      });
    });
  
    // Sticky header
    const header = document.querySelector('.header');
    const heroSection = document.querySelector('.row');
  
    window.addEventListener('scroll', () => {
        if (window.scrollY > heroSection.offsetTop){
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  
    // Product hover animation
    const products = document.querySelectorAll('.col-4');
  
    products.forEach((product) => {
      product.addEventListener('mouseenter', () => {
        product.classList.add('hover');
      });
      product.addEventListener('mouseleave', () => {
        product.classList.remove('hover');
      });
    });
  });
  