require('./story.css');
require('vis/dist/vis.css');

const vis = require('vis');

let container = document.getElementById('timeline');
let data = [
  {group: 'andy', content: 'Andy is Born!', start: '1988-04-22'},
  {group: 'carol', content: 'Carol is Born', start: '1988-05-02'},
  {group: 'andy', content: 'Andy moves to America', start: '1991-04-01'},
  {group: 'carol', content: 'Carol moves to NY', start: '2010-08-01'},
  {group: 'both', content: 'We get engaged', start: '2016-11-20'},
  {group: 'both', content: 'Wedding!', start: '2018-08-18'},
];
let i = 0;
for(let di of data) {
  data.id = i;
  i++;
}
let opts = {
  zoomable: false,
  type: 'point'
};
let timeline = new vis.Timeline(container, data, opts);
