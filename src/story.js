import './story.css';
import 'vis/dist/vis.css';
import loadGoogleMapsAPI from 'load-google-maps-api';
import vis from 'vis';
import data from './storydata.js';

const GMAP_API_KEY = 'AIzaSyDWkfZYTFW_9d2eIJwFnXznFWIXmiMQIr4';

let container = document.getElementById('timeline');
let i = 0;
for (let di of data) {
  di.id = i;
  i++;
}
let opts = {
  zoomable: false
};
let groups = [{
    id: 'andy',
    content: 'Andy'
  },
  {
    id: 'carol',
    content: 'Carol'
  },
];

function mod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * Box that bounds the two points, with some padding on both sides
 * 
 * @param {*} loc0 
 * @param {*} loc1 
 * @returns {north, south, east, west}
 */
function smartBound(loc0, loc1) {
  // latitude is straightforward, the smaller one is the southernmost point
  let s = Math.min(loc0.lat, loc1.lat);
  let n = Math.max(loc0.lat, loc1.lat);
  let height = n - s;
  s -= (height * .2);
  n += (height * .2);

  // longitude is harder because the coordinates wrap around.
  // do some math to figure out which direction gives you the smaller box.
  let lngDiff0 = mod(loc0.lng - loc1.lng, 360);
  let lngDiff1 = mod(- loc0.lng + loc1.lng, 360);
  let [e, w] = [loc0.lng, loc1.lng];
  let width = lngDiff0;
  if (lngDiff0 > lngDiff1) {
    [e, w] = [w, e];
    width = lngDiff1;
  }
  console.log(w, e);
  w -= (width * .2);
  e += (width * .2);

  return {north: n, south: s, east: e, west: w};
}

function buildInfoWindowContent(event) {
  let img = event.img ? `<img class="on-map" src="${event.img}">` : '';
  return `
    <div class="date">${event.start}</div>
    <div class="desc">${event.desc}</div>
    ${img}
  `;
}

function initMap(gMaps) {
  function gcoord(loc) {
    return new gMaps.LatLng(loc.lat, loc.lng);
  }
  let map = new gMaps.Map(document.getElementById('map'), {
    zoom: 3,
    center: new gMaps.LatLng(2.8, -187.3),
    mapTypeId: 'terrain',
    disableDefaultUI: true,
    //gestureHandling: 'none',
    keyboardShortcuts: false
  });

  let state = {
    prevAndy: null,
    prevCarol: null
  };

  let timeline = new vis.Timeline(container, data, groups, opts);

  timeline.on('select', function (selectEvent) {
    if (!selectEvent.items) {
      return;
    }
    let event = data[selectEvent.items[0]];
    console.log(event);

    // place a marker at the new event
    let letter = event.group.substr(0, 1).toUpperCase();
    let marker = new gMaps.Marker({
      animation: gMaps.Animation.DROP,
      // icon: "http://maps.google.com/mapfiles/marker" + letter + ".png",
      position: event.loc,
      map
    });
    event.marker = marker;

    // show on map pics
    let info = new gMaps.InfoWindow({
      content: buildInfoWindowContent(event)
    });
    info.open(map, marker);

    // figure out which events should be visible
    let discardedEvent = null;
    let events;
    if (event.group === 'andy') {
      discardedEvent = state.prevAndy;
      state.prevAndy = event;
    } else if (event.group === 'carol') {
      discardedEvent = state.prevCarol;
      state.prevCarol = event;
    }

    // clear out markers for old events
    if (discardedEvent && discardedEvent.marker) {
      discardedEvent.marker.setMap(null);
      discardedEvent.marker = null;
    }

    events = [state.prevAndy, state.prevCarol].filter(Boolean);

    // build a bounding box of the visible events
    switch (events.length) {
      case 2:
        let bound = smartBound(events[0].loc, events[1].loc)
        let boundWidth = Math.abs(bound.west - bound.east);
        if (boundWidth < 100) {
          map.fitBounds(bound);
          break;
        }
      case 1:
        let loc = event.loc;
        map.panTo(loc);
        break;
      default:
        return;
    }
  });
}

loadGoogleMapsAPI({
  key: GMAP_API_KEY
}).then(initMap);