document.addEventListener('DOMContentLoaded', function () {
    // Mobile nav toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        const toggle = () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        };
        hamburger.addEventListener('click', toggle);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll reveal
    if (!reduceMotion && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    } else {
        document.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
    }

    // Breakdowns hover video preview: swap in a muted looping YouTube iframe on
    // hover/focus, remove on leave. Touch devices never hover, so tiles stay
    // plain links there.
    document.querySelectorAll('.bd-media[data-yt]').forEach((media) => {
        let iframe = null;
        const section = media.closest('.bd-section');
        const show = () => {
            if (iframe || reduceMotion) return;
            const id = media.dataset.yt;
            iframe = document.createElement('iframe');
            iframe.className = 'bd-preview';
            iframe.src = 'https://www.youtube.com/embed/' + id +
                '?autoplay=1&mute=1&loop=1&playlist=' + id +
                '&controls=0&modestbranding=1&playsinline=1';
            iframe.allow = 'autoplay';
            iframe.tabIndex = -1;
            media.appendChild(iframe);
        };
        const hide = () => {
            if (iframe) {
                iframe.remove();
                iframe = null;
            }
        };
        media.addEventListener('mouseenter', show);
        media.addEventListener('mouseleave', hide);
        if (section) {
            section.addEventListener('focusin', show);
            section.addEventListener('focusout', hide);
        }
    });
});
