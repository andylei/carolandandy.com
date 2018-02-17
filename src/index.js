require("./style.css");
require("./index.css");

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

function getEle(id) {
  return document.getElementById(id);
}

function begin_countdown_loop() {
  tick_countdown();
  window.setInterval(tick_countdown, 1 * MINUTES);
}

function show_nav() {
  getEle('links').classList.add('show');
  getEle('hamberger').classList.add('hide');
}

function hide_nav() {
  getEle('links').classList.remove('show');
  getEle('hamberger').classList.remove('hide');
}

function bind_buttons() {
  getEle('hamberger').addEventListener('click', show_nav);
}

function init() {
  begin_countdown_loop();
  bind_buttons();
}

init();
