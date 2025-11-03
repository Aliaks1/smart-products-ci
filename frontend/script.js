const API = (window.BACKEND_URL || 'http://localhost:3000') + '/api/products';
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

async function fetchJSON(url, opts) {
  const r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!r.ok) throw await r.json().catch(() => ({ error: 'Błąd sieci' }));
  return r.json();
}

async function load() {
  const rows = await fetchJSON(API);
  const tbody = $('#tbl tbody');
  tbody.innerHTML = '';
  rows.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td><td>${p.name}</td><td>${p.price}</td>
      <td>${p.code}</td><td>${p.supplierEmail}</td><td>${p.releaseDate}</td>
      <td><button data-del="${p.id}" class="ghost">Usuń</button></td>`;
    tbody.appendChild(tr);
  });
}

$('#productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#uiErrors').innerHTML = ''; $('#apiErrors').innerHTML = '';

  if (!e.target.checkValidity()) {
    const msgs = [];
    $$('input').forEach(inp => !inp.checkValidity() && msgs.push(`${inp.name}: niepoprawna wartość`));
    $('#uiErrors').innerHTML = msgs.join('<br>');
    return;
  }

  const body = Object.fromEntries(new FormData(e.target).entries());
  body.price = Number(body.price);

  try {
    await fetchJSON(API, { method: 'POST', body: JSON.stringify(body) });
    e.target.reset();
    await load();
  } catch (err) {
    const errs = err.fieldErrors || [{ message: err.error }];
    $('#apiErrors').innerHTML = errs.map(e => e.message).join('<br>');
  }
});

document.addEventListener('click', async (e) => {
  if (e.target.dataset.del) {
    try {
      await fetch(API + '/' + e.target.dataset.del, { method: 'DELETE' });
      await load();
    } catch {
      $('#apiErrors').innerHTML = '❌ Nie udało się usunąć';
    }
  }
});

$('#resetBtn').addEventListener('click', () => {
  $('#productForm').reset();
  $('#uiErrors').innerHTML = '';
  $('#apiErrors').innerHTML = '';
});

load();
