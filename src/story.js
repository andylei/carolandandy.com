import './story.css';
import 'vis/dist/vis.css';
import loadGoogleMapsAPI from 'load-google-maps-api';
import vis from 'vis';

const GMAP_API_KEY = 'AIzaSyDWkfZYTFW_9d2eIJwFnXznFWIXmiMQIr4';
const METER_TO_MILE = 0.000621371;

let container = document.getElementById('timeline');
let i = 0;
for (let di of data) {
  di.id = i;
  i++;
}
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
    prevCarol: null,
    curr: -1
  };

  let timeline;
  let timelineOpts = {
    zoomable: false,
    onInitialDrawComplete: function() {
      timeline.setWindow('1987-09-01', '1998-01-01', {animation: false});
    }
  };

  function latlng(loc) {
    return new gMaps.LatLng(loc.lat, loc.lng);
  }

  function computeDist() {
    if (!state.prevAndy || !state.prevCarol) {
      return null;
    }
    let m = gMaps.geometry.spherical.computeDistanceBetween(
      latlng(state.prevAndy.loc), latlng(state.prevCarol.loc));
    return Math.round(m * METER_TO_MILE);
  }

  function smoothPan(target) {
    let current = map.getBounds();
    let c = {
      north: current.getNorthEast().lat(),
      east: current.getNorthEast().lng(),
      south: current.getSouthWest().lat(),
      west: current.getSouthWest().lng()
    };
    let stepSize = Math.min(
      Math.abs(c.north - c.south),
      Math.abs(c.west - c.east)
    ) / 2;
    let keys = ['north', 'east', 'south', 'west'];
    let panTo = {};
    let lastStep = false;
    let deltas = {};
    for (let key of keys) {
      let sign = target[key] > c[key] ? 1 : -1;
      let delta = Math.abs(c[key] - target[key]);
      deltas[key] = delta;
      let step = sign * Math.min(stepSize, delta);
      panTo[key] = c[key] + step;
    }
    if (deltas.north < stepSize && deltas.south < stepSize) {
      lastStep = true;
    } else if (deltas.west < stepSize && deltas.east < stepSize) {
      lastStep = true;
    }
    if (!lastStep) {
      gMaps.event.addListenerOnce(map, 'idle', function() {
        smoothPan(target);
      });
    } else {
      console.log(deltas);
      console.log(stepSize);
      console.log(panTo);
      console.log(target);
    }
    map.fitBounds(panTo);
  }

  timeline = new vis.Timeline(container, data, groups, timelineOpts);
  document.getElementById('next').addEventListener('click', function() {
    if (state.curr >= data.length - 1) {
      return;
    }

    state.curr += 1;
    timeline.setSelection(state.curr, {focus: true});

    let event = data[state.curr];
    console.log(event);

    // place a marker at the new event
    let letter = event.group.substr(0, 1).toUpperCase();
    let marker = new gMaps.Marker({
      animation: gMaps.Animation.DROP,
      position: event.loc,
      map
    });
    event.marker = marker;

    // show on map pics
    let info = new gMaps.InfoWindow({
      content: buildInfoWindowContent(event)
    });
    info.open(map, marker);
    event.info = info;

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

    // clear out dom for old events
    if (discardedEvent) {
      if (discardedEvent.marker) {
        discardedEvent.marker.setMap(null);
        discardedEvent.marker = null;
      }
      if (discardedEvent.info) {
        discardedEvent.info.close();
        discardedEvent.info = null;
      }
    }

    document.getElementById('dist').innerText = computeDist() + ' miles';
    events = [state.prevAndy, state.prevCarol].filter(Boolean);

    switch (events.length) {
      case 2:
        // build a bounding box of the visible events
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
  key: GMAP_API_KEY,
  libraries: ['geometry']
}).then(initMap);