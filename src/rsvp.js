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

function test_init() {
  let name$ = document.getElementById('rsvp-name');
  name$.value = 'david lei';
  name$.dispatchEvent(new Event('input'));
  // document.getElementById('rsvp-ok').click();
}

function init() {
  bindRsvpSearchEvents();
  handleRsvpVisibility();
  init_nav_button();
  document.getElementById('rsvp-name').focus();
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

function bindGuestEvents() {
  for (let input of document.querySelectorAll('.name > input[type=text]')) {
    input.addEventListener('input', function(event) { handleGuestNameInput(event.target.form) } );
  }
  for (let input of document.querySelectorAll('.coming input[type=radio]')) {
    input.addEventListener('input', function(event) { handleGuestNameInput(event.target.form) } );
  }
  for (let btn of document.querySelectorAll('.dietary > button')) {
    btn.addEventListener('click', handleDietaryExpansion);
  }
  document.querySelector('form#guests').addEventListener('submit', handleGuestSave);
}

function getFormData(form$) {
  let data = new FormData(form$);
  let result = {};
  for (let item of data) {
    result[item[0]] = item[1];
  }
  return result;
}

function isFormValid(form) {
  let res = LOADED_RESERVATION;
  if (!res) {
    return;
  }
  let formData = getFormData(form);
  for (let guest of res.guests) {
    if (guest.name) {
      continue;
    }
    let coming = formData['coming-' + guest.id] === 'yes';
    let name = formData['name-' + guest.id];
    if (coming && !name) {
      return false;
    }
  }
  return true
}

function handleDietaryExpansion(e) {
  e.preventDefault();
  hideEle(e.target);
  showEle(e.target.nextElementSibling)
  e.target.nextElementSibling.focus();
}

function handleGuestNameInput(form$) {
  let button = document.getElementById('guests-save');
  if (isFormValid(form$)) {
    button.removeAttribute('disabled');
  } else {
    button.setAttribute('disabled', 'disabled');
  }
}

function handleGuestSave(event) {
  event.preventDefault();
  let res = LOADED_RESERVATION;
  if (!res) {
    return;
  }
  guestSaveLoading();
  let formData = getFormData(event.target);
  for (let guest of res.guests) {
    guest.coming = formData['coming-' + guest.id] === 'yes';
    let name = formData['name-' + guest.id];
    if (name) {
      guest.name = name;
    }
    guest.dinner = formData['dinner-' + guest.id] || null;
    guest.dietary = formData['dietary-' + guest.id] || null;
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
  let anyComing = guests.filter(g => g.coming).length;
  let text = anyComing
    ? 'Thanks for RSVPing! Excited to see you  at the wedding!'
    : "Sorry you can't make it! Hope to see you soon!";
  document.getElementById('success').innerText = text;
  show('success');
}

function showCatastrophicFailure() {
  let errorEle = document.getElementById('reservation-error');
  errorEle.innerHTML = `
    Something bad happened. It's probaby Andy's fault.<br>
    Try again later, or contact Andy or Carol with your RSVP.
  `;
  showEle(errorEle);
  hide('rsvp-name');
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

function showAlreadyRsvpd(guests) {
  for (let guest of guests) {
    if (guest.coming == null) {
      return false;
    }
  }

  let errorEle = document.getElementById('reservation-error');
  errorEle.innerHTML = `
    It looks like you already RSVP'd.
    <br>
    If we made a mistake or you need to change your RSVP, please
    contact Andy or Carol directly.
  `;
  showEle(errorEle);
  hide('rsvp-ok');
  document.getElementById('rsvp-name').setAttribute('disabled', 'disabled')
  return true;
}

function showReservation(json) {
  LOADED_RESERVATION = json;
  let guests = json.guests;

  // if the guests hav already rsvp'd show an error
  if (showAlreadyRsvpd(guests)) {
    return;
  }

  hide('find-reservation');
  show('show-reservation');
  let guestList = document.getElementById('guest-list');
  for (let guest of guests) {
    let nameHtml;
    if (guest.name) {
      nameHtml = guest.name;
    } else {
      nameHtml = `<input type="text" name="name-${guest.id}" placeholder="name of +1" />`;
    }
    let template = document.createElement('template');
    template.innerHTML = `
      <div class="guest">
        <div class="name">${nameHtml}</div>
        <div class="rsvp">
          <div class="coming">
            <div class="question">RSVP</div>
            <div class="answer">
              <input
                type="radio"
                name="coming-${guest.id}"
                id="coming-${guest.id}-yes"
                value="yes"
                checked="checked"
              >
              <label for="coming-${guest.id}-yes">Happily accepts</label>
              <input
                type="radio"
                name="coming-${guest.id}"
                id="coming-${guest.id}-no"
                value="no"
              >
              <label for="coming-${guest.id}-no">Regretfully declines</label>
            </div>
          </div>
          <div class="dinner">
            <div class="question">
              Dinner
            </div>
            <div class="answer">
              <input
                type="radio"
                name="dinner-${guest.id}"
                id="dinner-${guest.id}-beef"
                value="beef"
                checked="checked"
              >
              <label for="dinner-${guest.id}-beef">Chili citrus short rib</label>
              <input
                type="radio"
                name="dinner-${guest.id}"
                id="dinner-${guest.id}-fish"
                value="fish"
              >
              <label for="dinner-${guest.id}-fish">Miso roasted salmon</label>
              <div class="dietary">
                <button>Dietary restrictions?</button>
                <textarea class="hidden" name="dietary-${guest.id}" placeholder="Dietary restrictions?"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>`.trim();
    guestList.appendChild(template.content.firstElementChild);
  }
  handleGuestNameInput(document.getElementById('guests'));
  bindGuestEvents();
  document.querySelectorAll('.guest').forEach(g => g.classList.add('visible'))
}

init();
