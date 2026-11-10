'use strict';

// In this demo, frontend files are served by the SAME Spring Boot application.
// Therefore relative URLs such as /api/trips work without CORS configuration.

const $ = (selector) => document.querySelector(selector);
const apiBase = '/api/trips';
let requestInProgress = false;
let trips = [];

function pretty(value) {
  return typeof value === 'string' ? value : JSON.stringify(value, null, 2);
}

function statusLabel(status) {
  const labels = {200:'OK', 201:'Created', 400:'Bad Request', 404:'Not Found'};
  return labels[status] || '';
}

function showInterpretation(status, method, path, response) {
  const messages = {
    200: method === 'GET'
      ? '200 OK — The server found the requested resource and returned JSON. Notice that GET has no request body.'
      : '200 OK — The demo data were restored. A POST can also trigger a server-side action.',
    201: '201 Created — The POST request created a new resource. Look for its new ID in the JSON body and the Location response header.',
    400: '400 Bad Request — The server understood the HTTP request but rejected the submitted data. Read the error message in the JSON response.',
    404: '404 Not Found — The server received the request, but no trip exists with that ID. This is an HTTP response, not a network failure.'
  };
  $('#interpretation-text').textContent = messages[status] ||
    `HTTP ${status} — The server responded to ${method} ${path}. Inspect the response body for details.`;
}

function setNetworkFailure(error, method, path, requestBody) {
  $('#trace-method').textContent = method;
  $('#trace-method').className = 'verb ' + (method === 'GET' ? 'verb-get' : 'verb-post');
  $('#trace-url').textContent = path;
  $('#trace-status').textContent = 'Network error';
  $('#trace-status').className = 'status-text network-error';
  $('#trace-time').textContent = 'No HTTP response';
  $('#request-target').textContent = `${method} ${path}`;
  $('#request-headers').textContent = requestBody === undefined ? '(no custom request headers)' : 'Content-Type: application/json';
  $('#request-body').textContent = requestBody === undefined ? '(no body)' : pretty(requestBody);
  $('#response-content-type').textContent = '—';
  $('#response-location').textContent = '—';
  $('#response-body').textContent = String(error.message || error);
  $('#interpretation-text').textContent = 'The browser could not reach the server. Check that Spring Boot is running at http://localhost:8080. A network error has no HTTP status code.';
}

function renderTrace({method, path, requestBody, response, body, duration}) {
  const status = response.status;
  $('#trace-method').textContent = method;
  $('#trace-method').className = `verb ${method === 'GET' ? 'verb-get' : 'verb-post'}`;
  $('#trace-url').textContent = path;
  $('#trace-status').textContent = `HTTP ${status} ${statusLabel(status) || response.statusText}`;
  $('#trace-status').className = `status-text ${status >= 200 && status < 300 ? 'success' : 'client-error'}`;
  $('#trace-time').textContent = `${Math.round(duration)} ms · ${new Date().toLocaleTimeString()}`;
  $('#request-target').textContent = `${method} ${path}`;
  $('#request-headers').textContent = requestBody === undefined
    ? 'Accept: */*\n(no custom Content-Type)'
    : 'Content-Type: application/json\nAccept: */*';
  $('#request-body').textContent = requestBody === undefined ? '(no body for this request)' : pretty(requestBody);
  $('#response-content-type').textContent = response.headers.get('content-type') || '(not provided)';
  $('#response-location').textContent = response.headers.get('location') || '(none)';
  $('#response-body').textContent = body === '' ? '(empty response body)' : pretty(body);
  showInterpretation(status, method, path, body);
}

async function callApi(method, path, requestBody) {
  if (requestInProgress) return null;
  requestInProgress = true;
  document.querySelectorAll('button').forEach(button => button.disabled = true);
  const options = {method};
  if (requestBody !== undefined) {
    options.headers = {'Content-Type':'application/json'};
    options.body = JSON.stringify(requestBody);
  }
  const started = performance.now();
  try {
    const response = await fetch(path, options);
    const raw = await response.text();
    let body = raw;
    if (raw) {
      try { body = JSON.parse(raw); } catch { /* display non-JSON as raw text */ }
    }
    renderTrace({method, path, requestBody, response, body, duration:performance.now()-started});
    return {response, body};
  } catch (error) {
    setNetworkFailure(error, method, path, requestBody);
    return null;
  } finally {
    requestInProgress = false;
    document.querySelectorAll('button').forEach(button => button.disabled = false);
  }
}

function renderTrips() {
  const list = $('#trips-list');
  list.replaceChildren();
  if (trips.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No trips yet. Create a trip or reset the demo.';
    list.appendChild(empty);
    return;
  }
  for (const trip of [...trips].sort((a,b) => a.id - b.id)) {
    const row = document.createElement('div');
    row.className = 'trip-row';
    const identity = document.createElement('div');
    identity.className = 'trip-identity';
    const id = document.createElement('span');
    id.className = 'trip-id';
    id.textContent = String(trip.id);
    const labels = document.createElement('span');
    labels.style.minWidth = '0';
    const route = document.createElement('span');
    route.className = 'route-label';
    route.textContent = `${trip.origin} → ${trip.destination}`;
    const caption = document.createElement('span');
    caption.className = 'route-caption';
    caption.textContent = `Trip #${trip.id}`;
    labels.append(route, caption);
    identity.append(id, labels);
    const button = document.createElement('button');
    button.className = 'link-btn';
    button.type = 'button';
    button.textContent = 'GET →';
    button.setAttribute('aria-label', `Inspect trip ${trip.id}`);
    button.addEventListener('click', () => lookupTrip(trip.id));
    row.append(identity, button);
    list.appendChild(row);
  }
}

async function refreshTrips() {
  const result = await callApi('GET', apiBase);
  if (result?.response.ok && Array.isArray(result.body)) {
    trips = result.body;
    renderTrips();
  }
}

async function lookupTrip(id) {
  $('#trip-id').value = String(id);
  await callApi('GET', `${apiBase}/${encodeURIComponent(id)}`);
}

async function createTrip(payload) {
  const result = await callApi('POST', apiBase, payload);
  if (result?.response.status === 201 && result.body?.id != null) {
    trips = [...trips.filter(t => t.id !== result.body.id), result.body];
    renderTrips();
  }
}

$('#refresh-btn').addEventListener('click', refreshTrips);
$('#lookup-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const input = $('#trip-id').value.trim();
  if (!/^\d+$/.test(input)) {
    $('#interpretation-text').textContent = 'Enter a positive integer trip ID before sending GET.';
    return;
  }
  await lookupTrip(input);
});
$('#create-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  // Do NOT block empty fields here: the backend validates and teaches HTTP 400.
  await createTrip({origin:$('#origin').value, destination:$('#destination').value});
});
$('#reset-btn').addEventListener('click', async () => {
  const result = await callApi('POST', '/api/demo/reset');
  if (result?.response.ok && Array.isArray(result.body)) {
    trips = result.body;
    renderTrips();
  }
});

// Demonstrate one automatic GET request when the page loads.
refreshTrips();
