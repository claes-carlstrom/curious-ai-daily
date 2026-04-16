(function () {
  let currentIndex = -1;
  let navigables: Element[] = [];
  let helpVisible = false;
  let helpOverlay: HTMLElement | null = null;

  const HIGHLIGHT_STYLE = {
    borderLeft: '2px solid rgba(0, 255, 136, 0.4)',
    background: 'rgba(0, 255, 136, 0.03)',
    transition: 'background 0.1s',
  };

  function getNavigables(): Element[] {
    const stories = Array.from(document.querySelectorAll('[data-story-index]'));
    if (stories.length > 0) return stories;
    return Array.from(document.querySelectorAll('[data-archive-row]'));
  }

  function applyHighlight(el: Element) {
    (el as HTMLElement).style.borderLeft = HIGHLIGHT_STYLE.borderLeft;
    (el as HTMLElement).style.background = HIGHLIGHT_STYLE.background;
    (el as HTMLElement).style.transition = HIGHLIGHT_STYLE.transition;
  }

  function removeHighlight(el: Element) {
    (el as HTMLElement).style.borderLeft = '';
    (el as HTMLElement).style.background = '';
    (el as HTMLElement).style.transition = '';
  }

  function setIndex(newIndex: number) {
    navigables = getNavigables();
    if (navigables.length === 0) return;

    if (currentIndex >= 0 && currentIndex < navigables.length) {
      removeHighlight(navigables[currentIndex]);
    }

    currentIndex = Math.max(0, Math.min(newIndex, navigables.length - 1));
    applyHighlight(navigables[currentIndex]);
    navigables[currentIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function openCurrent() {
    navigables = getNavigables();
    if (currentIndex < 0 || currentIndex >= navigables.length) return;
    const el = navigables[currentIndex];
    const link = el.querySelector('a[href]') as HTMLAnchorElement | null;
    if (link) {
      window.open(link.href, '_blank', 'noopener,noreferrer');
    }
  }

  function clickNav(direction: 'prev' | 'next') {
    const el = document.querySelector(`[data-nav="${direction}"]`) as HTMLElement | null;
    if (el) el.click();
  }

  function getDateFromUrl(): string | null {
    // Check URL first: /digest/YYYY-MM-DD
    const match = window.location.pathname.match(/\/digest\/(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
    // Fallback: data-digest-date attribute on body (set by index and digest pages)
    const attr = document.body.getAttribute('data-digest-date');
    if (attr) return attr;
    return null;
  }

  function getISOWeek(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
  }

  function softNavigate(href: string) {
    // Click a matching <a> tag so ClientRouter intercepts it for smooth transitions
    const existing = document.querySelector(`a[href="${href}"]`) as HTMLAnchorElement | null;
    if (existing) { existing.click(); return; }
    // Fallback: create a temporary link and click it
    const a = document.createElement('a');
    a.href = href;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function navigateWeek() {
    const link = document.querySelector('a[href*="/weekly/"]') as HTMLAnchorElement | null;
    if (link) { link.click(); return; }
    const dateStr = getDateFromUrl();
    if (!dateStr) return;
    softNavigate(`/weekly/${getISOWeek(dateStr)}`);
  }

  function navigateMonth() {
    const link = document.querySelector('a[href*="/monthly/"]') as HTMLAnchorElement | null;
    if (link) { link.click(); return; }
    const dateStr = getDateFromUrl();
    if (!dateStr) return;
    softNavigate(`/monthly/${dateStr.slice(0, 7)}`);
  }

  function createHelpOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.id = 'kb-help-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(2px)',
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      background: '#0d1117',
      border: '1px solid rgba(0, 255, 136, 0.2)',
      borderRadius: '8px',
      padding: '28px 36px',
      minWidth: '320px',
      maxWidth: '480px',
      color: '#c9d1d9',
      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
      fontSize: '13px',
      lineHeight: '1.6',
    });

    const title = document.createElement('div');
    Object.assign(title.style, {
      color: 'rgba(0, 255, 136, 0.85)',
      fontWeight: '600',
      fontSize: '14px',
      marginBottom: '16px',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    });
    title.textContent = 'Keyboard Shortcuts';

    const shortcuts: [string, string][] = [
      ['↑ / ↓', 'Next / previous story'],
      ['Enter', 'Open story in new tab'],
      ['← / →', 'Previous / next day or period'],
      ['d', 'Go to today\'s digest'],
      ['w', 'Go to this week\'s rollup'],
      ['m', 'Go to this month\'s rollup'],
      ['a', 'Go to archive'],
      ['t', 'Toggle dark / light theme'],
      ['?', 'Toggle this help overlay'],
    ];

    const table = document.createElement('table');
    Object.assign(table.style, {
      borderCollapse: 'collapse',
      width: '100%',
    });

    for (const [key, desc] of shortcuts) {
      const row = document.createElement('tr');

      const keyCell = document.createElement('td');
      Object.assign(keyCell.style, {
        padding: '4px 16px 4px 0',
        whiteSpace: 'nowrap',
        color: 'rgba(0, 255, 136, 0.7)',
        fontWeight: '500',
      });
      keyCell.textContent = key;

      const descCell = document.createElement('td');
      Object.assign(descCell.style, {
        padding: '4px 0',
        color: '#8b949e',
      });
      descCell.textContent = desc;

      row.appendChild(keyCell);
      row.appendChild(descCell);
      table.appendChild(row);
    }

    const hint = document.createElement('div');
    Object.assign(hint.style, {
      marginTop: '18px',
      color: '#484f58',
      fontSize: '11px',
    });
    hint.textContent = 'Press ? or Escape to close';

    box.appendChild(title);
    box.appendChild(table);
    box.appendChild(hint);
    overlay.appendChild(box);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideHelp();
    });

    return overlay;
  }

  function showHelp() {
    if (!helpOverlay) {
      helpOverlay = createHelpOverlay();
      document.body.appendChild(helpOverlay);
    }
    helpOverlay.style.display = 'flex';
    helpVisible = true;
  }

  function hideHelp() {
    if (helpOverlay) helpOverlay.style.display = 'none';
    helpVisible = false;
  }

  function toggleHelp() {
    if (helpVisible) hideHelp();
    else showHelp();
  }

  function isTyping(): boolean {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return true;
    if ((el as HTMLElement).isContentEditable) return true;
    return false;
  }

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Always allow Escape to close help
    if (e.key === 'Escape') {
      if (helpVisible) {
        hideHelp();
        return;
      }
    }

    if (isTyping()) return;

    // No modifier keys (except Shift for ? glyph)
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    switch (e.key) {
      case 'j':
      case 'ArrowDown':
        e.preventDefault();
        navigables = getNavigables();
        setIndex(currentIndex < 0 ? 0 : currentIndex + 1);
        break;

      case 'k':
      case 'ArrowUp':
        e.preventDefault();
        navigables = getNavigables();
        setIndex(currentIndex <= 0 ? 0 : currentIndex - 1);
        break;

      case 'Enter':
        if (currentIndex >= 0) {
          e.preventDefault();
          openCurrent();
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        clickNav('prev');
        break;

      case 'ArrowRight':
        e.preventDefault();
        clickNav('next');
        break;

      case 'w':
        e.preventDefault();
        navigateWeek();
        break;

      case 'm':
        e.preventDefault();
        navigateMonth();
        break;

      case 'd':
        e.preventDefault();
        softNavigate('/');
        break;

      case 'a':
        e.preventDefault();
        softNavigate('/archive');
        break;

      case 't':
        e.preventDefault();
        const btn = document.getElementById('theme-toggle') as HTMLElement | null;
        if (btn) btn.click();
        break;

      case '?':
        e.preventDefault();
        toggleHelp();
        break;
    }
  });

  // Reset index on navigation (soft navigations / Astro view transitions)
  document.addEventListener('astro:page-load', () => {
    currentIndex = -1;
    navigables = [];
    helpOverlay = null;
    helpVisible = false;
  });
})();
