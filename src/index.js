import "./style.css";
import "./index.css";

import init_nav_button, { navToggleHandler } from "./nav";

const countdown = require('countdown');
const THE_DATE = new Date(1534626000000);
const COUNTDOWN_UNITS = countdown.DAYS | countdown.HOURS | countdown.MINUTES;

const SECONDS = 1000;
const MINUTES = SECONDS * 60;

function tick_countdown() {
  let s = 'in ' + countdown(THE_DATE, null, COUNTDOWN_UNITS).toString();
  let elements = document.getElementsByClassName('countdown');
  for (let ele of elements) {
    ele.innerHTML = s.replace(' and', ',');
  }
}

function begin_countdown_loop() {
  tick_countdown();
  window.setInterval(tick_countdown, 1 * MINUTES);
}

function init_logo_click() {
  document.querySelector('.logo').addEventListener('click', navToggleHandler);
}

function init() {
  begin_countdown_loop();
  init_nav_button();
  init_logo_click();
}

init();
