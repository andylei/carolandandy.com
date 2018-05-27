import "./style.css";
import "./photos.css";

import init_nav_button from "./nav";

import ScrollMagic from 'ScrollMagic';
import 'animation.gsap';

function init() {

  init_nav_button();

  let controller = new ScrollMagic.Controller();

  new ScrollMagic.Scene({ duration: 400 })
    .setTween("#title", { opacity: 0 })
    .addTo(controller);
  
  let years = ['proposal'];
  for (let i = 1988; i < 2018; i++) {
    years.push(i);
  }
  
  for (let i of years) {
    let ele = `.caption.y${i}`;
    if (!ele) {
      continue;
    }
    new ScrollMagic.Scene({
        duration: 400,
        offset: i === 1988 ? 200 : 50,
        triggerElement: ele
      })
      .setTween(ele, { opacity: 0 })
      .addTo(controller);
  }
}

init();
