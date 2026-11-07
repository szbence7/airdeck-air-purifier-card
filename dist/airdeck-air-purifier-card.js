const tag = 'airdeck-air-purifier-card';
const name = 'AirDeck Air Purifier Card';
const features = { speed: 1, preset: 8, off: 16, on: 32 };

const fields = [
  { key: 'entity', label: 'Air purifier', domain: 'fan', required: true },
  { key: 'show_power', label: 'Show power button' },
  { key: 'show_speed', label: 'Show speed controls' },
  { key: 'show_presets', label: 'Show operating modes' },
  { key: 'show_air_quality', label: 'Show air quality' },
  { key: 'pm25_entity', label: 'PM2.5 sensor', domain: 'sensor', toggle: 'show_air_quality' },
  { key: 'show_filter', label: 'Show filter status' },
  { key: 'filter_entity', label: 'Filter sensor', domain: 'sensor', toggle: 'show_filter' },
  { key: 'show_ioniser', label: 'Show ioniser control' },
  { key: 'ioniser_entity', label: 'Ioniser switch or script', domain: ['switch', 'script'], toggle: 'show_ioniser' },
  { key: 'show_uv', label: 'Show UV control' },
  { key: 'uv_entity', label: 'UV switch or script', domain: ['switch', 'script'], toggle: 'show_uv' },
];

const extraControls = [
  { key: 'ioniser', label: 'Ioniser', icon: 'mdi:creation' },
  { key: 'uv', label: 'UV sterilisation', icon: 'mdi:lightbulb-on-outline' },
];

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
        .panel { display:grid; gap:12px; padding:14px; }
        .header,.option,.slider { display:flex; align-items:center; gap:10px; }
        .header { min-width:0; }
        .title { flex:1; min-width:0; }
        .title strong,.title small,.metric strong,.metric small { display:block; overflow-wrap:anywhere; }
        .title strong { font-size:1rem; }
        small,.label { color:var(--secondary-text-color,#545c69); font-size:.82rem; }
        .badge { display:grid; place-items:center; width:42px; height:42px; flex:none; border-radius:50%;
          color:var(--success-color,#25866b); background:color-mix(in srgb,currentColor 15%,transparent); }
        button { min-height:38px; border:1px solid transparent; border-radius:12px; padding:5px 11px;
          font:inherit; font-size:.86rem; color:inherit; background:var(--secondary-background-color,#ecf1f4); cursor:pointer; }
        button:hover:not(:disabled) { border-color:var(--primary-color,#25866b); }
        button:focus-visible,input:focus-visible { outline:2px solid var(--primary-color,#25866b); outline-offset:2px; }
        button[aria-pressed="true"] { color:var(--success-color,#25866b);
          background:color-mix(in srgb,currentColor 16%,transparent); }
        button:disabled,input:disabled { opacity:.45; cursor:default; }
        .power { display:grid; place-items:center; min-width:44px; min-height:44px; }
        .group { display:grid; gap:5px; }
        .row { display:flex; flex-wrap:wrap; gap:6px; }
        .row button { flex:1 0 auto; }
        .slider input { flex:1; min-width:0; accent-color:var(--success-color,#25866b); }
        .metrics,.extras { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(120px,100%),1fr)); gap:7px; }
        .metric,.option { padding:9px 11px; border-radius:12px; background:var(--secondary-background-color,#ecf1f4); }
        .metric strong { font-variant-numeric:tabular-nums; }
        .option { justify-content:space-between; text-align:start; }
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

  section(label, children) {
    const group = element('div', 'group');
    const row = element('div', 'row');
    row.append(...children);
    group.append(element('span', 'label', label), row);
    return group;
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
    const filter = states[config.filter_entity];
    const ioniser = states[config.ioniser_entity];
    const uv = states[config.uv_entity];
    const snapshot = [fan, pm25, filter, ioniser, uv, locale];
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
    const badge = element('span', 'badge');
    badge.append(icon('mdi:air-purifier'));
    const title = element('div', 'title');
    title.append(element('strong', '', attrs.friendly_name ?? 'Air purifier'));
    const status = !fan ? 'Choose an air purifier in the card editor' : !usable ? 'Unavailable' : on ? 'On' : 'Off';
    const details = on && usable ? [attrs.preset_mode, Number.isFinite(attrs.percentage) ? `${attrs.percentage}%` : ''] : [];
    title.append(element('small', '', [status, ...details].filter(Boolean).join(' · ')));
    heading.append(badge, title);
    if (config.show_power !== false && (supported & (features.on | features.off))) {
      const power = this.button('', () => runFan(on ? 'turn_off' : 'turn_on'), on, !usable || !powerSupported);
      power.className = 'power';
      power.dataset.focusKey = 'power';
      power.setAttribute('aria-label', on ? 'Turn off air purifier' : 'Turn on air purifier');
      power.append(icon('mdi:power'));
      heading.append(power);
    }

    const content = [heading];
    if (config.show_speed !== false && supported & features.speed) {
      const { count, percentage } = speedSettings(attrs);
      const speed = attrs.percentage;
      if (count <= 5) {
        const buttons = Array.from({ length: count }, (_, index) => {
          const value = percentage(index + 1);
          const button = this.button(String(index + 1), () => runFan('set_percentage', { percentage: value }),
            on && !attrs.preset_mode && Math.abs(speed - value) <= 1, !usable);
          button.dataset.focusKey = `speed-${index}`;
          button.setAttribute('aria-label', `Speed ${index + 1}, ${value}%`);
          return button;
        });
        content.push(this.section('Speed', buttons));
      } else {
        const slider = element('div', 'slider');
        const range = element('input');
        range.type = 'range';
        range.min = '1';
        range.max = String(count);
        range.value = String(Math.max(1, Math.round((speed || 0) * count / 100)));
        range.disabled = !usable;
        range.dataset.focusKey = 'speed-slider';
        range.setAttribute('aria-label', 'Fan speed');
        const reading = element('small', '', `${speed || 0}%`);
        range.setAttribute('aria-valuetext', reading.textContent);
        range.addEventListener('input', () => {
          reading.textContent = `${percentage(Number(range.value))}%`;
          range.setAttribute('aria-valuetext', reading.textContent);
        });
        range.addEventListener('change', () => runFan('set_percentage', { percentage: percentage(Number(range.value)) }));
        slider.append(range, reading);
        content.push(this.section('Speed', [slider]));
      }
    }

    const presets = attrs.preset_modes;
    if (config.show_presets !== false && supported & features.preset && Array.isArray(presets) && presets.length) {
      const buttons = presets.map((preset, index) => {
        const label = preset.replaceAll('_', ' ').replace(/^./, first => first.toUpperCase());
        const button = this.button(label, () => runFan('set_preset_mode', { preset_mode: preset }),
          on && attrs.preset_mode === preset, !usable);
        button.dataset.focusKey = `preset-${index}`;
        return button;
      });
      content.push(this.section('Mode', buttons));
    }

    const metrics = element('div', 'metrics');
    for (const [key, label, state] of [['air_quality', 'PM2.5', pm25], ['filter', 'Filter', filter]]) {
      const entityId = key === 'air_quality' ? config.pm25_entity : config.filter_entity;
      if (config[`show_${key}`] === false || !entityId) continue;
      const value = available(state) ? this.homeAssistant.formatEntityState?.(state)
        ?? [state.state, state.attributes.unit_of_measurement].filter(Boolean).join(' ') : 'Unavailable';
      const metric = element('div', 'metric');
      metric.append(element('small', '', label), element('strong', '', value));
      if (key === 'air_quality' && this.pmBaseline !== undefined && Number.isFinite(pmReading)) {
        const change = new Intl.NumberFormat(locale?.language, { signDisplay: 'exceptZero', maximumFractionDigits: 1 })
          .format(pmReading - this.pmBaseline);
        const unit = state.attributes.unit_of_measurement;
        metric.append(element('small', '', `${[change, unit].filter(Boolean).join(' ')} this run`));
      }
      metrics.append(metric);
    }
    if (metrics.childElementCount) content.push(metrics);

    const extras = element('div', 'extras');
    for (const { key, label, icon: iconName } of extraControls) {
      const entityId = config[`${key}_entity`];
      if (!entityId || config[`show_${key}`] === false) continue;
      const state = states[entityId];
      const script = entityId.startsWith('script.');
      const button = this.button(label, () => this.run(script ? 'script' : 'switch',
        script ? 'turn_on' : 'toggle', entityId), script ? undefined : state?.state === 'on', !available(state));
      button.className = 'option';
      button.dataset.focusKey = key;
      button.prepend(icon(iconName));
      extras.append(button);
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
