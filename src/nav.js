function nav() {
  return document.getElementById('nav');
}

export default function init_nav_button() {
  nav().addEventListener('click', navToggleHandler);
}

function navToggleHandler()  {
  nav().classList.toggle('open');
}

export {
  navToggleHandler
}
