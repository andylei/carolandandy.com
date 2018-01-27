require('./story.css');
require('vis/dist/vis.css');
const loadGoogleMapsAPI = require('load-google-maps-api');
const vis = require('vis');

const GMAP_API_KEY = 'AIzaSyDWkfZYTFW_9d2eIJwFnXznFWIXmiMQIr4';

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
  zoomable: false
};
let groups = [
  {id: 'andy', content: 'Andy'},
  {id: 'carol', content: 'Carol'},
];

let timeline = new vis.Timeline(container, data, groups, opts);

function initMap(gMaps) {
  let map = new gMaps.Map(document.getElementById('map'), {
    zoom: 3,
    center: new gMaps.LatLng(2.8,-187.3),
    mapTypeId: 'terrain',
    disableDefaultUI: true,
    gestureHandling: 'none',
    keyboardShortcuts: false
  });
}

loadGoogleMapsAPI({key: GMAP_API_KEY}).then(initMap);