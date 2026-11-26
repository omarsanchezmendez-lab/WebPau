(() => {
    const d = document,
        rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
    d.querySelectorAll('form.cf').forEach(form => {
        form.addEventListener('submit', async event => {
            event.preventDefault();
            const button = form.querySelector('button[type="submit"]');
            const buttonContent = button.innerHTML;
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
                button.innerHTML = buttonContent;
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
    const els = [...d.querySelectorAll('.card,.dish,.methods>div,.methods .method-card,main h2,main .hero .btn,.meta>span,.duality article,.story>*,.ngrid>*,.cgrid>*,.bc,.sh,.strip,.quote blockquote,.ls,.ap,.swatch,#menu-moments,.filters,.moment-switch,.tabs,.contacto-info>*,.visita>*')];
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
    const methodDialog = d.getElementById('method-dialog');
    if (methodDialog) {
        const methodData = {
            v60: ['V60', 'Preparación manual por filtrado que deja pasar el café de forma uniforme y controlada. Destaca notas claras y una textura limpia.', ['Filtrado', '1 a 4 minutos', 'Sabor limpio']],
            espresso: ['Espresso', 'Extracción concentrada a alta presión. Produce una bebida corta con cuerpo intenso y una crema característica.', ['Presión', '25 a 30 segundos', 'Concentrado']],
            pod: ['Coffee pod', 'Sistema práctico y consistente que usa cápsulas selladas para preparar una taza rápida con poca variación.', ['Cápsula', '30 a 60 segundos', 'Práctico']],
            chemex: ['Chemex', 'Filtrado de vertido con un diseño elegante y filtros gruesos que producen una taza muy limpia y aromática.', ['Vertido', '3 a 5 minutos', 'Aromático']],
            moka: ['Moka pot', 'Se prepara en estufa: el agua pasa a presión por el café molido y produce una infusión intensa y concentrada.', ['Estufa', '4 a 6 minutos', 'Intenso']],
            cezve: ['Turkish cezve', 'Café finamente molido cocido lentamente en una pequeña olla. Se sirve con sus posos y conserva mucho cuerpo.', ['Estufa', '3 a 5 minutos', 'Espeso']],
            siphon: ['Siphon', 'Método visual que combina vacío y presión. Elimina muchas impurezas y ofrece una taza aromática con gran claridad.', ['Vacío', '4 a 6 minutos', 'Visual']],
            aeropress: ['Aeropress', 'Inmersión breve seguida de presión manual. Permite ajustar fuerza y extracción para obtener una taza versátil.', ['Inmersión', '1 a 3 minutos', 'Versátil']],
            french: ['French press', 'El café permanece en contacto directo con el agua antes de filtrarlo con émbolo. Da cuerpo completo y aceites naturales.', ['Inmersión', '4 minutos', 'Cuerpo completo']]
        };
        const title = d.getElementById('method-title');
        const description = d.getElementById('method-description');
        const facts = d.getElementById('method-facts');
        d.querySelectorAll('[data-method]').forEach(card => {
            card.addEventListener('click', () => {
                const [methodTitle, methodDescription, methodFacts] = methodData[card.dataset.method];
                title.textContent = methodTitle;
                description.textContent = methodDescription;
                facts.replaceChildren();
                methodFacts.forEach((fact, index) => {
                    const item = d.createElement('span');
                    const labels = ['Tipo', 'Tiempo', 'Perfil'];
                    const label = d.createElement('strong');
                    label.textContent = labels[index];
                    item.append(label, fact);
                    facts.append(item);
                });
                methodDialog.showModal();
            });
        });
        d.querySelector('.method-close').addEventListener('click', () => methodDialog.close());
        methodDialog.addEventListener('click', event => {
            if (event.target === methodDialog) methodDialog.close();
        });
        addEventListener('keydown', event => {
            if (event.key === 'Escape' && methodDialog.open) methodDialog.close();
        });
    }
    const f = d.getElementById('filters');
    const menuSection = d.querySelector('.menu-section');
    if (f && menuSection) {
        const cards = [...menuSection.querySelectorAll('.menu-dish')];
        const moments = d.getElementById('menu-moments');
        const categories = {
            dia: [
                ['todos', 'Todo'],
                ['bebidas', 'Bebidas'],
                ['paquetes', 'Paquetes'],
                ['eventos', 'Eventos'],
                ['complementos', 'Complementos']
            ],
            noche: [
                ['todos', 'Todo'],
                ['bebidas', 'Bebidas'],
                ['paquetes', 'Paquetes'],
                ['eventos', 'Eventos'],
                ['complementos', 'Complementos']
            ]
        };
        let currentMoment = 'dia';
        let currentCategory = 'todos';
        const renderCategories = () => {
            f.replaceChildren();
            categories[currentMoment].forEach(([value, label], index) => {
                const button = d.createElement('button');
                button.type = 'button';
                button.className = `filter${index === 0 ? ' active' : ''}`;
                button.dataset.filter = value;
                button.setAttribute('aria-pressed', String(index === 0));
                button.textContent = label;
                f.append(button);
            });
        };
        const renderCards = () => {
            cards.forEach(card => {
                const visible = card.dataset.moment.split(' ').includes(currentMoment) &&
                    (currentCategory === 'todos' || card.dataset.cat.split(' ').includes(currentCategory));
                card.hidden = !visible;
                if (visible) {
                    card.classList.remove('pop');
                    void card.offsetWidth;
                    card.classList.add('pop');
                }
            });
        };
        const renderMoment = () => {
            const night = currentMoment === 'noche';
            menuSection.dataset.moment = currentMoment;
            d.getElementById('menu-kicker').textContent = `Menú de ${night ? 'noche' : 'día'}`;
            d.getElementById('menu-description').textContent = night
                ? 'Bebidas, paquetes, eventos y complementos para disfrutar cuando baja la luz.'
                : 'Bebidas, paquetes, eventos y complementos de la carta N0CTRA.';
            moments.querySelectorAll('[data-moment]').forEach(button => {
                const active = button.dataset.moment === currentMoment;
                button.classList.toggle('active', active);
                button.setAttribute('aria-pressed', String(active));
            });
            currentCategory = 'todos';
            renderCategories();
            renderCards();
        };
        moments.addEventListener('click', event => {
            const button = event.target.closest('[data-moment]');
            if (!button || button.dataset.moment === currentMoment) return;
            currentMoment = button.dataset.moment;
            renderMoment();
        });
        f.addEventListener('click', event => {
            const button = event.target.closest('[data-filter]');
            if (!button) return;
            currentCategory = button.dataset.filter;
            f.querySelectorAll('.filter').forEach(filter => {
                const active = filter === button;
                filter.classList.toggle('active', active);
                filter.setAttribute('aria-pressed', String(active));
            });
            renderCards();
        });
        renderMoment();
    } else if (f) {
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