import "./style.css";
import "./party.css";

let index = 0;
const fonts = ['rl', 'ab', 'lo', 'no', 'pl'];

let ele = document.getElementsByTagName('h1')[0];
ele.addEventListener('click', function() {
  let body = document.getElementsByTagName('body')[0];
  body.classList.remove(fonts[index]);
  index = (index + 1) % fonts.length;
  body.classList.add(fonts[index]);
});