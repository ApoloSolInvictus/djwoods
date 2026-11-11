const chapters = [...document.querySelectorAll('.story-section')];
const chapterLinks = [...document.querySelectorAll('[data-nav-link]')];
const progress = document.querySelector('.reading-progress span');

function activateChapter(id) {
  const activeIndex = chapters.findIndex((chapter) => chapter.id === id);
  if (activeIndex < 0) return;

  chapters.forEach((chapter, index) => {
    chapter.classList.toggle('is-active', index === activeIndex);
    chapter.classList.toggle('scene-section-active', index === activeIndex);
  });

  chapterLinks.forEach((link) => {
    if (link.getAttribute('href') === `#${id}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  progress.style.width = `${((activeIndex + 1) / chapters.length) * 100}%`;
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const mostVisible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (mostVisible) activateChapter(mostVisible.target.id);
  }, { threshold: [0.3, 0.55, 0.8] });

  chapters.forEach((chapter) => observer.observe(chapter));
} else {
  activateChapter(chapters[0]?.id);
}

document.querySelectorAll('a[href^="#chapter-"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', link.getAttribute('href'));
  });
});
