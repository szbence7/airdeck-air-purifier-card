const tag = 'airdeck-air-purifier-card';
const name = 'AirDeck Air Purifier Card';
const features = { speed: 1, preset: 8, off: 16, on: 32 };

const fields = [
  { key: 'entity', label: 'Air purifier', domain: 'fan', required: true },
  { key: 'show_power', label: 'Show power button' },
  { key: 'show_speed', label: 'Show speed controls' },
  { key: 'show_presets', label: 'Show operating modes' },
  { key: 'show_air_quality', label: 'Show air quality' },
  { key: 'air_quality_entity', label: 'Air quality sensor', domain: 'sensor', toggle: 'show_air_quality' },
  { key: 'pm25_entity', label: 'PM2.5 sensor', domain: 'sensor', toggle: 'show_air_quality' },
  { key: 'show_filter', label: 'Show filter status' },
  { key: 'filter_entity', label: 'Filter sensor', domain: 'sensor', toggle: 'show_filter' },
  { key: 'show_display', label: 'Show device display status' },
  { key: 'display_entity', label: 'Device display', domain: ['light', 'switch'], toggle: 'show_display' },
  { key: 'show_ioniser', label: 'Show ioniser control' },
  { key: 'ioniser_entity', label: 'Ioniser switch or script', domain: ['switch', 'script'], toggle: 'show_ioniser' },
  { key: 'show_uv', label: 'Show UV control' },
  { key: 'uv_entity', label: 'UV switch or script', domain: ['switch', 'script'], toggle: 'show_uv' },
];

const extraControls = [
  { key: 'ioniser', label: 'Ioniser', icon: 'mdi:creation' },
  { key: 'uv', label: 'UV Sterilisation', icon: 'mdi:lightbulb-fluorescent-tube' },
];

// Material Design Icons by Pictogrammers, Apache-2.0. See LICENSE-MDI.
const referenceIcons = {
  'mdi:fan': "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z",
  'mdi:power': "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13",
  'mdi:fan-auto': "M12.5 2C8.93 2 8.14 5.96 10.13 9.65C9.72 9.97 9.4 10.39 9.21 10.87C8.28 10.68 7.23 10.25 6.73 9.26C5.56 6.89 2 7 2 11.5C2 15.07 5.95 15.85 9.64 13.87C9.96 14.27 10.39 14.59 10.88 14.79C10.68 15.71 10.24 16.75 9.26 17.24C6.9 18.42 7 22 11.5 22C12.31 22 13 21.78 13.5 21.41C13.19 20.67 13 19.86 13 19C13 17.59 13.5 16.3 14.3 15.28C14.17 14.97 14.03 14.65 13.86 14.34C14.26 14 14.57 13.59 14.77 13.11C15.26 13.21 15.78 13.39 16.25 13.67C17.07 13.25 18 13 19 13C20.05 13 21.03 13.27 21.89 13.74C21.95 13.37 22 12.96 22 12.5C22 8.92 18.03 8.13 14.33 10.13C14 9.73 13.59 9.42 13.11 9.22C13.3 8.29 13.74 7.24 14.73 6.75C17.09 5.57 17 2 12.5 2M12 11C12.54 11 13 11.45 13 12C13 12.55 12.54 13 12 13C11.43 13 11 12.55 11 12C11 11.45 11.43 11 12 11M18 15C16.89 15 16 15.9 16 17V23H18V21H20V23H22V17C22 15.9 21.1 15 20 15M18 17H20V19H18Z",
  'mdi:fan-speed-1': "M13 19C13 17.59 13.5 16.3 14.3 15.28C14.17 14.97 14.03 14.65 13.86 14.34C14.26 14 14.57 13.59 14.77 13.11C15.26 13.21 15.78 13.39 16.25 13.67C17.07 13.25 18 13 19 13C20.05 13 21.03 13.27 21.89 13.74C21.95 13.37 22 12.96 22 12.5C22 8.92 18.03 8.13 14.33 10.13C14 9.73 13.59 9.42 13.11 9.22C13.3 8.29 13.74 7.24 14.73 6.75C17.09 5.57 17 2 12.5 2C8.93 2 8.14 5.96 10.13 9.65C9.72 9.97 9.4 10.39 9.21 10.87C8.28 10.68 7.23 10.25 6.73 9.26C5.56 6.89 2 7 2 11.5C2 15.07 5.95 15.85 9.64 13.87C9.96 14.27 10.39 14.59 10.88 14.79C10.68 15.71 10.24 16.75 9.26 17.24C6.9 18.42 7 22 11.5 22C12.31 22 13 21.78 13.5 21.41C13.19 20.67 13 19.86 13 19M12 13C11.43 13 11 12.55 11 12S11.43 11 12 11C12.54 11 13 11.45 13 12S12.54 13 12 13M17 15V17H18V23H20V15H17Z",
  'mdi:fan-speed-2': "M13 19C13 17.59 13.5 16.3 14.3 15.28C14.17 14.97 14.03 14.65 13.86 14.34C14.26 14 14.57 13.59 14.77 13.11C15.26 13.21 15.78 13.39 16.25 13.67C17.07 13.25 18 13 19 13C20.05 13 21.03 13.27 21.89 13.74C21.95 13.37 22 12.96 22 12.5C22 8.92 18.03 8.13 14.33 10.13C14 9.73 13.59 9.42 13.11 9.22C13.3 8.29 13.74 7.24 14.73 6.75C17.09 5.57 17 2 12.5 2C8.93 2 8.14 5.96 10.13 9.65C9.72 9.97 9.4 10.39 9.21 10.87C8.28 10.68 7.23 10.25 6.73 9.26C5.56 6.89 2 7 2 11.5C2 15.07 5.95 15.85 9.64 13.87C9.96 14.27 10.39 14.59 10.88 14.79C10.68 15.71 10.24 16.75 9.26 17.24C6.9 18.42 7 22 11.5 22C12.31 22 13 21.78 13.5 21.41C13.19 20.67 13 19.86 13 19M12 13C11.43 13 11 12.55 11 12S11.43 11 12 11C12.54 11 13 11.45 13 12S12.54 13 12 13M16 15V17H19V18H18C16.9 18 16 18.9 16 20V23H21V21H18V20H19C20.11 20 21 19.11 21 18V17C21 15.9 20.11 15 19 15H16Z",
  'mdi:fan-speed-3': "M13 19C13 17.59 13.5 16.3 14.3 15.28C14.17 14.97 14.03 14.65 13.86 14.34C14.26 14 14.57 13.59 14.77 13.11C15.26 13.21 15.78 13.39 16.25 13.67C17.07 13.25 18 13 19 13C20.05 13 21.03 13.27 21.89 13.74C21.95 13.37 22 12.96 22 12.5C22 8.92 18.03 8.13 14.33 10.13C14 9.73 13.59 9.42 13.11 9.22C13.3 8.29 13.74 7.24 14.73 6.75C17.09 5.57 17 2 12.5 2C8.93 2 8.14 5.96 10.13 9.65C9.72 9.97 9.4 10.39 9.21 10.87C8.28 10.68 7.23 10.25 6.73 9.26C5.56 6.89 2 7 2 11.5C2 15.07 5.95 15.85 9.64 13.87C9.96 14.27 10.39 14.59 10.88 14.79C10.68 15.71 10.24 16.75 9.26 17.24C6.9 18.42 7 22 11.5 22C12.31 22 13 21.78 13.5 21.41C13.19 20.67 13 19.86 13 19M12 13C11.43 13 11 12.55 11 12S11.43 11 12 11C12.54 11 13 11.45 13 12S12.54 13 12 13M21 21V20.5C21 19.67 20.33 19 19.5 19C20.33 19 21 18.33 21 17.5V17C21 15.89 20.1 15 19 15H16V17H19V18H17V20H19V21H16V23H19C20.11 23 21 22.11 21 21",
  'mdi:sleep': "M23,12H17V10L20.39,6H17V4H23V6L19.62,10H23V12M15,16H9V14L12.39,10H9V8H15V10L11.62,14H15V16M7,20H1V18L4.39,14H1V12H7V14L3.62,18H7V20Z",
  'mdi:air-filter': "M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",
  'mdi:blur': "M14,8.5A1.5,1.5 0 0,0 12.5,10A1.5,1.5 0 0,0 14,11.5A1.5,1.5 0 0,0 15.5,10A1.5,1.5 0 0,0 14,8.5M14,12.5A1.5,1.5 0 0,0 12.5,14A1.5,1.5 0 0,0 14,15.5A1.5,1.5 0 0,0 15.5,14A1.5,1.5 0 0,0 14,12.5M10,17A1,1 0 0,0 9,18A1,1 0 0,0 10,19A1,1 0 0,0 11,18A1,1 0 0,0 10,17M10,8.5A1.5,1.5 0 0,0 8.5,10A1.5,1.5 0 0,0 10,11.5A1.5,1.5 0 0,0 11.5,10A1.5,1.5 0 0,0 10,8.5M14,20.5A0.5,0.5 0 0,0 13.5,21A0.5,0.5 0 0,0 14,21.5A0.5,0.5 0 0,0 14.5,21A0.5,0.5 0 0,0 14,20.5M14,17A1,1 0 0,0 13,18A1,1 0 0,0 14,19A1,1 0 0,0 15,18A1,1 0 0,0 14,17M21,13.5A0.5,0.5 0 0,0 20.5,14A0.5,0.5 0 0,0 21,14.5A0.5,0.5 0 0,0 21.5,14A0.5,0.5 0 0,0 21,13.5M18,5A1,1 0 0,0 17,6A1,1 0 0,0 18,7A1,1 0 0,0 19,6A1,1 0 0,0 18,5M18,9A1,1 0 0,0 17,10A1,1 0 0,0 18,11A1,1 0 0,0 19,10A1,1 0 0,0 18,9M18,17A1,1 0 0,0 17,18A1,1 0 0,0 18,19A1,1 0 0,0 19,18A1,1 0 0,0 18,17M18,13A1,1 0 0,0 17,14A1,1 0 0,0 18,15A1,1 0 0,0 19,14A1,1 0 0,0 18,13M10,12.5A1.5,1.5 0 0,0 8.5,14A1.5,1.5 0 0,0 10,15.5A1.5,1.5 0 0,0 11.5,14A1.5,1.5 0 0,0 10,12.5M10,7A1,1 0 0,0 11,6A1,1 0 0,0 10,5A1,1 0 0,0 9,6A1,1 0 0,0 10,7M10,3.5A0.5,0.5 0 0,0 10.5,3A0.5,0.5 0 0,0 10,2.5A0.5,0.5 0 0,0 9.5,3A0.5,0.5 0 0,0 10,3.5M10,20.5A0.5,0.5 0 0,0 9.5,21A0.5,0.5 0 0,0 10,21.5A0.5,0.5 0 0,0 10.5,21A0.5,0.5 0 0,0 10,20.5M3,13.5A0.5,0.5 0 0,0 2.5,14A0.5,0.5 0 0,0 3,14.5A0.5,0.5 0 0,0 3.5,14A0.5,0.5 0 0,0 3,13.5M14,3.5A0.5,0.5 0 0,0 14.5,3A0.5,0.5 0 0,0 14,2.5A0.5,0.5 0 0,0 13.5,3A0.5,0.5 0 0,0 14,3.5M14,7A1,1 0 0,0 15,6A1,1 0 0,0 14,5A1,1 0 0,0 13,6A1,1 0 0,0 14,7M21,10.5A0.5,0.5 0 0,0 21.5,10A0.5,0.5 0 0,0 21,9.5A0.5,0.5 0 0,0 20.5,10A0.5,0.5 0 0,0 21,10.5M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5M3,9.5A0.5,0.5 0 0,0 2.5,10A0.5,0.5 0 0,0 3,10.5A0.5,0.5 0 0,0 3.5,10A0.5,0.5 0 0,0 3,9.5M6,9A1,1 0 0,0 5,10A1,1 0 0,0 6,11A1,1 0 0,0 7,10A1,1 0 0,0 6,9M6,17A1,1 0 0,0 5,18A1,1 0 0,0 6,19A1,1 0 0,0 7,18A1,1 0 0,0 6,17M6,13A1,1 0 0,0 5,14A1,1 0 0,0 6,15A1,1 0 0,0 7,14A1,1 0 0,0 6,13Z",
  'mdi:creation': "M19,1L17.74,3.75L15,5L17.74,6.26L19,9L20.25,6.26L23,5L20.25,3.75M9,4L6.5,9.5L1,12L6.5,14.5L9,20L11.5,14.5L17,12L11.5,9.5M19,15L17.74,17.74L15,19L17.74,20.25L19,23L20.25,20.25L23,19L20.25,17.74",
  'mdi:lightbulb-fluorescent-tube': "M7.05 2.81L6.5 3.34L5.11 1.92L3.87 3.16L5.28 4.58L4.58 5.28L3.16 3.87L1.92 5.11L3.34 6.5L2.81 7.05L16.95 21.19L17.5 20.66L18.89 22.08L20.13 20.84L18.72 19.43L19.42 18.72L20.84 20.13L22.08 18.9L20.66 17.5L21.19 16.95L7.05 2.81Z",
};
const svgNamespace = 'http://www.w3.org/2000/svg';
const namedSpeeds = ['low', 'medium', 'high'];
const presetIcons = new Map([
  ['auto', 'mdi:fan-auto'], ['automatic', 'mdi:fan-auto'], ['smart', 'mdi:fan-auto'],
  ['sleep', 'mdi:sleep'], ['night', 'mdi:weather-night'], ['quiet', 'mdi:volume-low'],
  ['silent', 'mdi:volume-off'], ['turbo', 'mdi:weather-windy'], ['boost', 'mdi:rocket-launch-outline'],
  ['eco', 'mdi:leaf'], ['breeze', 'mdi:weather-windy'], ['favourite', 'mdi:star-outline'],
  ['favorite', 'mdi:star-outline'], ['manual', 'mdi:tune-variant'],
]);

function modeLabel(mode) {
  return mode.replaceAll('_', ' ').replace(/^./, first => first.toUpperCase());
}

const available = entity => !!entity && !['unavailable', 'unknown'].includes(entity.state);

function speedSettings(attributes) {
  const step = attributes.percentage_step;
  const count = Number.isFinite(step) && step > 0 ? Math.min(100, Math.max(1, Math.round(100 / step))) : 100;
  return { count, percentage: level => Math.floor(level * 100 / count) };
}

function element(tagName, className, text) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name) {
  const shape = referenceIcons[name];
  const node = shape ? document.createElementNS(svgNamespace, 'svg') : element('ha-icon');
  node.classList.add('airdeck-icon');
  node.setAttribute('aria-hidden', 'true');
  if (shape) {
    node.setAttribute('viewBox', '0 0 24 24');
    node.setAttribute('focusable', 'false');
    const path = document.createElementNS(svgNamespace, 'path');
    path.setAttribute('d', shape);
    node.append(path);
  } else {
    node.setAttribute('icon', name);
  }
  return node;
}

class AirDeckCard extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host { display:block; }
        ha-card { display:block; overflow:hidden; color:var(--primary-text-color,#252b36); }
        .panel { display:grid; gap:8px; padding:0 0 12px; container-type:inline-size;
          --airdeck-muted:var(--secondary-text-color,#757575);
          --airdeck-surface:color-mix(in srgb,var(--primary-text-color,#252b36) 7%,transparent); }
        .header,.tile,.slider { display:flex; align-items:center; gap:10px; min-width:0; }
        .header { min-height:55px; padding:0 8px; }
        .body { display:contents; }
        .airdeck-icon { display:block; width:24px; height:24px; fill:currentColor; flex:none; }
        .badge .airdeck-icon { transform-origin:center; }
        .title,.tile-copy { flex:1; min-width:0; }
        .title strong,.title small,.tile-copy strong,.tile-copy small { display:block; overflow-wrap:anywhere; }
        .title strong,.tile-copy strong { font-size:.92rem; font-weight:600; }
        small { color:var(--airdeck-muted); font-size:.81rem; }
        .badge,.tile-icon { display:grid; place-items:center; width:38px; height:38px; flex:none;
          border-radius:50%; color:var(--airdeck-muted);
          background:color-mix(in srgb,currentColor 14%,transparent); }
        .badge.running { color:#4caf50; }
        .badge.running .airdeck-icon { animation:spin var(--airdeck-spin,1.6s) linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @media (prefers-reduced-motion:reduce) { .badge.running .airdeck-icon { animation:none; } }
        button { border:0; font:inherit; color:inherit; cursor:pointer; }
        button:focus-visible,input:focus-visible { outline:2px solid var(--primary-color,#25866b); outline-offset:2px; }
        button:disabled,input:disabled { opacity:.45; cursor:default; }
        .strip,.tiles { display:grid; gap:8px; margin:0 12px; }
        .strip { grid-template-columns:repeat(auto-fit,minmax(min(34px,100%),1fr));
          column-gap:6px; background:var(--airdeck-surface); border-radius:22px; }
        .control { min-width:0; min-height:42px; display:grid; place-items:center; border-radius:12px;
          color:var(--airdeck-muted); background:transparent; }
        .control:hover:not(:disabled),.tile:hover:not(:disabled) {
          background:color-mix(in srgb,var(--primary-text-color,#252b36) 12%,transparent); }
        .control[aria-pressed="true"] { color:#4caf50; }
        .power[aria-pressed="true"] { color:#f44336; }
        .power[aria-pressed="true"] .airdeck-icon { filter:drop-shadow(0 0 5px #f44336); }
        .speed-label { display:flex; align-items:center; gap:2px; font-size:.75rem; }
        .mode-caption { max-width:100%; padding:0 3px; overflow:hidden; text-overflow:ellipsis;
          white-space:nowrap; font-size:.65rem; }
        .slider { margin:0 12px; min-height:42px; padding:0 10px; border-radius:22px; background:var(--airdeck-surface); }
        .slider input { flex:1; min-width:0; accent-color:#4caf50; }
        .tiles { grid-template-columns:repeat(auto-fit,minmax(min(118px,100%),1fr)); }
        .tile { box-sizing:border-box; min-height:55px; padding:7px 9px; border-radius:14px;
          background:var(--airdeck-surface); text-align:start; }
        .metric .tile-icon { color:#4caf50; }
        .ioniser[aria-pressed="true"] .tile-icon { color:#2196f3; }
        .uv[aria-pressed="true"] .tile-icon { color:#536dfe; }
        .ioniser[aria-pressed="true"] .airdeck-icon,.uv[aria-pressed="true"] .airdeck-icon {
          filter:drop-shadow(0 0 5px currentColor); }
        .error { color:var(--error-color,#b3261e); font-size:.85rem; }
      </style>
      <ha-card><div class="panel">
        <div class="header"><span class="badge"></span><div class="title"><strong></strong><small></small></div></div>
        <div class="body"></div>
      </div></ha-card>`;
    this.panel = root.querySelector('.body');
    this.fanBadge = root.querySelector('.badge');
    this.fanBadge.append(icon('mdi:fan'));
    this.titleText = root.querySelector('.title strong');
    this.statusText = root.querySelector('.title small');
  }

  static getStubConfig(hass, unused = [], fallback = []) {
    const fans = [...new Set([...unused, ...fallback, ...Object.keys(hass?.states ?? {})])]
      .filter(id => id.startsWith('fan.'));
    const entity = fans.find(id => /purif|air_clean/i.test(id)) ?? fans[0] ?? 'fan.air_purifier';
    return { entity, ...Object.fromEntries(fields.filter(field => !field.domain).map(field => [field.key, true])) };
  }

  static getConfigForm() {
    return {
      schema: fields.map(({ key, domain, required, toggle }) => domain
        ? { name: key, required, selector: { entity: { domain } },
          ...(toggle ? { visible: { field: toggle, value: true } } : {}) }
        : { name: key, default: true, selector: { boolean: {} } }),
      computeLabel: field => fields.find(item => item.key === field.name)?.label,
      computeHelper: field => ({
        entity: 'Choose the fan entity for your air purifier. AirDeck uses its available speeds and modes.',
        air_quality_entity: 'Optional. Select a sensor that reports an air quality label.',
        display_entity: 'Optional. Show whether the purifier display is on or off.',
        pm25_entity: 'Optional. Select a particulate matter sensor.',
        filter_entity: 'Optional. Select a filter life or replacement sensor.',
        ioniser_entity: 'Optional. Use a switch to show its state, or a script to run an action.',
        uv_entity: 'Optional. Use a switch to show its state, or a script to run an action.',
      })[field.name],
    };
  }

  setConfig(config) {
    if (!/^fan\.[a-z0-9_]+$/.test(config?.entity ?? '')) throw new Error('Choose a fan entity for AirDeck.');
    if (this.config?.entity !== config.entity || this.config?.pm25_entity !== config.pm25_entity) {
      this.wasOn = undefined;
      this.pmBaseline = undefined;
    }
    this.config = { ...config };
    this.snapshot = undefined;
    this.render();
  }

  set hass(hass) {
    this.homeAssistant = hass;
    this.render();
  }

  getCardSize() { return 3; }
  getGridOptions() { return { columns: 12, rows: 'auto', min_columns: 6 }; }

  button(label, onClick, pressed, disabled) {
    const button = element('button', '', label);
    button.type = 'button';
    if (pressed !== undefined) button.setAttribute('aria-pressed', String(pressed));
    button.disabled = disabled;
    button.addEventListener('click', onClick);
    return button;
  }

  iconButton(label, iconName, action, pressed, disabled) {
    const button = this.button('', action, pressed, disabled);
    button.className = 'control';
    button.setAttribute('aria-label', label);
    button.title = label;
    button.append(icon(iconName));
    return button;
  }

  tile(label, value, iconName, button = element('div')) {
    const badge = element('span', 'tile-icon');
    badge.append(icon(iconName));
    const copy = element('div', 'tile-copy');
    copy.append(element('strong', '', label), element('small', '', value));
    button.append(badge, copy);
    return button;
  }

  async run(domain, action, entityId, values) {
    if (this.pending) return;
    this.pending = true;
    this.error = '';
    try {
      await this.homeAssistant.callService(domain, action, values, { entity_id: entityId });
    } catch (error) {
      this.error = error?.message || 'The action could not be completed.';
    } finally {
      this.pending = false;
      this.snapshot = undefined;
      this.render();
    }
  }

  render() {
    if (!this.config || !this.homeAssistant) return;
    const { states, locale } = this.homeAssistant;
    const config = this.config;
    const fan = states[config.entity];
    const pm25 = states[config.pm25_entity];
    const quality = states[config.air_quality_entity];
    const display = states[config.display_entity];
    const filter = states[config.filter_entity];
    const ioniser = states[config.ioniser_entity];
    const uv = states[config.uv_entity];
    const snapshot = [fan, pm25, quality, display, filter, ioniser, uv, locale];
    if (this.snapshot?.every((value, index) => value === snapshot[index])) return;
    this.snapshot = snapshot;
    const focused = this.shadowRoot.activeElement?.dataset.focusKey;
    const attrs = fan?.attributes ?? {};
    const supported = attrs.supported_features ?? 0;
    const on = fan?.state === 'on';
    const usable = available(fan);
    const runFan = (action, values) => this.run('fan', action, config.entity, values);
    const powerSupported = supported & (on ? features.off : features.on);
    const pmReading = available(pm25) && pm25.state.trim() ? Number(pm25.state) : NaN;
    if (!usable || !on) this.pmBaseline = undefined;
    if (on && this.wasOn === false && Number.isFinite(pmReading)) this.pmBaseline = pmReading;
    this.wasOn = usable ? on : undefined;
    this.fanBadge.classList.toggle('running', on);
    const mode = attrs.preset_mode?.toLowerCase();
    const speed = attrs.percentage;
    const speeds = speedSettings(attrs);
    const namedLevel = namedSpeeds.indexOf(mode) + 1;
    const level = namedLevel || (Number.isFinite(speed) && speed > 0 ? Math.max(1, Math.round(speed * speeds.count / 100)) : 0);
    const spin = mode === 'sleep' || mode === 'night' ? 3 : namedLevel === 3 || speed >= 90
      ? 0.7 : namedLevel === 2 || speed >= 60 ? 1.1 : 1.6;
    this.fanBadge.style.setProperty('--airdeck-spin', `${spin}s`);
    this.titleText.textContent = attrs.friendly_name ?? 'Air Purifier';
    const status = !fan ? 'Choose an air purifier in the card editor' : !usable ? 'Unavailable' : on ? 'On' : 'Off';
    const details = [status];
    if (on && usable) {
      if (namedLevel) details.push(`Speed ${namedLevel}`);
      else if (attrs.preset_mode) details.push(modeLabel(attrs.preset_mode));
      else if ((supported & features.speed) && level) details.push(speeds.count <= 5 ? `Speed ${level}` : `${speed}%`);
    }
    const format = state => available(state) ? this.homeAssistant.formatEntityState?.(state)
      ?? [state.state, state.attributes.unit_of_measurement].filter(Boolean).join(' ') : 'Unavailable';
    if (config.show_filter !== false && config.filter_entity) details.push(`Filter ${format(filter)}`);
    if (config.show_display !== false && config.display_entity) {
      details.push(`Display ${available(display) ? modeLabel(display.state) : 'Unavailable'}`);
    }
    this.statusText.textContent = details.join(' · ');
    const content = [];
    const strip = element('div', 'strip');
    strip.setAttribute('role', 'group');
    strip.setAttribute('aria-label', 'Air purifier controls');

    if (config.show_power !== false && (supported & (features.on | features.off))) {
      const power = this.iconButton(on ? 'Turn off air purifier' : 'Turn on air purifier', 'mdi:power',
        () => runFan(on ? 'turn_off' : 'turn_on'), on, !usable || !powerSupported);
      power.classList.add('power');
      power.dataset.focusKey = 'power';
      strip.append(power);
    }

    const presets = (supported & features.preset) && Array.isArray(attrs.preset_modes)
      ? attrs.preset_modes.filter(value => typeof value === 'string' && value.trim()) : [];
    const manual = presets.filter(preset => namedSpeeds.includes(preset.toLowerCase()))
      .sort((a, b) => namedSpeeds.indexOf(a.toLowerCase()) - namedSpeeds.indexOf(b.toLowerCase()));
    const useNamedSpeeds = manual.length > 0 && (!(supported & features.speed) || manual.length === namedSpeeds.length);
    const automatic = presets.filter(preset => ['auto', 'automatic', 'smart'].includes(preset.toLowerCase()));
    const other = presets.filter(preset => (!useNamedSpeeds || !manual.includes(preset)) && !automatic.includes(preset));
    const appendPreset = preset => {
      const key = preset.toLowerCase();
      const index = namedSpeeds.indexOf(key) + 1;
      const knownIcon = index ? `mdi:fan-speed-${index}` : presetIcons.get(key);
      const label = index ? `Speed ${index}` : modeLabel(preset);
      const button = this.iconButton(label, knownIcon ?? 'mdi:tune-variant',
        () => runFan('set_preset_mode', { preset_mode: preset }), on && attrs.preset_mode === preset, !usable);
      if (!knownIcon) button.append(element('span', 'mode-caption', label));
      button.dataset.focusKey = `preset-${presets.indexOf(preset)}`;
      strip.append(button);
    };
    if (config.show_presets !== false) automatic.forEach(appendPreset);
    let slider;
    if (config.show_speed !== false) {
      if (useNamedSpeeds) {
        manual.forEach(appendPreset);
      } else if (supported & features.speed) {
        if (speeds.count <= 5) {
          for (let index = 1; index <= speeds.count; index++) {
            const value = speeds.percentage(index);
            const button = this.iconButton(`Speed ${index}, ${value}%`, index <= 3 ? `mdi:fan-speed-${index}` : 'mdi:fan',
              () => runFan('set_percentage', { percentage: value }),
              on && !attrs.preset_mode && level === index, !usable);
            button.dataset.focusKey = `speed-${index - 1}`;
            if (index > 3) {
              const speedLabel = element('span', 'speed-label');
              speedLabel.append(icon('mdi:fan'), element('span', '', String(index)));
              button.replaceChildren(speedLabel);
            }
            strip.append(button);
          }
        } else {
          slider = element('div', 'slider');
          const range = element('input');
          range.type = 'range';
          range.min = '1';
          range.max = String(speeds.count);
          range.value = String(Math.max(1, level));
          range.disabled = !usable;
          range.dataset.focusKey = 'speed-slider';
          range.setAttribute('aria-label', 'Fan speed');
          const reading = element('small', '', `${speed || 0}%`);
          range.setAttribute('aria-valuetext', reading.textContent);
          range.addEventListener('input', () => {
            reading.textContent = `${speeds.percentage(Number(range.value))}%`;
            range.setAttribute('aria-valuetext', reading.textContent);
          });
          range.addEventListener('change', () => runFan('set_percentage', { percentage: speeds.percentage(Number(range.value)) }));
          slider.append(icon('mdi:fan'), range, reading);
        }
      }
    }
    if (config.show_presets !== false) other.forEach(appendPreset);
    if (strip.childElementCount) content.push(strip);
    if (slider) content.push(slider);

    const metrics = element('div', 'tiles');
    if (config.show_air_quality !== false && config.air_quality_entity) {
      const tile = this.tile('Air Quality', format(quality), 'mdi:air-filter');
      tile.className = 'tile metric';
      metrics.append(tile);
    }
    if (config.show_air_quality !== false && config.pm25_entity) {
      let value = format(pm25);
      if (this.pmBaseline !== undefined && Number.isFinite(pmReading)) {
        const change = new Intl.NumberFormat(locale?.language, { signDisplay: 'exceptZero', maximumFractionDigits: 1 })
          .format(pmReading - this.pmBaseline);
        value += ` · ${change} this run`;
      }
      const tile = this.tile('PM2.5', value, 'mdi:blur');
      tile.className = 'tile metric';
      metrics.append(tile);
    }
    if (metrics.childElementCount) content.push(metrics);

    const extras = element('div', 'tiles');
    for (const { key, label, icon: iconName } of extraControls) {
      const entityId = config[`${key}_entity`];
      if (!entityId || config[`show_${key}`] === false) continue;
      const state = states[entityId];
      const script = entityId.startsWith('script.');
      const value = !available(state) ? 'Unavailable' : script ? 'Run' : modeLabel(state.state);
      const button = this.button('', () => this.run(script ? 'script' : 'switch',
        script ? 'turn_on' : 'toggle', entityId), script ? undefined : state?.state === 'on', !available(state));
      button.className = `tile ${key}`;
      button.dataset.focusKey = key;
      button.setAttribute('aria-label', label);
      extras.append(this.tile(label, value, iconName, button));
    }
    if (extras.childElementCount) content.push(extras);
    if (this.error) {
      const error = element('div', 'error', this.error);
      error.setAttribute('role', 'status');
      content.push(error);
    }
    this.panel.replaceChildren(...content);
    if (focused) this.panel.querySelector(`[data-focus-key="${focused}"]`)?.focus({ preventScroll: true });
  }
}

if (!customElements.get(tag)) {
  customElements.define(tag, AirDeckCard);
  window.customCards ??= [];
  window.customCards.push({
    type: tag, name, preview: true,
    description: 'Adaptive air purifier controls, PM2.5 and filter status for Home Assistant.',
    documentationURL: 'https://github.com/szbence7/airdeck-air-purifier-card#readme',
  });
}
