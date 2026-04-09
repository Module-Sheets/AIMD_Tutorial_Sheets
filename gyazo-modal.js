(function () {
    if (window.__gyazoModalInitialized) return;
    window.__gyazoModalInitialized = true;

    var style = document.createElement('style');
    style.textContent = [
        '.gyazo-modal-open { overflow: hidden; }',
        '.gyazo-modal { position: fixed; inset: 0; z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 24px; }',
        '.gyazo-modal[hidden] { display: none; }',
        '.gyazo-modal-backdrop { position: absolute; inset: 0; background: rgba(15, 71, 97, 0.72); }',
        '.gyazo-modal-dialog { position: relative; width: min(960px, 100%); max-height: calc(100vh - 48px); background: #fff; border-radius: 10px; box-shadow: 0 18px 48px rgba(0, 0, 0, 0.25); padding: 18px; display: flex; flex-direction: column; gap: 10px; }',
        '.gyazo-modal-toolbar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }',
        '.gyazo-modal-btn { display: inline-flex; align-items: center; justify-content: center; min-width: 42px; height: 36px; border: 1px solid #0F4761; border-radius: 999px; background: #fff; color: #0F4761; cursor: pointer; padding: 0 10px; }',
        '.gyazo-modal-btn:hover { background: #f0f6f8; }',
        '.gyazo-modal-close { min-width: 90px; }',
        '.gyazo-modal-zoom-level { min-width: 56px; text-align: center; color: #0F4761; font-weight: 600; }',
        '.gyazo-modal-viewport { max-height: calc(100vh - 230px); overflow: auto; border: 1px solid #d6e1e5; border-radius: 6px; background: #f8fcfd; padding: 8px; }',
        '.gyazo-modal-preview { display: block; width: auto; max-width: none; height: auto; transform-origin: top left; }',
        '.gyazo-modal-status { margin: 0; color: #465a63; }',
        '.gyazo-modal-actions { margin: 0; }',
        '.gyazo-modal-actions a { color: #0F4761; font-weight: 600; word-break: break-word; }'
    ].join('');
    document.head.appendChild(style);

    var modal = document.createElement('div');
    modal.id = 'gyazo-modal-global';
    modal.className = 'gyazo-modal';
    modal.hidden = true;
    modal.innerHTML = [
        '<div class="gyazo-modal-backdrop" data-close-gyazo></div>',
        '<div class="gyazo-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="gyazo-modal-link-global">',
        '<div class="gyazo-modal-toolbar">',
        '<button type="button" class="gyazo-modal-btn gyazo-modal-close" data-close-gyazo>Close</button>',
        '<button type="button" id="gyazo-zoom-out-global" class="gyazo-modal-btn" aria-label="Zoom out">-</button>',
        '<span id="gyazo-zoom-level-global" class="gyazo-modal-zoom-level">100%</span>',
        '<button type="button" id="gyazo-zoom-in-global" class="gyazo-modal-btn" aria-label="Zoom in">+</button>',
        '<button type="button" id="gyazo-zoom-reset-global" class="gyazo-modal-btn" aria-label="Reset zoom">1:1</button>',
        '</div>',
        '<div id="gyazo-modal-viewport-global" class="gyazo-modal-viewport">',
        '<img id="gyazo-modal-image-global" class="gyazo-modal-preview" alt="Gyazo preview" hidden>',
        '</div>',
        '<p id="gyazo-modal-status-global" class="gyazo-modal-status" hidden></p>',
        '<p class="gyazo-modal-actions"><a id="gyazo-modal-link-global" href="#" target="_blank" rel="noopener">Open original Gyazo link</a></p>',
        '</div>'
    ].join('');
    document.body.appendChild(modal);

    var image = document.getElementById('gyazo-modal-image-global');
    var viewport = document.getElementById('gyazo-modal-viewport-global');
    var status = document.getElementById('gyazo-modal-status-global');
    var linkOut = document.getElementById('gyazo-modal-link-global');
    var zoomIn = document.getElementById('gyazo-zoom-in-global');
    var zoomOut = document.getElementById('gyazo-zoom-out-global');
    var zoomReset = document.getElementById('gyazo-zoom-reset-global');
    var zoomLevel = document.getElementById('gyazo-zoom-level-global');

    var scale = 1;

    function updateZoom(next) {
        scale = Math.max(0.25, Math.min(8, next));
        image.style.transform = 'scale(' + scale + ')';
        zoomLevel.textContent = Math.round(scale * 100) + '%';
    }

    function resetZoom() {
        updateZoom(1);
        viewport.scrollTop = 0;
        viewport.scrollLeft = 0;
    }

    function getGyazoId(url) {
        var match = /^https?:\/\/(?:www\.)?gyazo\.com\/([a-zA-Z0-9]+)/i.exec(url || '');
        return match ? match[1] : null;
    }

    function getSourceImageFromLink(anchor) {
        if (!anchor) return null;
        var img = anchor.querySelector('img[src*="i.gyazo.com/"]');
        if (!img) return null;
        return img.currentSrc || img.src || null;
    }

    function getCandidates(url, preferred) {
        var candidates = [];
        if (preferred && /https?:\/\/i\.gyazo\.com\//i.test(preferred)) {
            candidates.push(preferred);
        }

        var id = getGyazoId(url);
        if (id) {
            [
                'https://i.gyazo.com/' + id + '.png',
                'https://i.gyazo.com/' + id + '.jpg',
                'https://i.gyazo.com/' + id + '.gif'
            ].forEach(function (src) {
                if (candidates.indexOf(src) === -1) candidates.push(src);
            });
        }
        return candidates;
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove('gyazo-modal-open');
        image.hidden = true;
        image.removeAttribute('src');
        image.onload = null;
        image.onerror = null;
        status.hidden = true;
        status.textContent = '';
        resetZoom();
    }

    function loadCandidate(candidates, idx) {
        if (idx >= candidates.length) {
            image.hidden = true;
            status.textContent = 'Preview unavailable for this Gyazo item. Use the original link below.';
            status.hidden = false;
            return;
        }

        image.onload = function () {
            status.hidden = true;
            image.hidden = false;
            resetZoom();
        };

        image.onerror = function () {
            loadCandidate(candidates, idx + 1);
        };

        image.src = candidates[idx];
    }

    function openModal(url, label, preferred) {
        var candidates = getCandidates(url, preferred);
        if (candidates.length === 0) return;

        linkOut.href = url;
        linkOut.textContent = label || 'Open original Gyazo link';
        status.textContent = 'Loading preview...';
        status.hidden = false;
        image.hidden = true;
        modal.hidden = false;
        document.body.classList.add('gyazo-modal-open');
        loadCandidate(candidates, 0);
    }

    document.addEventListener('click', function (event) {
        var closeTarget = event.target.closest('[data-close-gyazo]');
        if (closeTarget && !modal.hidden) {
            event.preventDefault();
            closeModal();
            return;
        }

        var anchor = event.target.closest('a[href*="gyazo.com/"]');
        if (!anchor) return;

        if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
            return;
        }

        event.preventDefault();
        openModal(anchor.href, (anchor.textContent || '').trim() || 'Open original Gyazo link', getSourceImageFromLink(anchor));
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });

    zoomIn.addEventListener('click', function () { updateZoom(scale + 0.25); });
    zoomOut.addEventListener('click', function () { updateZoom(scale - 0.25); });
    zoomReset.addEventListener('click', resetZoom);
})();
