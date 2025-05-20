// Animate sections on scroll
const sections = document.querySelectorAll('.section');
const options = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      entry.target.querySelector('.text')?.classList.add('show');
    }
  });
}, options);

sections.forEach(section => observer.observe(section));
