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

    // YouTube occasionally leaves muted autoplay embeds paused, which exposes
    // its large title and playback overlay. Enable the iframe API and start
    // those embeds once their player is ready.
    document.querySelectorAll('iframe[src*="youtube.com/embed/"][src*="autoplay=1"]').forEach((iframe) => {
        const url = new URL(iframe.src);
        url.searchParams.set('enablejsapi', '1');
        url.searchParams.set('origin', window.location.origin);
        url.searchParams.set('playsinline', '1');

        iframe.addEventListener('load', () => {
            const startPlayback = () => {
                iframe.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: 'mute', args: [] }),
                    'https://www.youtube.com'
                );
                iframe.contentWindow.postMessage(
                    JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
                    'https://www.youtube.com'
                );
            };

            [0, 250, 1000].forEach((delay) => window.setTimeout(startPlayback, delay));
        }, { once: true });

        iframe.src = url.toString();
    });

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
