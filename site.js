(() => {
    const d = document,
        rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    d.querySelectorAll('form.cf').forEach(form => {
        form.addEventListener('submit', async event => {
            event.preventDefault();
            const button = form.querySelector('button[type="submit"]');
            const status = document.createElement('p');
            status.className = 'form-status';
            status.setAttribute('role', 'status');
            form.querySelector('.form-status')?.remove();
            form.append(status);
            button.disabled = true;
            button.textContent = 'Enviando...';
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { Accept: 'application/json' }
                });
                if (!response.ok) throw new Error('No se pudo enviar');
                status.textContent = 'Mensaje enviado. Gracias por escribirnos.';
                status.dataset.state = 'success';
                form.reset();
            } catch (error) {
                status.textContent = 'No pudimos enviar el mensaje. Inténtalo de nuevo o escríbenos por correo.';
                status.dataset.state = 'error';
            } finally {
                button.disabled = false;
                button.innerHTML = 'Enviar mensaje &nearr;';
            }
        });
    });
    const navToggle = d.querySelector('.nav-toggle');
    const nav = d.getElementById('primary-nav');
    if (navToggle && nav) {
        const closeNav = () => {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Abrir menú');
            nav.classList.remove('open');
            d.body.classList.remove('nav-open');
        };
        navToggle.addEventListener('click', () => {
            const open = navToggle.getAttribute('aria-expanded') !== 'true';
            navToggle.setAttribute('aria-expanded', String(open));
            navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
            nav.classList.toggle('open', open);
            d.body.classList.toggle('nav-open', open);
        });
        nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
        addEventListener('resize', () => {
            if (innerWidth > 720) closeNav();
        });
        addEventListener('keydown', e => {
            if (e.key === 'Escape') closeNav();
        });
    }
    const els = [...d.querySelectorAll('.card,.dish,.methods>div,main h2,.duality article,.story>*,.ngrid>*,.cgrid>*,.bc,.sh,.strip,.quote blockquote,.ls,.ap,.swatch')];
    if (!rm && 'IntersectionObserver' in window) {
        els.forEach(e => e.classList.add('rv'));
        const io = new IntersectionObserver(es => es.forEach(x => {
            if (!x.isIntersecting) return;
            const e = x.target,
                i = [...e.parentNode.children].indexOf(e);
            e.style.transitionDelay = (i % 4) * 90 + 'ms';
            e.classList.add('in');
            io.unobserve(e);
            setTimeout(() => e.style.transitionDelay = '', 1400)
        }), {
            threshold: .12
        });
        els.forEach(e => io.observe(e))
    }
    const h = d.querySelector('header');
    addEventListener('scroll', () => h.classList.toggle('sc', scrollY > 10), {
        passive: true
    });
    const f = d.getElementById('filters');
    if (f) {
        const ds = [...d.querySelectorAll('.dish')];
        f.onclick = e => {
            const b = e.target.closest('[data-filter]');
            if (!b) return;
            f.querySelectorAll('.filter').forEach(x => {
                x.classList.toggle('active', x === b);
                x.setAttribute('aria-pressed', x === b)
            });
            ds.forEach(c => {
                const s = b.dataset.filter === 'todos' || c.dataset.cat === b.dataset.filter;
                c.hidden = !s;
                if (s) {
                    c.classList.remove('pop');
                    void c.offsetWidth;
                    c.classList.add('pop')
                }
            })
        }
    }
    const bi = d.querySelector('.bi');
    if (bi) {
        const L = {};
        bi.querySelectorAll('a').forEach(a => L[a.hash.slice(1)] = a);
        const o = new IntersectionObserver(es => es.forEach(x => {
            if (x.isIntersecting) {
                bi.querySelectorAll('a.on').forEach(a => a.classList.remove('on'));
                L[x.target.id].classList.add('on')
            }
        }), {
            rootMargin: '-20% 0px -70% 0px'
        });
        d.querySelectorAll('.bc').forEach(c => o.observe(c))
    }
})();