/* 全国市区町村 介護給付費準備基金マップ — ランキング連動型（救急搬送ダッシュボードのvariant c相当）
   救急搬送ダッシュボード（fire-dash / dash.js）を基に、介護給付費準備基金の分析用に作り直したもの。 */
(function () {
  const CSS = `
kaigo-dash{display:block;width:100%;height:100%;flex:1 1 auto;min-width:0}
.kd{--bg:oklch(0.985 0.004 90);--panel:#fff;--ink:oklch(0.22 0.01 250);--ink2:oklch(0.48 0.012 250);
 --line:oklch(0.9 0.006 250);--accent:oklch(0.5 0.13 250);--up:#006300;--down:#d03b3b;
 font-family:"Noto Sans JP","Hiragino Sans",sans-serif;color:var(--ink);background:var(--bg);
 width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;box-sizing:border-box}
.kd *{box-sizing:border-box}
.kd-hd{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding:16px 22px 14px;
 background:var(--panel);border-bottom:1px solid var(--line);flex:none}
.kd-ttl{font-size:19px;font-weight:700;letter-spacing:.01em;margin:0;line-height:1.3}
.kd-sub{font-size:11.5px;color:var(--ink2);margin-top:5px;display:flex;gap:10px;flex-wrap:wrap;white-space:normal}
.kd-sub b{font-weight:600;color:var(--ink)}
.kd-reset-btn{flex:none;font:inherit;font-size:12px;padding:8px 14px;border:1px solid var(--line);
 border-radius:7px;background:#fff;color:var(--ink2);cursor:pointer;white-space:nowrap}
.kd-reset-btn:hover{background:oklch(0.96 0.005 250);color:var(--ink)}
.kd-body{flex:1;min-height:0;display:flex}
.kd-rail{width:660px;flex:none;background:var(--panel);border-left:1px solid var(--line);
 display:flex;flex-direction:column;min-height:0;order:2}
.kd-map{flex:1;min-width:0;position:relative;background:oklch(0.93 0.005 250);order:1}
.kd-map .leaflet-container{width:100%;height:100%;background:oklch(0.955 0.004 250);font-family:inherit}
.kd-sec{padding:13px 18px;border-bottom:1px solid var(--line)}
.kd-sec:last-child{border-bottom:0}
.kd-lab{font-size:10.5px;letter-spacing:.09em;color:var(--ink2);font-weight:600;margin:0 0 9px;text-transform:uppercase}
.kd-src{padding:10px 18px;font-size:10.5px;color:var(--ink2);line-height:1.6;border-top:1px solid var(--line)}
.kd-search{width:100%;font:inherit;font-size:13px;padding:9px 11px;border:1px solid var(--line);border-radius:7px;
 background:oklch(0.98 0.003 250);color:var(--ink)}
.kd-search:focus{outline:2px solid var(--accent);outline-offset:-1px;background:#fff}
.kd-info{padding:13px 18px 15px;border-bottom:1px solid var(--line);min-height:240px;box-sizing:border-box}
.kd-info .p{font-size:11.5px;color:var(--ink2)}
.kd-info .n{font-size:14.5px;font-weight:700;line-height:1.35;margin:1px 0 10px}
.kd-big{display:flex;align-items:baseline;gap:7px}
.kd-big em{font-family:"IBM Plex Mono",ui-monospace,monospace;font-style:normal;font-size:32px;font-weight:600;
 letter-spacing:-.02em;line-height:1}
.kd-big span{font-size:12px;color:var(--ink2)}
.kd-meta{margin-top:11px;display:grid;grid-template-columns:1fr auto;gap:6px 12px;font-size:11.5px;color:var(--ink2);align-items:center}
.kd-meta b{font-family:"IBM Plex Mono",ui-monospace,monospace;font-weight:500;color:var(--ink);font-size:12px}
.kd-hint{font-size:11.5px;color:var(--ink2);line-height:1.6}
.kd-period-note{margin-top:10px;font-size:10px;padding-top:8px;border-top:1px dashed var(--line)}
.kd-stat-lab{margin-top:15px}
.kd-stat-pair{margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.kd-stat{background:oklch(0.965 0.005 250);border-radius:8px;padding:9px 11px;display:flex;flex-direction:column;gap:3px;min-width:0}
.kd-stat em{font-family:"IBM Plex Mono",ui-monospace,monospace;font-style:normal;font-size:17px;font-weight:600;
 letter-spacing:-.01em;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kd-stat .l{font-size:10px;color:var(--ink2);line-height:1.45}
.kd-badge{display:inline-block;font-size:10.5px;font-weight:600;padding:2px 8px;border-radius:999px;color:#fff;
 white-space:nowrap;line-height:1.5}
.kd-delta{font-family:"IBM Plex Mono",ui-monospace,monospace;font-weight:600}
.kd-delta.up{color:var(--up)}
.kd-delta.down{color:var(--down)}
.kd-trend{width:100%;display:block;overflow:visible}
.kd-trend text{fill:var(--ink2);font-family:"IBM Plex Mono",ui-monospace,monospace}
.kd-trend-hit{cursor:crosshair}
.kd-trend-tip{position:absolute;pointer-events:none;background:var(--ink);color:#fff;
 font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11px;line-height:1.6;
 padding:6px 9px;border-radius:6px;white-space:nowrap;z-index:5;box-shadow:0 4px 14px rgba(0,0,0,.18)}
.kd-trend-tip b{display:block;font-family:"Noto Sans JP",sans-serif;font-weight:600;font-size:10.5px;
 color:oklch(0.85 0.01 250);margin-bottom:1px}
.kd-scale{display:flex;margin-top:8px}
.kd-scale div{flex:1;height:8px}
.kd-scale-l{display:flex;justify-content:space-between;font-size:9px;color:var(--ink2);margin-top:5px;gap:4px}
.kd-list{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:0 16px 14px 8px}
.kd-thead{display:grid;grid-template-columns:26px 1fr 82px 130px 82px 76px 82px;gap:6px;align-items:center;
 padding:8px 8px 7px;position:sticky;top:0;background:var(--panel);z-index:2;border-bottom:1px solid var(--line)}
.kd-thead span{font-size:10px;color:var(--ink2);font-weight:600;letter-spacing:.02em;cursor:pointer;
 user-select:none;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kd-thead span:first-child,.kd-thead span:nth-child(2){text-align:left}
.kd-thead span.on{color:var(--ink)}
.kd-thead span .a{opacity:.35;margin-left:2px;font-size:9px}
.kd-thead span.on .a{opacity:1;color:var(--accent)}
.kd-row{display:grid;grid-template-columns:26px 1fr 82px 130px 82px 76px 82px;align-items:center;gap:6px;padding:7px 8px;
 border-radius:6px;cursor:pointer;font-size:12px}
.kd-row:hover,.kd-row[data-on="1"]{background:oklch(0.955 0.006 250)}
.kd-row .r{font-family:"IBM Plex Mono",monospace;font-size:10px;color:var(--ink2);text-align:right}
.kd-row .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px}
.kd-row .nm i{font-style:normal;color:var(--ink2);font-size:10px;margin-right:5px}
.kd-row .val{font-family:"IBM Plex Mono",monospace;font-size:11.5px;text-align:right;position:relative}
.kd-row .val .bar{position:absolute;left:0;right:0;bottom:-1px;height:3px;border-radius:2px;background:oklch(0.94 0.005 250);overflow:hidden}
.kd-row .val .bar i{display:block;height:100%;background:oklch(0.55 0.1 250)}
.kd-row .cl{font-size:10px;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kd-row .pc{font-family:"IBM Plex Mono",monospace;font-size:11px;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kd-row>span,.kd-thead>span{min-width:0}
/* --- mobile --- */
.kd[data-variant="m"]{--pad:15px}
.kd[data-variant="m"] .kd-hd{padding:11px var(--pad) 0;display:block}
.kd[data-variant="m"] .kd-ttl{font-size:15px;letter-spacing:0}
.kd[data-variant="m"] .kd-sub{font-size:10px;gap:9px;margin-top:3px}
.kd[data-variant="m"] .kd-reset-btn{display:none}
.kd[data-variant="m"] .kd-body{flex-direction:column;position:relative}
.kd[data-variant="m"] .kd-map{flex:1;min-height:0}
.kd-sheet{position:absolute;left:0;right:0;bottom:0;z-index:700;background:var(--panel);
 border-top:1px solid var(--line);border-radius:16px 16px 0 0;box-shadow:0 -8px 26px oklch(0.2 0.02 250 / .13);
 display:flex;flex-direction:column;height:190px;transition:height .28s cubic-bezier(.32,.72,0,1)}
.kd-sheet[data-open="1"]{height:74%}
.kd-grip{flex:none;padding:16px 0 14px;display:flex;justify-content:center;cursor:pointer;touch-action:none}
.kd-grip i{display:block;width:40px;height:4px;border-radius:2px;background:oklch(0.85 0.008 250)}
.kd-mhead{flex:none;padding:2px var(--pad) 11px;display:flex;align-items:flex-start;gap:12px}
.kd-mhead .txt{flex:1;min-width:0}
.kd-mhead .p{font-size:10.5px;color:var(--ink2);letter-spacing:.02em}
.kd-mhead .n{font-size:14px;font-weight:700;line-height:1.35;margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kd-mhead .num{flex:none;text-align:right;line-height:1}
.kd-mhead .num em{font-family:"IBM Plex Mono",monospace;font-style:normal;font-size:26px;font-weight:600;letter-spacing:-.02em}
.kd-mhead .num u{text-decoration:none;font-size:11px;color:var(--ink2);margin-left:3px}
.kd-mclose{flex:none;width:30px;height:30px;border-radius:50%;border:1px solid var(--line);background:#fff;
 font:inherit;font-size:14px;color:var(--ink2);cursor:pointer;line-height:1;padding:0}
.kd-mrank{padding:0 var(--pad) 11px;display:flex;gap:7px;flex-wrap:wrap;font-size:11px;color:var(--ink2)}
.kd-mrank span{background:oklch(0.96 0.005 250);border-radius:999px;padding:4px 10px}
.kd-mrank b{font-family:"IBM Plex Mono",monospace;font-weight:600;color:var(--ink)}
.kd-tabs{flex:none;display:flex;gap:20px;padding:0 var(--pad);border-bottom:1px solid var(--line)}
.kd-tabs button{appearance:none;border:0;background:none;font:inherit;font-size:12.5px;color:var(--ink2);
 padding:9px 0 8px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;min-height:38px}
.kd-tabs button[aria-selected="true"]{color:var(--ink);font-weight:600;border-bottom-color:var(--ink)}
.kd-pane{flex:1;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;display:none}
.kd-pane[data-on="1"]{display:block}
.kd-sheet:not([data-open="1"]) .kd-tabs,.kd-sheet:not([data-open="1"]) .kd-pane{display:none}
.kd-sheet:not([data-open="1"]) .kd-peek{display:block}
.kd-peek{display:none;padding:0 var(--pad) 14px}
.kd[data-variant="m"] .kd-thead{grid-template-columns:22px 1fr 58px 50px 50px;padding:8px var(--pad) 7px}
.kd[data-variant="m"] .kd-thead span:nth-child(4),.kd[data-variant="m"] .kd-thead span:nth-child(7){display:none}
.kd[data-variant="m"] .kd-row{grid-template-columns:22px 1fr 58px 50px 50px;padding:9px var(--pad);min-height:44px;font-size:13px}
.kd[data-variant="m"] .kd-row span:nth-child(4),.kd[data-variant="m"] .kd-row span:nth-child(7){display:none}
.kd[data-variant="m"] .kd-row .nm{font-size:13px}
.kd[data-variant="m"] .kd-search{font-size:16px;padding:11px 12px}
.kd[data-variant="m"] .leaflet-control-zoom{display:none}
`;
  if (!document.getElementById('kd-css')) {
    const s = document.createElement('style'); s.id = 'kd-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  const el = (t, cls, html) => { const e = document.createElement(t); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const fmt = (v, d) => (v == null || Number.isNaN(v)) ? '—' : v.toLocaleString('ja-JP', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmtPct = v => v == null ? '—' : (v > 0 ? '+' : '') + v.toLocaleString('ja-JP', { maximumFractionDigits: 1 }) + '%';

  const SEQ = ['#f7ece9', '#eabfb8', '#dd8f80', '#c85b48', '#a3281c'];
  const CLASS_COLOR = {
    '一貫して増加': '#c98500',
    '山形': '#c2547a',
    '谷型': '#199e70',
    '増減のくり返し（増加傾向）': '#2a78d6',
    '増減のくり返し（減少傾向）': '#c85a28',
    '一貫して減少': '#2f8f2f',
    'その他': '#8a8880'
  };
  const VALUE_KEY = '2024年度末残高';
  const CLASS_KEY = '分類';
  const P58_KEY = '第5期8期増減率';
  const P1024_KEY = '2010_2024増減率';
  const PREM9_KEY = '第9期保険料基準額';
  const CHG_KEY = '2010_2024増減額';
  const SERIES_KEY = '残高推移';

  function stats(feats, key) {
    const vals = [];
    feats.forEach(f => { const v = f.properties[key]; if (typeof v === 'number') vals.push(v); });
    vals.sort((a, b) => a - b);
    const out = { vals };
    out.min = vals[0]; out.max = vals[vals.length - 1];
    out.mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    out.median = vals[Math.floor(vals.length / 2)];
    out.q = p => vals[Math.min(vals.length - 1, Math.floor(p * (vals.length - 1)))];
    out.rank = v => vals.length - vals.filter(x => x <= v).length + 1;
    return out;
  }
  function makeScale(st) {
    const b = [0.2, 0.4, 0.6, 0.8].map(p => st.q(p));
    return { breaks: b, colors: SEQ };
  }
  const colorOf = (v, sc) => {
    if (typeof v !== 'number') return '#e4e4e2';
    let i = 0; while (i < sc.breaks.length && v > sc.breaks[i]) i++;
    return sc.colors[i];
  };

  class KaigoDash extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      const _attrVariant = this.getAttribute('variant');
      this.variant = _attrVariant ? _attrVariant.toLowerCase()
        : window.innerWidth <= 600 ? 'm' : 'c';
      if (!_attrVariant) {
        window.matchMedia('(max-width:600px)').addEventListener('change', () => location.reload());
      }
      this.sortKey = 'val'; this.sortDir = 'desc';
      this.selected = null;
      const wait = () => {
        if (window.L && window.KAIGO_GEO) this.build();
        else setTimeout(wait, 60);
      };
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(es => {
          if (es.some(e => e.isIntersecting)) { io.disconnect(); setTimeout(wait, 30); }
        }, { rootMargin: '120px' });
        io.observe(this);
        setTimeout(() => { if (!this.root) { io.disconnect(); wait(); } }, 1500);
      } else wait();
    }

    build() {
      const v = this.variant;
      this.feats = window.KAIGO_GEO.features;
      this.national = window.KAIGO_NATIONAL_TOTAL;
      this.root = el('div', 'kd'); this.root.dataset.variant = v;
      this.appendChild(this.root);

      const hd = el('div', 'kd-hd');
      const left = el('div');
      left.appendChild(el('h1', 'kd-ttl', '全国市区町村別　介護給付費準備基金マップ'));
      left.appendChild(el('div', 'kd-sub',
        '<b>2024年度末残高</b><span>全国 ' + this.feats.length + ' 保険者（2010〜2024年度）</span>' +
        '<span>出典：総務省・厚生労働省「介護保険事業状況報告」表15h</span>' +
        '<span>元データの「-」はデータの欠損扱いとした</span>'));
      hd.appendChild(left);
      const resetBtn = el('button', 'kd-reset-btn', '↺ 初期表示に戻す');
      resetBtn.type = 'button';
      resetBtn.onclick = () => this.resetView();
      hd.appendChild(resetBtn);
      this.root.appendChild(hd);

      const body = el('div', 'kd-body'); this.root.appendChild(body);
      this.mapWrap = el('div', 'kd-map');

      if (v === 'm') {
        this.mobile = true;
        body.appendChild(this.mapWrap);
        body.appendChild(this.buildSheet());
      } else {
        const rail = el('div', 'kd-rail');
        rail.appendChild(this.trendBox());
        rail.appendChild(this.infoBox());
        rail.appendChild(this.searchBox());
        rail.appendChild(this.listBox());
        rail.appendChild(el('div', 'kd-src',
          '2024年度末残高は千円単位の原値を億円に換算。第5期→8期は2012〜14年度平均から2021〜23年度平均への変化率、増減額は2010年度末から2024年度末の残高差（億円）。分類は15年間の増減方向の完全な単調判定による7区分。9期保険料は第9期（2024〜26年度）の65歳以上・月額保険料基準額。全国合計は原資料の「全国」欄の値で、広域連合・一部事務組合分を含むため、自治体別データの合計とは一致しない。'));
        body.appendChild(this.mapWrap); body.appendChild(rail);
      }

      this.st = stats(this.feats, VALUE_KEY);
      this.scale = makeScale(this.st);
      this.initMap();
      this.refresh();
    }

    /* ---------- pieces ---------- */
    searchBox() {
      const wrap = el('div', 'kd-sec');
      wrap.appendChild(el('p', 'kd-lab', '自治体を検索'));
      const i = el('input', 'kd-search');
      i.placeholder = '市区町村名・都道府県で絞り込み';
      i.oninput = () => { this.query = i.value.trim(); this.renderList(); };
      this.searchInput = i;
      wrap.appendChild(i);
      return wrap;
    }
    infoBox() { this.info = el('div', 'kd-info'); return this.info; }
    trendBox() {
      const wrap = el('div', 'kd-sec');
      this.trendLabel = el('p', 'kd-lab', '全国合計残高の推移（2010〜2024年度）');
      wrap.appendChild(this.trendLabel);
      this.trend = el('div'); wrap.appendChild(this.trend);
      return wrap;
    }
    listHead() {
      const cols = [
        ['rank', '順位', false], ['name', '自治体', false],
        ['val', '2024残高', true], ['cls', '分類', true],
        ['p58', '5→8期', true], ['chg', '増減額', true],
        ['prem9', '9期保険料', true]
      ];
      const head = el('div', 'kd-thead');
      cols.forEach(([key, label, sortable]) => {
        const s = el('span', null, label + (sortable ? '<i class="a">↕</i>' : ''));
        if (sortable) {
          s.style.cursor = 'pointer';
          s.onclick = () => {
            if (this.sortKey === key) this.sortDir = this.sortDir === 'desc' ? 'asc' : 'desc';
            else { this.sortKey = key; this.sortDir = 'desc'; }
            head.querySelectorAll('span').forEach(x => { x.classList.remove('on'); const a = x.querySelector('.a'); if (a) a.textContent = '↕'; });
            s.classList.add('on'); const a = s.querySelector('.a'); if (a) a.textContent = this.sortDir === 'desc' ? '↓' : '↑';
            this.renderList();
          };
        }
        head.appendChild(s);
      });
      head.children[2].classList.add('on'); head.children[2].querySelector('.a').textContent = '↓';
      this.head = head;
      return head;
    }
    listBox() {
      this.list = el('div', 'kd-list');
      if (!this.head) this.listHead();
      this.list.appendChild(this.head);
      this.rows = el('div');
      this.list.appendChild(this.rows);
      return this.list;
    }

    /* ---------- map ---------- */
    initMap() {
      const map = L.map(this.mapWrap, {
        preferCanvas: true, zoomControl: false, attributionControl: true,
        zoomSnap: 0.25, minZoom: 3, maxZoom: 11
      });
      this.map = map;
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
        maxZoom: 18, opacity: 1,
        attribution: '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a> / 境界データ: <a href="https://github.com/smartnews-smri/japan-topography" target="_blank">SmartNews Media Research Institute</a>'
      }).addTo(map);
      this.layer = L.geoJson(window.KAIGO_GEO, {
        style: f => this.styleOf(f),
        onEachFeature: (f, l) => {
          f.__l = l;
          l.on({
            mouseover: () => { if (!this.selected) this.showInfo(f); this.hover(l, true); },
            mouseout: () => { if (!this.selected) this.showInfo(null); this.hover(l, false); },
            click: () => { this._hit = Date.now(); this.select(f); }
          });
        }
      }).addTo(map);
      const fit = () => {
        map.invalidateSize();
        const pad = this.mobile ? (this.sheet && this.sheet.dataset.open === '1' ? 0 : this.sheet ? this.sheet.offsetHeight : 190) : 0;
        map.fitBounds(this.layer.getBounds(), { paddingTopLeft: [10, 10], paddingBottomRight: [10, 10 + pad], maxZoom: 6, animate: false });
        map.setZoom(map.getZoom() + 1, { animate: false });
        // nudge the initial view slightly east
        map.panBy([map.getSize().x * 0.06, 0], { animate: false });
      };
      this._fit = fit;
      fit(); setTimeout(fit, 120); setTimeout(fit, 500);
      map.on('click', () => { if (Date.now() - (this._hit || 0) > 500) this.select(null); });
    }
    styleOf(f) {
      return {
        fillColor: colorOf(f.properties[VALUE_KEY], this.scale),
        weight: this.selected === f ? 2.2 : 0.4,
        color: this.selected === f ? '#111' : '#ffffff',
        opacity: 1, fillOpacity: 0.88
      };
    }
    hover(l, on) {
      if (this.selected === l.feature) return;
      if (on) { l.setStyle({ weight: 1.8, color: '#1a1a1a' }); l.bringToFront(); }
      else this.layer.resetStyle(l);
    }
    select(f) {
      const prev = this.selected;
      this.selected = f;
      if (prev && prev.__l) this.layer.resetStyle(prev.__l);
      if (f && f.__l) { f.__l.setStyle(this.styleOf(f)); f.__l.bringToFront(); }
      this.showInfo(f);
      this.renderList();
      this.renderTrend();
    }
    focus(f) {
      this._hit = Date.now();
      this.select(f);
      const b = f.__l.getBounds();
      if (this.mobile) {
        // the sheet is about to open to ~74% of the screen height, so keep the
        // selected municipality within the strip that stays visible above it
        const sheetPx = Math.round(this.map.getSize().y * 0.74);
        this.map.flyToBounds(b, { paddingTopLeft: [30, 30], paddingBottomRight: [30, sheetPx + 24], maxZoom: 9, duration: .6 });
        if (this.trendTab) this.trendTab.b.click();
        this.toggleSheet(true);
        this.renderTrend();
      } else {
        this.map.flyToBounds(b, { padding: [80, 80], maxZoom: 9, duration: .6 });
      }
    }
    resetView() {
      this.query = '';
      if (this.searchInput) this.searchInput.value = '';
      this.sortKey = 'val'; this.sortDir = 'desc';
      if (this.head) {
        this.head.querySelectorAll('span').forEach(x => { x.classList.remove('on'); const a = x.querySelector('.a'); if (a) a.textContent = '↕'; });
        const valSpan = this.head.children[2];
        valSpan.classList.add('on');
        const a = valSpan.querySelector('.a'); if (a) a.textContent = '↓';
      }
      this.select(null);
      if (this._fit) { this._fit(); setTimeout(this._fit, 120); setTimeout(this._fit, 400); }
    }

    /* ---------- mobile sheet ---------- */
    buildSheet() {
      const sheet = el('div', 'kd-sheet'); this.sheet = sheet;
      const grip = el('div', 'kd-grip', '<i></i>');
      let _startY = null, _startH = null, _dragging = false;
      const CLOSED_H = 190, MIN_H = 84, MAX_H_RATIO = 0.78;

      grip.addEventListener('pointerdown', e => {
        _startY = e.clientY; _startH = this.sheet.offsetHeight; _dragging = false;
        grip.setPointerCapture(e.pointerId);
        this.sheet.style.transition = 'none';
      });
      grip.addEventListener('pointermove', e => {
        if (_startY === null) return;
        const dy = _startY - e.clientY;
        if (Math.abs(dy) > 4) _dragging = true;
        if (!_dragging) return;
        const maxH = window.innerHeight * MAX_H_RATIO;
        this.sheet.style.height = Math.max(MIN_H, Math.min(maxH, _startH + dy)) + 'px';
      });
      grip.addEventListener('pointerup', e => {
        if (_startY === null) return;
        this.sheet.style.transition = '';
        const dy = _startY - e.clientY;
        _startY = null;
        if (!_dragging) { this.toggleSheet(); }
        else {
          const cur = this.sheet.offsetHeight;
          this.toggleSheet(cur > CLOSED_H * 1.1 || dy > 40);
        }
        _dragging = false;
      });
      sheet.appendChild(grip);

      this.info = el('div', 'kd-mhead');
      sheet.appendChild(this.info);
      this.mrank = el('div', 'kd-mrank');
      sheet.appendChild(this.mrank);

      const peek = el('div', 'kd-peek'); this.peek = peek; sheet.appendChild(peek);

      const tabs = el('div', 'kd-tabs');
      const panes = [];
      const mk = (label, node) => {
        const b = el('button', null, label);
        const pane = el('div', 'kd-pane'); pane.appendChild(node);
        b.onclick = () => {
          tabs.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', x === b ? 'true' : 'false'));
          panes.forEach(p => p.dataset.on = p === pane ? '1' : '0');
          const host = node.dataset && node.dataset.wantsList;
          if (host && this.list) { node.appendChild(this.list); }
        };
        tabs.appendChild(b); panes.push(pane);
        return { b, pane };
      };
      const rankWrap = el('div'); rankWrap.dataset.wantsList = '1';
      rankWrap.appendChild(this.listBox());
      const distWrap = el('div'); distWrap.style.padding = '14px 15px 20px';
      distWrap.appendChild(this.trendBoxInner());
      const searchWrap = el('div'); searchWrap.style.padding = '14px 15px 0'; searchWrap.dataset.wantsList = '1';
      searchWrap.appendChild(this.searchBox());
      const first = mk('ランキング', rankWrap);
      this.trendTab = mk('全国推移', distWrap);
      const sw = mk('検索', searchWrap);
      sw.b.onclick = ((orig) => () => { orig(); const i = searchWrap.querySelector('input'); if (i) setTimeout(() => i.focus(), 60); })(sw.b.onclick);
      sheet.appendChild(tabs);
      panes.forEach(p => sheet.appendChild(p));
      first.b.setAttribute('aria-selected', 'true'); panes[0].dataset.on = '1';
      return sheet;
    }
    trendBoxInner() {
      const frag = document.createDocumentFragment();
      this.trendLabel = el('p', 'kd-lab', '全国合計残高の推移（2010〜2024年度）');
      this.trend = el('div');
      frag.appendChild(this.trendLabel);
      frag.appendChild(this.trend);
      return frag;
    }
    toggleSheet(force, opts) {
      const open = force != null ? force : this.sheet.dataset.open !== '1';
      const skipFit = opts && opts.skipFit;
      this.sheet.dataset.open = open ? '1' : '0';
      setTimeout(() => { if (this.map) { this.map.invalidateSize(); if (!open && !skipFit && this._fit) this._fit(); } }, 320);
    }
    renderPeek() {
      if (!this.peek) return;
      const sc = this.scale, st = this.st;
      this.peek.innerHTML =
        '<div class="kd-scale">' + sc.colors.map(c => '<div style="background:' + c + '"></div>').join('') + '</div>' +
        '<div class="kd-scale-l"><span>少ない　' + fmt(st.min, 1) + '億円</span><span>' +
        fmt(st.max, 1) + '億円　多い</span></div>' +
        '<div class="kd-hint" style="margin-top:10px">地図をタップして自治体を選択。上のつまみでランキング・全国推移・検索を開きます。</div>';
    }

    /* ---------- state ---------- */
    refresh() {
      this.layer.setStyle(f => this.styleOf(f));
      if (this.selected && this.selected.__l) this.selected.__l.setStyle(this.styleOf(this.selected));
      this.showInfo(this.selected);
      this.renderTrend();
      this.renderPeek();
      this.renderList();
    }

    classBadge(cls) {
      if (!cls) return '';
      const c = CLASS_COLOR[cls] || '#8a8880';
      const label = cls.startsWith('増減のくり返し') ? cls.replace('増減のくり返し（', '').replace('）', '') : cls;
      return '<span class="kd-badge" style="background:' + c + '">' + label + '</span>';
    }
    deltaSpan(v) {
      if (v == null) return '<span class="kd-delta">—</span>';
      return '<span class="kd-delta ' + (v >= 0 ? 'up' : 'down') + '">' + fmtPct(v) + '</span>';
    }
    deltaAmountSpan(v) {
      if (v == null) return '<span class="kd-delta">—</span>';
      const sign = v > 0 ? '+' : '';
      return '<span class="kd-delta ' + (v >= 0 ? 'up' : 'down') + '">' + sign + fmt(v, 1) + '</span>';
    }
    classCounts() {
      if (this._classCounts) return this._classCounts;
      const c = { up: 0, valley: 0, mountain: 0, other: 0 };
      this.feats.forEach(f => {
        const cls = f.properties[CLASS_KEY];
        if (cls === '一貫して増加' || cls === '増減のくり返し（増加傾向）') c.up++;
        else if (cls === '谷型') c.valley++;
        else if (cls === '山形') c.mountain++;
        else c.other++;
      });
      this._classCounts = c;
      return c;
    }

    showInfo(f) {
      if (this.mobile) return this.showInfoM(f);
      const st = this.st;
      if (!f) {
        const c = this.classCounts();
        const totalOku = this.national.total_oku[this.national.total_oku.length - 1];
        this.info.innerHTML =
          '<div class="p">全国 ' + this.feats.length + ' 保険者</div>' +
          '<p class="kd-lab kd-stat-lab" style="margin-top:2px">2024年度末の残高</p>' +
          '<div class="kd-stat-pair">' +
          '<div class="kd-stat"><em>' + fmt(totalOku, 1) + '</em><div class="l">全国合計（億円）</div></div>' +
          '<div class="kd-stat"><em>' + fmt(st.median, 1) + '</em><div class="l">中央値（億円）</div></div>' +
          '</div>' +
          '<p class="kd-lab kd-stat-lab">15年間の全国的な傾向</p>' +
          '<div class="kd-stat-pair">' +
          '<div class="kd-stat"><em>' + c.up.toLocaleString('ja-JP') + ' / ' + this.feats.length.toLocaleString('ja-JP') + '</em><div class="l">増加傾向の自治体</div></div>' +
          '<div class="kd-stat"><em>第5期→第8期</em><div class="l">2012〜14→2021〜23年度</div></div>' +
          '</div>';
        this.markVal = null; return;
      }
      const p = f.properties, v = p[VALUE_KEY];
      this.info.innerHTML =
        '<div class="p">' + p['都道府県'] + '</div>' +
        '<div class="n">' + p['市区町村'] + '</div>' +
        '<div class="kd-big"><em>' + fmt(v, 1) + '</em><span>億円</span></div>' +
        '<div class="kd-meta">' +
        '<span>順位（多い順）</span><b>' + (typeof v === 'number' ? st.rank(v) : '—') + ' / ' + st.vals.length + '</b>' +
        '<span>分類</span>' + this.classBadge(p[CLASS_KEY]) +
        '<span>第5期→8期 増減率</span>' + this.deltaSpan(p[P58_KEY]) +
        '<span>2010→2024 増減率</span>' + this.deltaSpan(p[P1024_KEY]) +
        '</div>' +
        '<div class="kd-hint kd-period-note">第5期は2012〜14年度、第8期は2021〜23年度の平均残高</div>';
      this.markVal = v;
    }
    showInfoM(f) {
      const st = this.st;
      if (!f) {
        this.info.innerHTML =
          '<div class="txt"><div class="p">全国 ' + this.feats.length + ' 保険者</div>' +
          '<div class="n">中央値（2024年度末）</div></div>' +
          '<div class="num"><em>' + fmt(st.median, 1) + '</em><u>億円</u></div>';
        const totalOku = this.national.total_oku[this.national.total_oku.length - 1];
        this.mrank.innerHTML = '<span>全国合計 <b>' + fmt(totalOku, 1) + '</b> 億円</span>' +
          '<span>最小 <b>' + fmt(st.min, 1) + '</b> 億円</span>' +
          '<span>最大 <b>' + fmt(st.max, 1) + '</b> 億円</span>';
        this.markVal = null; return;
      }
      const p = f.properties, v = p[VALUE_KEY];
      this.info.innerHTML =
        '<div class="txt"><div class="p">' + p['都道府県'] + '</div>' +
        '<div class="n">' + p['市区町村'] + '</div></div>' +
        '<div class="num"><em>' + fmt(v, 1) + '</em><u>億円</u></div>' +
        '<button class="kd-mclose" aria-label="選択を解除">×</button>';
      this.info.querySelector('.kd-mclose').onclick = e => { e.stopPropagation(); this.select(null); };
      this.mrank.innerHTML =
        '<span>順位 <b>' + (typeof v === 'number' ? st.rank(v) : '—') + '</b> / ' + st.vals.length + '</span>' +
        '<span>' + this.classBadge(p[CLASS_KEY]) + '</span>' +
        '<span>5→8期 ' + this.deltaSpan(p[P58_KEY]) + '</span>' +
        '<span>10→24 ' + this.deltaSpan(p[P1024_KEY]) + '</span>';
      this.markVal = v;
    }

    renderTrend() {
      if (!this.trend) return;
      const sel = this.selected;
      const years = this.national.years;
      const vals = sel ? sel.properties[SERIES_KEY] : this.national.total_oku;
      const color = sel ? '#a3281c' : '#4a6a94';
      if (this.trendLabel) {
        this.trendLabel.textContent = sel
          ? (sel.properties['都道府県'] + ' ' + sel.properties['市区町村'] + 'の残高推移（2010〜2024年度）')
          : '全国合計残高の推移（2010〜2024年度）';
      }

      const validIdx = [];
      vals.forEach((v, i) => { if (v != null) validIdx.push(i); });
      if (!validIdx.length) {
        this.trend.innerHTML = '<div class="kd-hint">データがありません。</div>';
        return;
      }
      const firstI = validIdx[0], lastI = validIdx[validIdx.length - 1];
      const presentVals = validIdx.map(i => vals[i]);

      const H = this.mobile ? 150 : 128;
      const W = Math.max(240, this.trend.clientWidth || (this.mobile ? 340 : 500));
      const padL = 46, padR = 8, padT = 10, padB = 18;
      const plotW = W - padL - padR, plotH = H - padT - padB;
      const lo = 0, hiRaw = Math.max(...presentVals) * 1.08, span0 = hiRaw - lo || 1;

      const niceStep = rough => {
        const mag = Math.pow(10, Math.floor(Math.log10(rough)));
        const norm = rough / mag;
        const step = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
        return step * mag;
      };
      const step = niceStep(span0 / 4);
      const hi = Math.ceil(hiRaw / step) * step;
      const span = hi - lo || 1;

      const px = i => padL + (i / (years.length - 1)) * plotW;
      const py = v => padT + plotH - ((v - lo) / span) * plotH;
      const baseY = padT + plotH;

      // split into contiguous segments so gaps in the data (mergers etc.) don't draw a false line
      const segments = [];
      let cur = [];
      vals.forEach((v, i) => {
        if (v == null) { if (cur.length) { segments.push(cur); cur = []; } }
        else cur.push(i);
      });
      if (cur.length) segments.push(cur);

      let lines = '', areas = '';
      segments.forEach(seg => {
        let d = 'M' + px(seg[0]).toFixed(1) + ',' + py(vals[seg[0]]).toFixed(1);
        seg.forEach((i, k) => { if (k) d += ' L' + px(i).toFixed(1) + ',' + py(vals[i]).toFixed(1); });
        lines += '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.4"/>';
        areas += '<path d="' + d + ' L' + px(seg[seg.length - 1]).toFixed(1) + ',' + baseY + ' L' + px(seg[0]).toFixed(1) + ',' + baseY + ' Z" fill="' + color + '" opacity="0.14"/>';
      });

      let grid = '';
      for (let g = 0; g <= hi + 0.001; g += step) {
        const gy = py(g);
        grid += '<line x1="' + padL + '" x2="' + (W - padR) + '" y1="' + gy.toFixed(1) + '" y2="' + gy.toFixed(1) + '" stroke="oklch(0.9 0.006 250)" stroke-width="1"/>';
        grid += '<text x="' + (padL - 8) + '" y="' + (gy + 3).toFixed(1) + '" text-anchor="end" font-size="9">' + fmt(g, 0) + '</text>';
      }

      let labels = '';
      years.forEach((yr, i) => {
        if (i % 3 === 0 || i === years.length - 1) {
          labels += '<text x="' + px(i).toFixed(1) + '" y="' + (H - 3) + '" text-anchor="middle" font-size="9">' + yr + '</text>';
        }
      });
      const lastX = px(lastI), lastY = py(vals[lastI]);

      this.trend.innerHTML =
        '<div style="position:relative">' +
        '<svg class="kd-trend" viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:' + H + 'px">' +
        grid +
        areas +
        lines +
        '<circle cx="' + lastX.toFixed(2) + '" cy="' + lastY.toFixed(2) + '" r="2.6" fill="' + color + '"/>' +
        labels +
        '<g class="kd-trend-hover" style="display:none">' +
        '<line class="kd-trend-cross" y1="' + padT + '" y2="' + baseY + '" stroke="oklch(0.6 0.01 250)" stroke-width="1" stroke-dasharray="2,2"/>' +
        '<circle class="kd-trend-dot" r="3.4" fill="' + color + '" stroke="#fff" stroke-width="1.2"/>' +
        '</g>' +
        '<rect class="kd-trend-hit" x="' + padL + '" y="' + padT + '" width="' + plotW + '" height="' + plotH + '" fill="transparent"/>' +
        '</svg>' +
        '<div class="kd-trend-tip" style="display:none"></div>' +
        '</div>' +
        '<div class="kd-hint" style="margin-top:2px">' + years[firstI] + '年度 ' + fmt(vals[firstI], 1) + '億円 → ' + years[lastI] + '年度 ' + fmt(vals[lastI], 1) + '億円</div>';

      const svg = this.trend.querySelector('.kd-trend');
      const hit = this.trend.querySelector('.kd-trend-hit');
      const hoverG = this.trend.querySelector('.kd-trend-hover');
      const cross = this.trend.querySelector('.kd-trend-cross');
      const dot = this.trend.querySelector('.kd-trend-dot');
      const tip = this.trend.querySelector('.kd-trend-tip');
      const wrap = this.trend.querySelector('div');

      const onMove = clientX => {
        const rect = svg.getBoundingClientRect();
        const scale = W / rect.width;
        const localX = (clientX - rect.left) * scale;
        let idx = Math.round(((localX - padL) / plotW) * (years.length - 1));
        idx = Math.max(0, Math.min(years.length - 1, idx));
        if (vals[idx] == null) { hoverG.style.display = 'none'; tip.style.display = 'none'; return; }
        const x = px(idx), y = py(vals[idx]);
        hoverG.style.display = '';
        cross.setAttribute('x1', x); cross.setAttribute('x2', x);
        dot.setAttribute('cx', x); dot.setAttribute('cy', y);
        tip.style.display = '';
        tip.innerHTML = '<b>' + years[idx] + '年度</b>' + fmt(vals[idx], 1) + '億円';
        const tipW = 108, wrapRect = wrap.getBoundingClientRect();
        let left = (x / W) * wrapRect.width - tipW / 2;
        left = Math.max(0, Math.min(wrapRect.width - tipW, left));
        tip.style.left = left + 'px';
        tip.style.top = Math.max(0, (y / H) * (this.mobile ? 150 : 128) - 40) + 'px';
      };
      hit.addEventListener('mousemove', e => onMove(e.clientX));
      hit.addEventListener('mouseleave', () => { hoverG.style.display = 'none'; tip.style.display = 'none'; });
      hit.addEventListener('touchmove', e => { if (e.touches[0]) { onMove(e.touches[0].clientX); e.preventDefault(); } }, { passive: false });
      hit.addEventListener('touchend', () => { hoverG.style.display = 'none'; tip.style.display = 'none'; });
    }

    renderList() {
      if (!this.list) return;
      const st = this.st, q = (this.query || '');
      let rows = this.feats.slice();
      if (q) rows = rows.filter(f => (f.properties['市区町村'] + f.properties['都道府県']).includes(q));
      const keyMap = { val: VALUE_KEY, cls: CLASS_KEY, p58: P58_KEY, p1024: P1024_KEY, chg: CHG_KEY, prem9: PREM9_KEY };
      if (['p58', 'p1024', 'chg', 'prem9'].includes(this.sortKey)) {
        const key = keyMap[this.sortKey];
        rows = rows.filter(f => f.properties[key] != null);
      }
      if (this.sortKey === 'name') {
        rows.sort((a, b) => this.sortDir === 'asc'
          ? (a.properties['都道府県'] + a.properties['市区町村']).localeCompare(b.properties['都道府県'] + b.properties['市区町村'], 'ja')
          : (b.properties['都道府県'] + b.properties['市区町村']).localeCompare(a.properties['都道府県'] + a.properties['市区町村'], 'ja'));
      } else {
        const key = keyMap[this.sortKey] || VALUE_KEY;
        rows.sort((a, b) => {
          let av = a.properties[key], bv = b.properties[key];
          if (typeof av === 'string' || typeof bv === 'string') {
            av = av || ''; bv = bv || '';
            return this.sortDir === 'desc' ? bv.localeCompare(av, 'ja') : av.localeCompare(bv, 'ja');
          }
          av = (av == null) ? -Infinity : av; bv = (bv == null) ? -Infinity : bv;
          return this.sortDir === 'desc' ? bv - av : av - bv;
        });
      }
      const lim = q ? Math.min(rows.length, 60) : rows.length;
      this.rows.innerHTML = '';
      if (!rows.length) { this.rows.appendChild(el('div', 'kd-hint', '該当する自治体がありません。')).style.padding = '10px 8px'; return; }
      const barMax = st.max || 1;
      rows.slice(0, lim).forEach((f) => {
        const p = f.properties, v = p[VALUE_KEY];
        const r = el('div', 'kd-row');
        if (this.selected === f) r.dataset.on = '1';
        const rank = (typeof v === 'number') ? st.rank(v) : '—';
        const barPct = (typeof v === 'number') ? Math.max(2, (v / barMax) * 100) : 0;
        r.innerHTML =
          '<span class="r">' + rank + '</span>' +
          '<span class="nm"><i>' + p['都道府県'] + '</i>' + p['市区町村'] + '</span>' +
          '<span class="val">' + fmt(v, 1) + '<span class="bar"><i style="width:' + barPct.toFixed(1) + '%"></i></span></span>' +
          '<span class="cl">' + this.classBadge(p[CLASS_KEY]) + '</span>' +
          '<span class="pc">' + this.deltaSpan(p[P58_KEY]) + '</span>' +
          '<span class="pc">' + this.deltaAmountSpan(p[CHG_KEY]) + '</span>' +
          '<span class="pc">' + (p[PREM9_KEY] != null ? fmt(p[PREM9_KEY], 0) + '円' : '—') + '</span>';
        r.onmouseenter = () => { if (!this.selected) this.showInfo(f); if (f.__l) this.hover(f.__l, true); };
        r.onmouseleave = () => { if (!this.selected) this.showInfo(null); if (f.__l) this.hover(f.__l, false); };
        r.onclick = () => this.focus(f);
        this.rows.appendChild(r);
      });
      if (!q && rows.length > 400) {
        // full list is kept scrollable; no truncation message needed since all rows render
      }
    }
  }
  if (!window.customElements.get('kaigo-dash')) window.customElements.define('kaigo-dash', KaigoDash);
})();
