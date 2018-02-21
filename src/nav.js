export default function init_nav_button() {
  let nav = document.getElementById('nav');
  nav.addEventListener('click', function() {
    nav.classList.toggle('open');
  })
}