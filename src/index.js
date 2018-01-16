require("./style.css");

const countdown = require('countdown');
const THE_DATE = new Date(2018, 8, 18, 17);
const COUNTDOWN_UNITS = countdown.DAYS | countdown.HOURS | countdown.MINUTES;

const SECONDS = 1000;
const MINUTES = SECONDS * 60;

function tick_countdown() {
  let s = countdown(THE_DATE, null, COUNTDOWN_UNITS).toString();
  let elements = document.getElementsByClassName('countdown');
  for (let ele of elements) {
    ele.innerHTML = s.replace(' and', ',');
  }
}

function begin_countdown_loop() {
  tick_countdown();
  window.setInterval(tick_countdown, 1 * MINUTES);
}

begin_countdown_loop();
