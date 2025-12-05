/* --- Load navbar into page --- */
fetch("navbar.html")
  .then(r => r.text())
  .then(html => {
    document.getElementById("navbar").innerHTML = html;
    afterNavbarLoad(); // init handlers that depend on navbar elements
  })
  .catch(e => console.error("Gagal load navbar:", e));


/* --- Called after navbar injected --- */
function afterNavbarLoad(){
  // highlight active link
  const links = document.querySelectorAll('[data-link]');
  const current = location.pathname.split("/").pop() || "index.html";
  links.forEach(a => {
    const href = a.getAttribute('href');
    if(href === current || (href === "index.html" && current === "")) a.classList.add('active-link');
  });

  // mobile toggle
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if(toggle){
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // dark mode toggle
  const darkBtn = document.getElementById('darkToggle');
  if(darkBtn){
    const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(saved);
    darkBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(cur);
    });
  }
}

/* --- Theme helper --- */
function setTheme(mode){
  if(mode === 'dark'){
    document.documentElement.setAttribute('data-theme','dark');
    const btn = document.getElementById('darkToggle'); if(btn) btn.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    const btn = document.getElementById('darkToggle'); if(btn) btn.textContent = '🌙';
  }
  localStorage.setItem('theme', mode);
}

/* --- Year updates for footers --- */
document.addEventListener('DOMContentLoaded', () => {
  const y = new Date().getFullYear();
  ['year','year2','year3','year4'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = y;
  });
});

/* --- Carousel (Index) --- */
(function initCarousel(){
  let idx = 0, slides, dots, prevBtn, nextBtn, interval;
  function start(){
    const root = document.getElementById('carousel');
    if(!root) return;
    slides = root.querySelectorAll('.slide');
    dots = document.getElementById('carouselDots');
    prevBtn = root.querySelector('.carousel-prev');
    nextBtn = root.querySelector('.carousel-next');

    // make dots
    slides.forEach((s,i) => {
      const d = document.createElement('button');
      d.className = 'dot';
      d.addEventListener('click', () => go(i));
      dots.appendChild(d);
    });

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    show(0);
    interval = setInterval(next, 4500);
    root.addEventListener('mouseenter', ()=>clearInterval(interval));
    root.addEventListener('mouseleave', ()=>interval = setInterval(next,4500));
  }

  function show(i){
    slides.forEach(s => s.classList.remove('active'));
    slides[i].classList.add('active');
    // dot active
    const ds = document.querySelectorAll('.carousel-dots .dot');
    ds.forEach(d => d.classList.remove('active'));
    if(ds[i]) ds[i].classList.add('active');
    idx = i;
  }
  function next(){ show((idx+1) % slides.length) }
  function prev(){ show((idx-1+slides.length) % slides.length) }
  function go(i){ show(i) }

  // wait for DOM content
  document.addEventListener('DOMContentLoaded', start);
})();

/* --- Menu filter (menu.html) --- */
(function initFilter(){
  function start(){
    const grid = document.getElementById('menuGrid');
    if(!grid) return;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(b => b.addEventListener('click', () => {
      buttons.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const filter = b.getAttribute('data-filter');
      const cards = grid.querySelectorAll('.menu-card');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || 'all';
        if(filter === 'all' || filter === cat) {
          card.style.display = '';
          // small animation
          card.animate([{opacity:0, transform:'translateY(8px)'},{opacity:1, transform:'translateY(0)'}], {duration:300, easing:'ease-out'});
        } else {
          card.style.display = 'none';
        }
      });
    }));
  }
  document.addEventListener('DOMContentLoaded', start);
})();

/* --- Contact form (contact.html) --- */
(function initForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg = document.getElementById('message').value.trim();
    if(!name || !email || !msg){
      alert('Isi semua field dulu ya.');
      return;
    }
    // Simulasi kirim (di nyata: kirim ke server)
    alert('Terima kasih, pesanmu sudah terkirim! (Simulasi)');
    form.reset();
  });
})();
