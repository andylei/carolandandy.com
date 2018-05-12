import "./style.css";
import "./index.css";
import "./rsvp.css";

import init_nav_button from "./nav";

let HOST;
if (process.env.NODE_ENV === 'production') {
  HOST = 'https://carol-and-andy.appspot.com';
} else {
  HOST = 'http://localhost:8080';
}

let LOADED_RESERVATION = null;

function init() {
  bindRsvpSearchEvents();
  handleRsvpVisibility();
  init_nav_button();
}

function showEle(ele, animateClass) {
  ele.classList.remove('hidden');
}

function show(id, animateClass) {
  showEle(document.getElementById(id), animateClass);
}

function hideEle(ele) {
  ele.classList.add('hidden');
}

function hide(id) {
  hideEle(document.getElementById(id));
}

function bindRsvpSearchEvents() {
  document.getElementById('rsvp-ok').addEventListener('click', handleRsvpSearch);
  document.getElementById('rsvp-name').addEventListener('input', handleRsvpVisibility)
}

function bindGuestSaveEvents() {
  document.getElementById('guests-save').addEventListener('click', handleGuestSave);
}

function handleGuestSave() {
  let res = LOADED_RESERVATION;
  if (!res) {
    return;
  }
  guestSaveLoading();
  for (let guest of res.guests) {
    guest.coming = document.getElementById(`rsvp-${guest.id}`).checked;
    let nameField = document.getElementById(`name-${guest.id}`);
    if (nameField) {
      guest.name = nameField.value;
    }
  }
  res.reservation.guests = res.guests;
  let xhr = new XMLHttpRequest();
  let url = `${HOST}/reservation/${res.reservation.id}`;
  xhr.open('PUT', url);
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onload = function() {
    guestSaveDoneLoading();
    if (xhr.status === 200) {
      showSuccess(res.guests);
    } else {
      showCatastrophicFailure();
    }
  }
  xhr.send(JSON.stringify(res));
}

function handleRsvpVisibility() {
  let name = document.getElementById('rsvp-name').value;
  let enabled = name && name.trim();
  let button = document.getElementById('rsvp-ok');
  if (enabled) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', 'disabled');
  }
}

function handleRsvpSearch() {
  hide('reservation-error');
  rsvpSearchLoading();
  let name = document.getElementById('rsvp-name').value;

  let xhr = new XMLHttpRequest();
  let url = HOST + '/reservation?name=';
  xhr.open('GET', url + escape(name));
  xhr.onload = function() {
    rsvpSearchDoneLoading();
    if (xhr.status === 200) {
      showReservation(JSON.parse(xhr.responseText));
    } else if (xhr.status === 404) {
      showReservationNotFound(name);
    } else {
      showCatastrophicFailure();
    }
  };
  xhr.send();
}

function guestSaveLoading() {
  document.getElementById('guests-save').setAttribute('disabled', 'disabled');
  hide('guests-save-label');
  show('guests-save-spinner');
}

function guestSaveDoneLoading() {
  show('guests-save-label');
  hide('guests-save-spinner');
}

function showSuccess(guests) {
  hide('show-reservation');
  document.getElementById('success').innerText =
    'Thanks for RSVPing! Excited to see you  at the wedding!';
  show('success');
}

function showCatastrophicFailure() {

}

function rsvpSearchDoneLoading() {
  document.getElementById('rsvp-ok').removeAttribute('disabled');
  hide('rsvp-ok-spinner');
  show('rsvp-ok-label');
}

function rsvpSearchLoading() {
  document.getElementById('rsvp-ok').setAttribute('disabled', 'disabled');
  show('rsvp-ok-spinner');
  hide('rsvp-ok-label');
}

function showReservationNotFound(name) {
  let errorEle = document.getElementById('reservation-error');
  errorEle.innerHTML = `
    Could not find the guest <span class="name">${name}</span>.
    Please try again with your full name.
  `;
  showEle(errorEle);
  document.getElementById('rsvp-name').focus();
}

function showReservation(json) {
  bindGuestSaveEvents();
  LOADED_RESERVATION = json;
  hide('find-reservation');
  show('show-reservation');
  let guestList = document.getElementById('guest-list');
  let guests = json.guests;
  for (let guest of guests) {
    let nameHtml;
    if (guest.name) {
      nameHtml = guest.name;
    } else {
      nameHtml = `<input type="text" id="name-${guest.id}" placeholder="name of +1" />`;
    }
    let template = document.createElement('template');
    template.innerHTML = `
      <tr class="guest">
        <td class="rsvp">
          <input type="checkbox" checked="checked" id="rsvp-${guest.id}" />
        </td>
        <td class="name">${nameHtml}</td>
      </tr>`.trim();
    guestList.appendChild(template.content.firstElementChild);
  }
}

init();
