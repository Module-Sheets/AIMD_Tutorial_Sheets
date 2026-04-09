(function () {
    if (window.__videoModalInitialized) return;
    window.__videoModalInitialized = true;

    function injectStyles() {
        var style = document.createElement('style');
        style.textContent = [
            '.video-modal-open { overflow: hidden; }',
            '.video-modal { position: fixed; inset: 0; z-index: 10001; display: flex; align-items: center; justify-content: center; padding: 24px; }',
            '.video-modal[hidden] { display: none; }',
            '.video-modal-backdrop { position: absolute; inset: 0; background: rgba(11, 28, 41, 0.78); }',
            '.video-modal-dialog { position: relative; width: min(1080px, 100%); max-height: calc(100vh - 48px); background: #fff; border-radius: 12px; box-shadow: 0 18px 48px rgba(0, 0, 0, 0.28); padding: 18px; display: flex; flex-direction: column; gap: 12px; }',
            '.video-modal-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }',
            '.video-modal-title { margin: 0; color: #0F4761; font-size: 1rem; line-height: 1.3; }',
            '.video-modal-close { display: inline-flex; align-items: center; justify-content: center; min-width: 92px; height: 38px; border: 1px solid #0F4761; border-radius: 999px; background: #fff; color: #0F4761; cursor: pointer; }',
            '.video-modal-close:hover { background: #eef6f8; }',
            '.video-modal-player-wrap { position: relative; width: 100%; padding-top: 56.25%; background: #0b1c29; border-radius: 8px; overflow: hidden; }',
            '.video-modal-player-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }',
            '.video-modal-status { margin: 0; color: #465a63; }',
            '.video-modal-actions { margin: 0; }',
            '.video-modal-actions a { color: #0F4761; font-weight: 600; word-break: break-word; }',
            '.video-preview-card { width: 100%; margin: 12px 0; }',
            '.video-preview-shell { position: relative; width: 100%; min-height: 240px; border-radius: 10px; overflow: hidden; border: 1px solid #c7dbe2; background: #dfecef; transition: transform 0.18s ease, box-shadow 0.18s ease; }',
            '.video-preview-image { display: block; width: 100%; height: auto; min-height: 240px; max-height: 520px; object-fit: cover; background: #dfecef; }',
            '.video-preview-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11, 28, 41, 0.12) 0%, rgba(11, 28, 41, 0.3) 55%, rgba(11, 28, 41, 0.72) 100%); }',
            '.video-preview-meta { position: absolute; left: 16px; right: 16px; bottom: 14px; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; }',
            '.video-preview-copy { min-width: 0; }',
            '.video-preview-badge { display: inline-block; margin-bottom: 8px; padding: 4px 8px; border-radius: 999px; background: rgba(255, 255, 255, 0.92); color: #0F4761; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }',
            '.video-preview-title { margin: 0; color: #fff; font-size: 1rem; line-height: 1.35; text-shadow: 0 2px 6px rgba(0, 0, 0, 0.45); }',
            '.video-preview-play { display: inline-flex; align-items: center; gap: 10px; min-width: 132px; justify-content: center; padding: 11px 16px; border: 0; border-radius: 999px; background: rgba(255, 255, 255, 0.95); color: #0F4761; font-weight: 700; cursor: pointer; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease; }',
            '.video-preview-play:hover { background: #fff; }',
            '.video-preview-play:active { transform: translateY(1px); }',
            '.video-preview-play-icon { width: 0; height: 0; border-top: 9px solid transparent; border-bottom: 9px solid transparent; border-left: 14px solid #0F4761; }',
            '.video-preview-link { margin: 8px 0 0; font-size: 0.95em; }',
            '.video-preview-link a { color: #0F4761; font-weight: 600; word-break: break-word; }',
            '.video-preview-card.provider-youtube { margin: 18px 0; }',
            '.video-preview-card.provider-youtube .video-preview-shell { border-color: #97bdcb; box-shadow: 0 16px 34px rgba(11, 28, 41, 0.22); transform: translateY(-2px); }',
            '.video-preview-card.provider-youtube .video-preview-shell:hover { transform: translateY(-5px); box-shadow: 0 24px 44px rgba(11, 28, 41, 0.32); }',
            '.video-preview-card.provider-youtube .video-preview-overlay { background: linear-gradient(180deg, rgba(11, 28, 41, 0.08) 0%, rgba(11, 28, 41, 0.32) 58%, rgba(11, 28, 41, 0.82) 100%); }',
            '.video-preview-card.provider-youtube .video-preview-play { box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3); }',
            '@media (max-width: 640px) {',
            '  .video-preview-meta { flex-direction: column; align-items: stretch; }',
            '  .video-preview-play { width: 100%; }',
            '  .video-preview-shell { min-height: 210px; }',
            '  .video-preview-image { min-height: 210px; }',
            '}'
        ].join('');
        document.head.appendChild(style);
    }

    function createModal() {
        var modal = document.createElement('div');
        modal.id = 'video-modal-global';
        modal.className = 'video-modal';
        modal.hidden = true;
        modal.innerHTML = [
            '<div class="video-modal-backdrop" data-close-video-modal></div>',
            '<div class="video-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="video-modal-title-global">',
            '<div class="video-modal-toolbar">',
            '<p id="video-modal-title-global" class="video-modal-title">Video</p>',
            '<button type="button" class="video-modal-close" data-close-video-modal>Close</button>',
            '</div>',
            '<div class="video-modal-player-wrap" id="video-modal-player-wrap-global"></div>',
            '<p id="video-modal-status-global" class="video-modal-status" hidden></p>',
            '<p class="video-modal-actions"><a id="video-modal-link-global" href="#" target="_blank" rel="noopener">Open video in new tab</a></p>',
            '</div>'
        ].join('');
        document.body.appendChild(modal);
        return {
            modal: modal,
            title: document.getElementById('video-modal-title-global'),
            playerWrap: document.getElementById('video-modal-player-wrap-global'),
            status: document.getElementById('video-modal-status-global'),
            link: document.getElementById('video-modal-link-global')
        };
    }

    function normalizeUrl(url) {
        return (url || '').replace(/&amp;/g, '&').trim();
    }

    function getUrlObject(url) {
        try {
            return new URL(normalizeUrl(url), window.location.href);
        } catch (error) {
            return null;
        }
    }

    function getProvider(url) {
        var value = normalizeUrl(url).toLowerCase();
        if (!value) return null;
        if (value.indexOf('youtu.be/') !== -1 || value.indexOf('youtube.com/') !== -1 || value.indexOf('youtube-nocookie.com/') !== -1) return 'youtube';
        if (value.indexOf('panopto') !== -1) return 'panopto';
        if (value.indexOf('sharepoint.com/:v:/') !== -1) return 'sharepoint';
        return null;
    }

    function getYouTubeId(url) {
        var parsed = getUrlObject(url);
        if (!parsed) return null;
        var host = parsed.hostname.toLowerCase();
        var path = parsed.pathname;

        if (host === 'youtu.be') {
            return path.replace(/^\//, '').split('/')[0] || null;
        }

        if (path.indexOf('/embed/') === 0 || path.indexOf('/shorts/') === 0) {
            return path.split('/')[2] || null;
        }

        if (parsed.searchParams.get('v')) {
            return parsed.searchParams.get('v');
        }

        return null;
    }

    function getPanoptoId(url) {
        var parsed = getUrlObject(url);
        if (!parsed) return null;
        return parsed.searchParams.get('id');
    }

    function buildPanoptoEmbed(url) {
        var parsed = getUrlObject(url);
        if (!parsed) return normalizeUrl(url);
        var id = getPanoptoId(url);
        if (!id) return normalizeUrl(url);
        return parsed.origin + '/Panopto/Pages/Embed.aspx?id=' + encodeURIComponent(id) + '&autoplay=true&offerviewer=true&showtitle=false&showbrand=false&captions=true&interactivity=all';
    }

    function buildPanoptoViewer(url) {
        var parsed = getUrlObject(url);
        if (!parsed) return normalizeUrl(url);
        var id = getPanoptoId(url);
        if (!id) return normalizeUrl(url);
        return parsed.origin + '/Panopto/Pages/Viewer.aspx?id=' + encodeURIComponent(id);
    }

    function getProviderLabel(provider) {
        if (provider === 'youtube') return 'YouTube';
        if (provider === 'panopto') return 'Panopto';
        if (provider === 'sharepoint') return 'SharePoint Video';
        return 'Video';
    }

    function buildPosterDataUrl(title, provider) {
        var safeTitle = (title || getProviderLabel(provider) || 'Video').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var safeProvider = getProviderLabel(provider).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var svg = [
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">',
            '<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#9ed4db"/><stop offset="100%" stop-color="#0f4761"/></linearGradient></defs>',
            '<rect width="1280" height="720" fill="url(#g)"/>',
            '<circle cx="640" cy="340" r="86" fill="rgba(255,255,255,0.95)"/>',
            '<polygon points="620,292 620,388 694,340" fill="#0f4761"/>',
            '<rect x="56" y="56" rx="999" ry="999" width="250" height="52" fill="rgba(255,255,255,0.92)"/>',
            '<text x="181" y="89" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700" fill="#0f4761">' + safeProvider + '</text>',
            '<text x="80" y="560" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="700" fill="#ffffff">' + safeTitle + '</text>',
            '<text x="80" y="610" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.9)">Click play to open in popup player</text>',
            '</svg>'
        ].join('');
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }

    function buildVideoData(url, title, linkText) {
        var normalized = normalizeUrl(url);
        var provider = getProvider(normalized);
        if (!provider) return null;

        var data = {
            provider: provider,
            sourceUrl: normalized,
            openUrl: normalized,
            embedUrl: normalized,
            title: (title || '').trim() || getProviderLabel(provider),
            linkText: (linkText || '').trim() || normalized,
            thumbUrl: '',
            key: ''
        };

        if (provider === 'youtube') {
            var youtubeId = getYouTubeId(normalized);
            if (!youtubeId) return null;
            data.openUrl = 'https://www.youtube.com/watch?v=' + youtubeId;
            data.embedUrl = 'https://www.youtube-nocookie.com/embed/' + youtubeId + '?autoplay=1&rel=0&modestbranding=1';
            data.thumbUrl = 'https://i.ytimg.com/vi/' + youtubeId + '/hqdefault.jpg';
            data.key = 'youtube:' + youtubeId;
        } else if (provider === 'panopto') {
            var panoptoId = getPanoptoId(normalized);
            if (!panoptoId) return null;
            data.openUrl = buildPanoptoViewer(normalized);
            data.embedUrl = buildPanoptoEmbed(normalized);
            data.thumbUrl = '';
            data.key = 'panopto:' + panoptoId;
        } else if (provider === 'sharepoint') {
            data.openUrl = normalized;
            data.embedUrl = normalized;
            data.thumbUrl = '';
            data.key = 'sharepoint:' + normalized;
        }

        data.fallbackThumbUrl = buildPosterDataUrl(data.title, data.provider);
        if (!data.thumbUrl) {
            data.thumbUrl = data.fallbackThumbUrl;
        }
        return data;
    }

    function extractLinkText(anchor) {
        return (anchor.getAttribute('data-video-title') || anchor.textContent || anchor.href || '').replace(/\s+/g, ' ').trim();
    }

    function isVideoUrl(url) {
        return !!getProvider(url);
    }

    function getCanonicalKeyFromElement(element) {
        if (!element) return null;
        if (element.tagName === 'A') {
            var linkData = buildVideoData(element.href, '', extractLinkText(element));
            return linkData ? linkData.key : null;
        }
        if (element.tagName === 'IFRAME') {
            var frameData = buildVideoData(element.src, element.title || '', element.title || '');
            return frameData ? frameData.key : null;
        }
        var anchor = element.querySelector ? element.querySelector('a[href]') : null;
        if (anchor && isVideoUrl(anchor.href)) {
            return getCanonicalKeyFromElement(anchor);
        }
        var iframe = element.querySelector ? element.querySelector('iframe[src]') : null;
        if (iframe && isVideoUrl(iframe.src)) {
            return getCanonicalKeyFromElement(iframe);
        }
        return null;
    }

    function isSimpleVideoLinkBlock(element, key) {
        if (!element || !key) return false;
        if (element.querySelector('iframe, img, video, button, figure')) return false;
        var anchors = element.querySelectorAll('a[href]');
        if (anchors.length !== 1) return false;
        if (getCanonicalKeyFromElement(anchors[0]) !== key) return false;
        var text = (element.textContent || '').replace(/\s+/g, ' ').trim();
        return text.length > 0 && text.length < 240;
    }

    function findAssociatedLinkBlock(referenceElement, key) {
        if (!referenceElement || !referenceElement.parentElement) return null;
        var prev = referenceElement.previousElementSibling;
        var next = referenceElement.nextElementSibling;
        if (isSimpleVideoLinkBlock(prev, key)) return prev;
        if (isSimpleVideoLinkBlock(next, key)) return next;
        return null;
    }

    function createPreviewCard(data, externalLabel) {
        var wrapper = document.createElement('div');
        wrapper.className = 'video-preview-card';
        wrapper.classList.add('provider-' + data.provider);
        wrapper.setAttribute('data-video-enhanced', 'true');
        wrapper.setAttribute('data-video-key', data.key);

        var shell = document.createElement('div');
        shell.className = 'video-preview-shell';

        var img = document.createElement('img');
        img.className = 'video-preview-image';
        img.alt = data.title;
        img.src = data.thumbUrl;
        img.addEventListener('error', function () {
            if (img.src !== data.fallbackThumbUrl) {
                img.src = data.fallbackThumbUrl;
            }
        });

        var overlay = document.createElement('div');
        overlay.className = 'video-preview-overlay';

        var meta = document.createElement('div');
        meta.className = 'video-preview-meta';

        var copy = document.createElement('div');
        copy.className = 'video-preview-copy';

        var badge = document.createElement('span');
        badge.className = 'video-preview-badge';
        badge.textContent = getProviderLabel(data.provider);

        var title = document.createElement('p');
        title.className = 'video-preview-title';
        title.textContent = data.title;

        copy.appendChild(badge);
        copy.appendChild(title);

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'video-preview-play';
        button.setAttribute('aria-label', 'Play ' + data.title);

        var icon = document.createElement('span');
        icon.className = 'video-preview-play-icon';
        icon.setAttribute('aria-hidden', 'true');

        var buttonText = document.createElement('span');
        buttonText.textContent = 'Play Video';

        button.appendChild(icon);
        button.appendChild(buttonText);

        meta.appendChild(copy);
        meta.appendChild(button);

        shell.appendChild(img);
        shell.appendChild(overlay);
        shell.appendChild(meta);

        var linkRow = document.createElement('p');
        linkRow.className = 'video-preview-link';
        var link = document.createElement('a');
        link.href = data.openUrl;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = externalLabel || data.linkText || data.openUrl;
        linkRow.appendChild(link);

        wrapper.appendChild(shell);
        wrapper.appendChild(linkRow);
        wrapper.__videoData = data;
        wrapper.__playButton = button;
        return wrapper;
    }

    injectStyles();
    var modalParts = createModal();

    function closeModal() {
        modalParts.modal.hidden = true;
        document.body.classList.remove('video-modal-open');
        modalParts.playerWrap.innerHTML = '';
        modalParts.status.hidden = true;
        modalParts.status.textContent = '';
    }

    function openModal(data) {
        modalParts.title.textContent = data.title;
        modalParts.link.href = data.openUrl;
        modalParts.link.textContent = data.linkText || data.openUrl;
        modalParts.playerWrap.innerHTML = '';

        var iframe = document.createElement('iframe');
        iframe.src = data.embedUrl;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.title = data.title;

        modalParts.status.textContent = 'If playback is blocked by the provider, use the link below to open the video in a new tab.';
        modalParts.status.hidden = false;
        modalParts.playerWrap.appendChild(iframe);
        modalParts.modal.hidden = false;
        document.body.classList.add('video-modal-open');
    }

    modalParts.modal.addEventListener('click', function (event) {
        if (event.target.closest('[data-close-video-modal]')) {
            event.preventDefault();
            closeModal();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !modalParts.modal.hidden) {
            closeModal();
        }
    });

    function attachPreviewBehavior(card) {
        if (!card || !card.__videoData || !card.__playButton) return;
        card.__playButton.addEventListener('click', function () {
            openModal(card.__videoData);
        });
    }

    function replaceNode(target, card) {
        if (!target || !target.parentNode) return;
        target.parentNode.replaceChild(card, target);
        attachPreviewBehavior(card);
    }

    function insertAfter(target, card) {
        if (!target || !target.parentNode) return;
        target.parentNode.insertBefore(card, target.nextSibling);
        attachPreviewBehavior(card);
    }

    function maybeRemoveAssociatedLinkBlock(referenceElement, key) {
        var block = findAssociatedLinkBlock(referenceElement, key);
        if (!block) return '';
        var text = (block.textContent || '').replace(/\s+/g, ' ').trim();
        block.remove();
        return text;
    }

    function enhanceIframe(iframe) {
        if (!iframe || iframe.closest('[data-video-enhanced="true"]')) return;
        var data = buildVideoData(iframe.src, iframe.title || 'Video', iframe.title || 'Open video in new tab');
        if (!data) return;
        var container = iframe.closest('.panopto-viewer, .video') || iframe;
        var externalLabel = maybeRemoveAssociatedLinkBlock(container, data.key);
        var card = createPreviewCard(data, externalLabel);
        replaceNode(container, card);
    }

    function enhanceImageAnchor(anchor) {
        if (!anchor || anchor.closest('[data-video-enhanced="true"]')) return;
        if (!anchor.querySelector('img')) return;
        var title = anchor.querySelector('img').alt || extractLinkText(anchor) || 'Video';
        var data = buildVideoData(anchor.href, title, extractLinkText(anchor));
        if (!data) return;

        var block = anchor.closest('p, div, figure, li') || anchor;
        var externalLabel = maybeRemoveAssociatedLinkBlock(block, data.key);
        var card = createPreviewCard(data, externalLabel);

        if (block !== anchor && block.querySelectorAll('a[href]').length === 1 && block.querySelectorAll('img').length === 1) {
            replaceNode(block, card);
        } else {
            replaceNode(anchor, card);
        }
    }

    function enhanceStandaloneAnchor(anchor) {
        if (!anchor || anchor.closest('[data-video-enhanced="true"]')) return;
        if (anchor.querySelector('img')) return;
        var data = buildVideoData(anchor.href, extractLinkText(anchor), extractLinkText(anchor));
        if (!data) return;

        var block = anchor.closest('p, li, div') || anchor;
        var card = createPreviewCard(data, 'Open video in new tab');
        var text = (block.textContent || '').replace(/\s+/g, ' ').trim();
        var onlyLink = block.querySelectorAll('a[href]').length === 1 && text === extractLinkText(anchor);

        if (onlyLink) {
            replaceNode(block, card);
        } else {
            if (block.nextElementSibling && block.nextElementSibling.getAttribute('data-video-key') === data.key) {
                return;
            }
            insertAfter(block, card);
        }
    }

    Array.prototype.slice.call(document.querySelectorAll('iframe[src]')).forEach(enhanceIframe);
    Array.prototype.slice.call(document.querySelectorAll('a[href]')).forEach(function (anchor) {
        if (!isVideoUrl(anchor.href)) return;
        if (anchor.querySelector('img')) {
            enhanceImageAnchor(anchor);
        }
    });
    Array.prototype.slice.call(document.querySelectorAll('a[href]')).forEach(function (anchor) {
        if (!isVideoUrl(anchor.href)) return;
        enhanceStandaloneAnchor(anchor);
    });
})();