
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

const toggle = $('#mobileToggle');
if(toggle){
  toggle.addEventListener('click', () => $('#mobileMenu')?.classList.toggle('open'));
}

$$('[data-product]').forEach(el=>{
  el.addEventListener('click',()=>{
    const p = el.dataset.product;
    localStorage.setItem('esfProduct', p);
  });
});

const year = $('#year');
if(year) year.textContent = new Date().getFullYear();

const coaData = [
  {product:'GLP-3 Retatrutide', concentration:'20 MG', batch:'TR200-0524', expiration:'05/2029', status:'COA Provided'},
  {product:'Research Compound', concentration:'Custom', batch:'DEMO-0001', expiration:'—', status:'Pending'}
];

function renderCoa(rows){
  const body = $('#coaBody');
  if(!body) return;
  body.innerHTML = rows.map(r=>`
    <tr>
      <td>${r.product}</td>
      <td>${r.concentration}</td>
      <td>${r.batch}</td>
      <td>${r.expiration}</td>
      <td><span class="status">${r.status}</span></td>
    </tr>`).join('');
}
renderCoa(coaData);

const coaSearch = $('#coaSearch');
if(coaSearch){
  coaSearch.addEventListener('input', e=>{
    const q = e.target.value.trim().toLowerCase();
    renderCoa(coaData.filter(r => Object.values(r).join(' ').toLowerCase().includes(q)));
  });
}

const productField = $('#product');
if(productField){
  const saved = localStorage.getItem('esfProduct');
  if(saved) productField.value = saved;
}

const form = $('#contactForm');
if(form){
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = $('#name')?.value || '';
    const email = $('#email')?.value || '';
    const product = $('#product')?.value || '';
    const message = $('#message')?.value || '';
    const subject = encodeURIComponent(`ESFIDELIS Inquiry — ${product || 'General'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProduct: ${product}\n\n${message}`);
    window.location.href = `mailto:info@esfidelis.com?subject=${subject}&body=${body}`;
  });
}
// =========================================================
// ESFIDELIS RESEARCHER VERIFICATION GATE
// =========================================================

const researchGate = $('#researchGate');
const ageConfirm = $('#ageConfirm');
const researchConfirm = $('#researchConfirm');
const useConfirm = $('#useConfirm');
const researchEnterBtn = $('#researchEnterBtn');

if (researchGate) {
  const verifiedThisSession =
    sessionStorage.getItem('esfResearchVerified') === 'true';

  if (verifiedThisSession) {
    researchGate.classList.add('research-gate-hidden');
  } else {
    document.body.classList.add('research-gate-open');
  }

  function updateResearchButton() {
    if (!researchEnterBtn) return;

    const allConfirmed =
      ageConfirm?.checked &&
      researchConfirm?.checked &&
      useConfirm?.checked;

    researchEnterBtn.disabled = !allConfirmed;
  }

  [ageConfirm, researchConfirm, useConfirm].forEach(box => {
    box?.addEventListener('change', updateResearchButton);
  });

  researchEnterBtn?.addEventListener('click', () => {
    const allConfirmed =
      ageConfirm?.checked &&
      researchConfirm?.checked &&
      useConfirm?.checked;

    if (!allConfirmed) return;

  sessionStorage.setItem('esfResearchVerified', 'true');

const returnTo = sessionStorage.getItem('esfResearchReturn');

if (returnTo) {
  sessionStorage.removeItem('esfResearchReturn');
  window.location.href = returnTo;
  return;
}

researchGate.classList.add('research-gate-hidden');
document.body.classList.remove('research-gate-open');  
  });

  updateResearchButton();
}
