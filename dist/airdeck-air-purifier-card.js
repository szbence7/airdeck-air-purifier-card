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
  const node = element('ha-icon');
  node.setAttribute('icon', name);
  node.setAttribute('aria-hidden', 'true');
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
        .title,.tile-copy { flex:1; min-width:0; }
        .title strong,.title small,.tile-copy strong,.tile-copy small { display:block; overflow-wrap:anywhere; }
        .title strong,.tile-copy strong { font-size:.92rem; font-weight:600; }
        small { color:var(--airdeck-muted); font-size:.81rem; }
        .badge,.tile-icon { display:grid; place-items:center; width:38px; height:38px; flex:none;
          border-radius:50%; color:var(--airdeck-muted);
          background:color-mix(in srgb,currentColor 14%,transparent); }
        .badge.running { color:#4caf50; }
        .badge.running ha-icon { animation:spin var(--airdeck-spin,1.6s) linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @media (prefers-reduced-motion:reduce) { .badge.running ha-icon { animation:none; } }
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
        .power[aria-pressed="true"] ha-icon { filter:drop-shadow(0 0 5px #f44336); }
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
        .ioniser[aria-pressed="true"] ha-icon,.uv[aria-pressed="true"] ha-icon {
          filter:drop-shadow(0 0 5px currentColor); }
        .error { color:var(--error-color,#b3261e); font-size:.85rem; }
      </style>
      <ha-card><div class="panel"></div></ha-card>`;
    this.panel = root.querySelector('.panel');
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
    const heading = element('div', 'header');
    const badge = element('span', on ? 'badge running' : 'badge');
    const mode = attrs.preset_mode?.toLowerCase();
    const speed = attrs.percentage;
    const speeds = speedSettings(attrs);
    const namedLevel = namedSpeeds.indexOf(mode) + 1;
    const level = namedLevel || (Number.isFinite(speed) && speed > 0 ? Math.max(1, Math.round(speed * speeds.count / 100)) : 0);
    const spin = mode === 'sleep' || mode === 'night' ? 3 : namedLevel === 3 || speed >= 90
      ? 0.7 : namedLevel === 2 || speed >= 60 ? 1.1 : 1.6;
    badge.style.setProperty('--airdeck-spin', `${spin}s`);
    badge.append(icon('mdi:fan'));
    const title = element('div', 'title');
    title.append(element('strong', '', attrs.friendly_name ?? 'Air Purifier'));
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
    title.append(element('small', '', details.join(' · ')));
    heading.append(badge, title);
    const content = [heading];
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
    const automatic = presets.filter(preset => ['auto', 'automatic', 'smart'].includes(preset.toLowerCase()));
    const other = presets.filter(preset => !manual.includes(preset) && !automatic.includes(preset));
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
      if (manual.length) {
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
