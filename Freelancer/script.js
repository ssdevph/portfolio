// script.js - comportamentos do site (versão melhorada)

// Helpers
const qs = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

// Mobile nav toggle (mais robusto)
const toggle = qs('.nav-toggle');
const nav = qs('.main-nav') || qs('nav');
if(toggle && nav){
  toggle.addEventListener('click', ()=>{
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    // controle de visibilidade via classe (CSS deve lidar com display)
  });
}

// Smooth scroll for internal links (delegation-safe)
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  const href = a.getAttribute('href');
  if(!href || href === '#') return;
  const el = document.querySelector(href);
  if(!el) return;
  e.preventDefault();
  el.scrollIntoView({behavior:'smooth',block:'start'});
  // close mobile nav after click on small screens
  if(window.innerWidth < 900 && nav && nav.classList.contains('open')){
    nav.classList.remove('open');
    toggle && toggle.setAttribute('aria-expanded', 'false');
  }
});

// Portfolio modal (com descrição opcional)
const projects = qsa('.projeto');
const modal = qs('#modal');
const modalImage = qs('#modalImage');
const modalTitle = qs('#modalTitle');
// create modalDesc if doesn't exist
let modalDesc = qs('#modalDesc');
if(modal && !modalDesc){
  modalDesc = document.createElement('p');
  modalDesc.id = 'modalDesc';
  modalDesc.className = 'muted spaced';
  const inner = qs('.modal-inner', modal) || qs('.modal-inner');
  inner && inner.appendChild(modalDesc);
}
const closeModalBtn = qs('#closeModal');

projects.forEach(p=>{
  p.style.cursor = 'pointer';
  p.addEventListener('click', ()=>{
    const title = p.dataset.title || 'Projeto';
    const img = p.dataset.image || p.querySelector('img')?.src || '';
    const desc = p.dataset.desc || '';
    modalTitle && (modalTitle.textContent = title);
    modalImage && (modalImage.src = img);
    if(modalDesc) modalDesc.textContent = desc;
    modal && modal.classList.add('open');
    modal && modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal(){
  modal && modal.classList.remove('open');
  modal && modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}
closeModalBtn && closeModalBtn.addEventListener('click', closeModal);
modal && modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

// Contact form handling (com EmailJS opcional)
const form = qs('#contactForm');
let formMessage = qs('#formMessage');
if(form && !formMessage){
  formMessage = document.createElement('div');
  formMessage.id = 'formMessage';
  formMessage.className = 'muted spaced';
  formMessage.style.display = 'none';
  form.appendChild(formMessage);
}

if(form){
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const name = (form.querySelector('[name="nome"]') || form.querySelector('[name="name"]'))?.value?.trim();
    const email = (form.querySelector('[name="email"]'))?.value?.trim();
    const msg = (form.querySelector('[name="mensagem"]') || form.querySelector('[name="message"]'))?.value?.trim();

    if(!name || !email || !msg){
      formMessage.style.display='block';
      formMessage.textContent = 'Por favor preencha todos os campos.';
      return;
    }

    // Se desejar integrar com EmailJS, descomente e configure:
    // try{
    //   await emailjs.send('service_xxx','template_xxx',{ from_name:name, from_email:email, message:msg });
    //   formMessage.textContent = 'Mensagem enviada! Respondo em breve.';
    // }catch(err){
    //   formMessage.textContent = 'Erro ao enviar. Tente novamente.';
    // }

    // Placeholder (comportamento demo)
    formMessage.style.display='block';
    formMessage.textContent = 'Mensagem enviada! Respondo em breve.';
    form.reset();
    setTimeout(()=>{ formMessage.style.display='none'; }, 5000);
  });
}

// Dev-badge movement (debounced with requestAnimationFrame para performance)
const devBadge = qs('.dev-badge');
if(devBadge){
  let raf = null;
  document.addEventListener('mousemove', (e)=>{
    if(raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=>{
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      devBadge.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// Ensure images lazy-load (safe)
qsa('img').forEach(img=>{ if(!img.getAttribute('loading')) img.loading = 'lazy'; });

// Accessibility: focus styles for keyboard users (example enhancement)
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Tab') document.body.classList.add('user-is-tabbing');
});

// End of script.js
