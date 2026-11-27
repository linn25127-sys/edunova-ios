'use strict';

const WebCopy = (() => {
  const storageKey = 'edunova:website:published:v1';
  const defaultTabs = ['home', 'subjects', 'classroom', 'practice', 'profile'];
  const labelKeys = {
    All: 'a52ace420f21',
    New: '18fdd549b2ed',
    Started: 'ecbc89cd37a0',
    Done: '11a6767d5674'
  };
  let content = {text: {}, branding: {}, tabs: defaultTabs, showPreview: true, announcement: ''};
  function adopt(data) {
    if (data?.schema !== 1) return;
    content = {
      text: data.text && typeof data.text === 'object' ? data.text : {},
      branding: data.branding && typeof data.branding === 'object' ? data.branding : {},
      tabs: Array.isArray(data.tabs) ? [...new Set(['home', ...data.tabs.filter(x => defaultTabs.includes(x))])] : defaultTabs,
      showPreview: data.showPreview !== false,
      announcement: typeof data.announcement === 'string' ? data.announcement.trim().slice(0, 2000) : ''
    };
  }
  function text(key, fallback, params = []) {
    const value = Object.hasOwn(content.text, key) ? content.text[key] : fallback;
    const copy = typeof value === 'string' && value.length <= 3000 ? value : fallback;
    return params.length ? copy.replace(/\{(\d+)\}/g, (match, i) => params[i] ?? match) : copy;
  }
  function color(key, fallback) {
    const value = content.branding[key];
    return typeof value === 'string' && /^#[a-f\d]{6}$/i.test(value) ? value : fallback;
  }
  function asset(key, fallback) {
    const value = content.branding[key];
    if (typeof value !== 'string' || !value.trim()) return fallback;
    try {
      const url = new URL(value, location.href);
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : fallback;
    } catch { return fallback; }
  }
  function applyStatic() {
    document.querySelectorAll('[data-copy]').forEach(element => {
      element.textContent = text(element.dataset.copy, element.textContent);
    });
    document.querySelectorAll('[data-copy-content]').forEach(element => {
      element.content = text(element.dataset.copyContent, element.content);
    });
    const nav = document.getElementById('nav');
    nav.setAttribute('aria-label', text('eb355944b92d','Main navigation'));
    const intro = document.querySelector('#intro img');
    intro.src = asset('logo', './icon-192.png');
    const cover = asset('hero', '');
    if (cover) document.documentElement.style.setProperty('--remote-hero', 'url(' + JSON.stringify(cover) + ')');
    const favicon = document.querySelector('link[rel="icon"]');
    favicon.href = asset('logo', './icon-192.png');
  }
  try { adopt(JSON.parse(localStorage.getItem(storageKey))); } catch {}
  const ready = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);
    try {
      const response = await fetch('./site-content.json', {cache:'no-store', signal:controller.signal});
      if (!response.ok) return;
      const current = await response.json();
      if (current?.schema === 1) {
        adopt(current);
        try { localStorage.setItem(storageKey, JSON.stringify(current)); } catch {}
      }
    } catch { /* The built-in and last published copy also work offline. */ }
    finally { clearTimeout(timeout); applyStatic(); }
  })();
  return {
    ready, text, color, asset,
    label: value => text(labelKeys[value], value),
    typeLabel: value => {
      const labels = {"MCQ":"f2c539c844e0","TRUE FALSE":"c1ca984b5099","FILL BLANKS":"7652782ebe75","True":"3cbc87c7681f","False":"60a33e6cf515"};
      const name = value.replaceAll('_', ' ');
      return text(labels[name], name);
    },
    tabs: () => content.tabs,
    showPreview: () => content.showPreview,
    announcement: () => content.announcement
  };
})();
