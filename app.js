// ── HELPERS ──────────────────────────────────────────────────────────────────

function fmt(n) {
  if (n == null) return '?';
  return n.toLocaleString();
}

function getBadge(key) {
  const o = OBTAINABILITY[key];
  if (!o) return '';
  const note = o.canSpeedUp ? ' <span class="speed-up-note">(spending can speed this up)</span>' : '';
  return `<span class="badge badge-${key}">${o.emoji} ${o.label}</span>${note}`;
}

function getBadgeSmall(key) {
  const o = OBTAINABILITY[key];
  if (!o) return '';
  return `<span class="badge badge-${key}">${o.emoji} ${o.label}</span>`;
}

function enhToNum(str) {
  return parseInt(str.replace('+', ''));
}

// ── STATE ─────────────────────────────────────────────────────────────────────

const state = {
  hqLevel: 1,
  novaLevel: 0,
  talentI: 0, talentII: 0, talentIII: 0,
  researchI: 0, researchII: 0, researchIII: 0, researchIV: 0,
  heroes: { eve: '+0', otto: '+0', varvara: '+0', ladym: '+0', scarlett: '+0', ironclaw: '+0', leah: '+0', beepboop: '+0' },
  heroOwned: { eve: false, otto: false, varvara: false, ladym: false, scarlett: false, ironclaw: false, leah: false, beepboop: false },
  nano: { deathbass: 'None', tesla: 'None', deathclaw: 'None', ocular: 'None', powerdrill: 'None' },
  mechaLevel: 0,
  subscription: false
};

// ── MARCH CALCULATIONS ────────────────────────────────────────────────────────

function calcHQ() {
  if (state.hqLevel < 1) return 0;
  const entry = PNS_DATA.hq.levels.find(l => l.level === state.hqLevel);
  return entry ? entry.march : 0;
}

function calcNova() {
  if (state.novaLevel < 1) return 0;
  const entry = PNS_DATA.nova.levels.find(l => l.level === state.novaLevel);
  return entry ? entry.march : 0;
}

function calcTalent() {
  const tiers = PNS_DATA.commanderTalent.tiers;
  let total = 0;
  const vals = [state.talentI, state.talentII, state.talentIII];
  vals.forEach((v, i) => {
    if (v > 0) {
      const entry = tiers[i].levels.find(l => l.level === v);
      if (entry) total += entry.march;
    }
  });
  return total;
}

function calcResearch() {
  const tiers = PNS_DATA.research.tiers;
  let total = 0;
  const vals = [state.researchI, state.researchII, state.researchIII, state.researchIV];
  vals.forEach((v, i) => {
    if (v > 0) {
      const entry = tiers[i].levels.find(l => l.level === v);
      if (entry) total += entry.march;
    }
  });
  return total;
}

function calcHeroes() {
  let total = 0;
  PNS_DATA.heroes.list.forEach(hero => {
    if (!state.heroOwned[hero.id]) return;
    const enh = state.heroes[hero.id];
    const entry = hero.enhancements.find(e => e.level === enh);
    if (entry) total += entry.march;
  });
  return total;
}

function getNanoHeroEnh(heroId) {
  if (!state.heroOwned[heroId]) return -1;
  return enhToNum(state.heroes[heroId]);
}

function getNanoRow(weapon) {
  const heroId = weapon.pairedHero;
  const heroEnh = getNanoHeroEnh(heroId);
  const tier = state.nano[weapon.id];
  if (tier === 'None') return null;

  let enhRange;
  if (heroEnh < 0) enhRange = '0-3'; // hero not owned, treat as unenhanced for reference
  else if (heroEnh <= 3) enhRange = '0-3';
  else if (heroEnh <= 5) enhRange = '4-5';
  else enhRange = '6-8';

  // Apex requires hero +6 minimum
  if (tier === 'Apex' && heroEnh < 6) return { march: 0, blocked: true, heroEnh };

  return weapon.tiers.find(t => t.tier === tier && t.heroEnh === enhRange) || null;
}

function calcNano() {
  let total = 0;
  PNS_DATA.nanoweapons.list.forEach(weapon => {
    if (state.nano[weapon.id] === 'None') return;
    const row = getNanoRow(weapon);
    if (row && !row.blocked) total += row.march;
  });
  return total;
}

function calcMecha() {
  if (state.mechaLevel < 1) return 0;
  const entry = PNS_DATA.mecha.levels.find(l => l.level === state.mechaLevel);
  return (entry && entry.march != null) ? entry.march : 0;
}

function calcTotal() {
  return calcHQ() + calcNova() + calcTalent() + calcResearch() + calcHeroes() + calcNano() + calcMecha() + (state.subscription ? 3000 : 0);
}

function calcMax() {
  // Max everything
  const maxHQ = PNS_DATA.hq.levels[PNS_DATA.hq.levels.length - 1].march;
  const maxNova = PNS_DATA.nova.levels[PNS_DATA.nova.levels.length - 1].march;
  const maxTalent = 15000;
  const maxResearch = 40000;
  let maxHeroes = 0;
  PNS_DATA.heroes.list.forEach(h => {
    const last = h.enhancements[h.enhancements.length - 1];
    maxHeroes += last.march;
  });
  // Max nano: apex 6-8 row
  let maxNano = 0;
  PNS_DATA.nanoweapons.list.forEach(w => {
    const row = w.tiers.find(t => t.tier === 'Apex' && t.heroEnh === '6-8');
    if (row) maxNano += row.march;
  });
  const maxMecha = 1500;
  const maxSub = 3000;
  return maxHQ + maxNova + maxTalent + maxResearch + maxHeroes + maxNano + maxMecha + maxSub;
}

// ── UPGRADE SUGGESTIONS ───────────────────────────────────────────────────────

function getUpgrades() {
  const upgrades = [];

  // HQ
  const hqIdx = PNS_DATA.hq.levels.findIndex(l => l.level === state.hqLevel);
  if (hqIdx < PNS_DATA.hq.levels.length - 1) {
    const next = PNS_DATA.hq.levels[hqIdx + 1];
    const curr = PNS_DATA.hq.levels[hqIdx];
    upgrades.push({ gain: next.march - curr.march, name: `HQ → Level ${next.level}`, obtain: 'easy', key: 'hq' });
  }

  // Nova
  const novaIdx = state.novaLevel === 0 ? -1 : PNS_DATA.nova.levels.findIndex(l => l.level === state.novaLevel);
  if (novaIdx < PNS_DATA.nova.levels.length - 1) {
    const next = PNS_DATA.nova.levels[novaIdx + 1];
    const curr = novaIdx >= 0 ? PNS_DATA.nova.levels[novaIdx] : { march: 0 };
    upgrades.push({ gain: next.march - curr.march, name: `Nova → Level ${next.level}`, obtain: 'grind', key: 'nova' });
  }

  // Talents
  const tKeys = ['talentI','talentII','talentIII'];
  const tNames = ['March Cap I','March Cap II','March Cap III'];
  tKeys.forEach((k, i) => {
    const curr = state[k];
    if (curr < 5) {
      const nextLv = curr + 1;
      const tier = PNS_DATA.commanderTalent.tiers[i];
      const currEntry = curr === 0 ? { march: 0 } : tier.levels.find(l => l.level === curr);
      const nextEntry = tier.levels.find(l => l.level === nextLv);
      upgrades.push({ gain: nextEntry.march - currEntry.march, name: `Talent ${tNames[i]} → Lv ${nextLv}`, obtain: 'easy', key: k });
    }
  });

  // Research
  const rKeys = ['researchI','researchII','researchIII','researchIV'];
  const rNames = ['Troop Size I','Troop Size II','Troop Size III','Troop Size IV'];
  rKeys.forEach((k, i) => {
    const curr = state[k];
    if (curr < 5) {
      const nextLv = curr + 1;
      const tier = PNS_DATA.research.tiers[i];
      const currEntry = curr === 0 ? { march: 0 } : tier.levels.find(l => l.level === curr);
      const nextEntry = tier.levels.find(l => l.level === nextLv);
      upgrades.push({ gain: nextEntry.march - currEntry.march, name: `Research ${rNames[i]} → Lv ${nextLv}`, obtain: 'grind', key: k });
    }
  });

  // Heroes
  PNS_DATA.heroes.list.forEach(hero => {
    if (!state.heroOwned[hero.id]) {
      const first = hero.enhancements[0];
      upgrades.push({ gain: first.march, name: `Unlock ${hero.name}`, obtain: hero.obtainability, key: `hero_${hero.id}` });
    } else {
      const currEnh = state.heroes[hero.id];
      const currIdx = hero.enhancements.findIndex(e => e.level === currEnh);
      if (currIdx < hero.enhancements.length - 1) {
        const next = hero.enhancements[currIdx + 1];
        const curr = hero.enhancements[currIdx];
        upgrades.push({ gain: next.march - curr.march, name: `${hero.name} ${currEnh} → ${next.level}`, obtain: hero.obtainability, key: `hero_${hero.id}` });
      }
    }
  });

  // Nanoweapons
  const tierOrder = ['None','Common','Uncommon','Rare','Epic','Apex'];
  PNS_DATA.nanoweapons.list.forEach(weapon => {
    const currTier = state.nano[weapon.id];
    const currIdx = tierOrder.indexOf(currTier);
    if (currIdx < tierOrder.length - 1) {
      const nextTier = tierOrder[currIdx + 1];
      const heroEnh = getNanoHeroEnh(weapon.pairedHero);
      let enhRange = heroEnh < 0 ? '0-3' : heroEnh <= 3 ? '0-3' : heroEnh <= 5 ? '4-5' : '6-8';
      const currRow = currTier === 'None' ? { march: 0 } : weapon.tiers.find(t => t.tier === currTier && t.heroEnh === enhRange) || { march: 0 };
      const nextRow = weapon.tiers.find(t => t.tier === nextTier && t.heroEnh === enhRange) || { march: 0 };
      const gain = Math.max(0, nextRow.march - currRow.march);
      upgrades.push({ gain, name: `${weapon.name} → ${nextTier}`, obtain: weapon.obtainability, key: `nano_${weapon.id}` });
    }
  });

  // Mecha
  const mechaIdx = state.mechaLevel === 0 ? -1 : PNS_DATA.mecha.levels.findIndex(l => l.level === state.mechaLevel);
  if (mechaIdx < PNS_DATA.mecha.levels.length - 1) {
    const next = PNS_DATA.mecha.levels[mechaIdx + 1];
    upgrades.push({
      gain: next.march != null ? next.march - (mechaIdx >= 0 ? PNS_DATA.mecha.levels[mechaIdx].march || 0 : 0) : null,
      name: `Mecha Skill → Level ${next.level}${!next.confirmed ? ' (est.)' : ''}`,
      obtain: 'grind',
      key: 'mecha',
      unknown: next.march == null
    });
  }

  // Subscription
  if (!state.subscription) {
    upgrades.push({ gain: 3000, name: 'Privilege Card (Subscription)', obtain: 'pay_only', key: 'sub' });
  }

  upgrades.sort((a, b) => {
    if (a.gain == null) return 1;
    if (b.gain == null) return -1;
    return b.gain - a.gain;
  });

  return upgrades.slice(0, 10);
}

// ── RENDER ────────────────────────────────────────────────────────────────────

function renderOverview() {
  const container = document.getElementById('overview-content');

  const maxHQ = PNS_DATA.hq.levels[PNS_DATA.hq.levels.length - 1].march;
  const maxNova = PNS_DATA.nova.levels[PNS_DATA.nova.levels.length - 1].march;

  container.innerHTML = `
    <div class="grid-2" style="margin-bottom:24px;">
      ${sourceCard('Headquarters', 'easy', `Base march size unlocked as you upgrade your HQ. Scales from 2,000 at HQ1 to 220,000 at HQ45.`, maxHQ)}
      ${sourceCard('Nova Military Skills', 'grind', `March size bonuses from Nova\'s military skill tree. Maxes at Level 30 for a total of 30,000 troops.`, maxNova)}
      ${sourceCard('Commander Talent (March Cap)', 'easy', `Three March Cap tiers in the Commander Talent tree, each with 5 levels. Max 5,000 per tier, 15,000 total.`, 15000)}
      ${sourceCard('Research (Troop Size)', 'grind', `Four Troop Size research nodes in the Military tree. Each node goes to level 5 for 10,000. Max 40,000 total.`, 40000)}
    </div>

    <div class="section-header">Heroes</div>
    <div class="grid-3" style="margin-bottom:24px;">
      ${PNS_DATA.heroes.list.map(hero => {
        const maxEnh = hero.enhancements[hero.enhancements.length - 1];
        const nano = PNS_DATA.nanoweapons.list.find(n => n.pairedHero === hero.id);
        return `
          <div class="source-card">
            <div class="source-card-header">
              <div>
                <div class="source-name">${hero.name} ${'⭐'.repeat(hero.stars)}</div>
                ${nano ? `<span class="pair-chip">🔗 ${nano.name}</span>` : ''}
              </div>
              <div class="source-max">+${fmt(maxEnh.march)}</div>
            </div>
            <div style="margin-bottom:8px;">${getBadge(hero.obtainability)}</div>
            <div class="source-desc">Enhancement range: ${hero.enhancements[0].march.toLocaleString()} (+0) → ${maxEnh.march.toLocaleString()} (${maxEnh.level})</div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="section-header">Nanoweapons — paired hero's enhancement level determines bonus tier</div>
    <div style="background:rgba(244,197,66,0.06);border:1px solid rgba(244,197,66,0.15);border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:var(--yellow);">
      ⚠️ <strong>Apex tier</strong> requires the paired hero to be at minimum <strong>+6 enhancement</strong>. If your hero is below +6, you get no Apex bonus even if the weapon is crafted.
    </div>
    <div class="grid-2" style="margin-bottom:24px;">
      ${PNS_DATA.nanoweapons.list.map(weapon => {
        const pairedHero = PNS_DATA.heroes.list.find(h => h.id === weapon.pairedHero);
        const apexRow = weapon.tiers.find(t => t.tier === 'Apex' && t.heroEnh === '6-8');
        return `
          <div class="source-card">
            <div class="source-card-header">
              <div>
                <div class="source-name">${weapon.name}</div>
                <div style="font-size:12px;color:var(--text-muted);">Paired with ${pairedHero ? pairedHero.name : '?'}</div>
              </div>
              <div class="source-max">+${apexRow ? fmt(apexRow.march) : '?'}</div>
            </div>
            <div style="margin-bottom:8px;">${getBadge(weapon.obtainability)}</div>
            <div class="source-desc">Tiers: Common → Uncommon → Rare → Epic → Apex. Bonus scales with paired hero's enhancement level (+0–3, +4–5, +6–8).</div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="grid-2">
      <div class="source-card">
        <div class="source-card-header">
          <div class="source-name">Mecha Skills</div>
          <div class="source-max">~1,500</div>
        </div>
        <div style="margin-bottom:8px;">${getBadge('grind')}</div>
        <div class="source-desc">Super Mecha troop size skill. Requires HQ 35+. Upgrades from Level 1 (100 troops) to Level 19 (~1,500 troops). Some mid-range values are still being confirmed by the community.</div>
      </div>
      <div class="source-card">
        <div class="source-card-header">
          <div class="source-name">Privilege Card</div>
          <div class="source-max">+3,000</div>
        </div>
        <div style="margin-bottom:8px;">${getBadge('pay_only')}</div>
        <div class="source-desc">Active subscription grants a permanent +3,000 march size bonus while the card is active.</div>
      </div>
    </div>

    <div class="card" style="margin-top:24px;text-align:center;">
      <div style="font-family:var(--font-display);font-size:13px;letter-spacing:1px;text-transform:uppercase;color:var(--text-muted);margin-bottom:6px;">Theoretical Maximum March Size</div>
      <div style="font-family:var(--font-display);font-size:40px;font-weight:700;color:var(--accent);">${fmt(calcMax())}</div>
      <div style="font-size:12px;color:var(--text-dim);margin-top:4px;">(HQ45 + all sources maxed, includes estimated Mecha max)</div>
    </div>
  `;
}

function sourceCard(name, obtain, desc, max) {
  return `
    <div class="source-card">
      <div class="source-card-header">
        <div class="source-name">${name}</div>
        <div class="source-max">+${fmt(max)}</div>
      </div>
      <div style="margin-bottom:8px;">${getBadge(obtain)}</div>
      <div class="source-desc">${desc}</div>
    </div>
  `;
}

function renderCalculator() {
  const container = document.getElementById('calc-content');

  const hqOptions = PNS_DATA.hq.levels.map(l => `<option value="${l.level}" ${state.hqLevel===l.level?'selected':''}>Level ${l.level} (+${fmt(l.march)})</option>`).join('');
  const novaOptions = `<option value="0">Not started</option>` + PNS_DATA.nova.levels.map(l => `<option value="${l.level}" ${state.novaLevel===l.level?'selected':''}>Level ${l.level} (+${fmt(l.march)})</option>`).join('');
  const talentOpts = (tier) => `<option value="0" ${state[tier]===0?'selected':''}>Not unlocked</option>` + [1,2,3,4,5].map(l => `<option value="${l}" ${state[tier]===l?'selected':''}>Level ${l}</option>`).join('');
  const researchOpts = (tier) => `<option value="0" ${state[tier]===0?'selected':''}>Not researched</option>` + [1,2,3,4,5].map(l => `<option value="${l}" ${state[tier]===l?'selected':''}>Level ${l}</option>`).join('');
  const mechOpts = `<option value="0">Not unlocked</option>` + PNS_DATA.mecha.levels.map(l => `<option value="${l.level}" ${state.mechaLevel===l.level?'selected':''}>${l.confirmed ? '✓' : '~'} Level ${l.level}${l.march!=null?' (+'+fmt(l.march)+')':' (unknown)'}</option>`).join('');
  const tierOpts = ['None','Common','Uncommon','Rare','Epic','Apex'];

  container.innerHTML = `
    <div class="calc-layout">
      <div class="calc-inputs">

        <div class="calc-subsection">
          <div class="calc-subsection-header">
            <span class="calc-subsection-title">🏰 Headquarters</span>
            <span class="calc-subsection-total">${fmt(calcHQ())}</span>
          </div>
          <div class="calc-subsection-body">
            <div class="calc-row">
              <div class="calc-row-label">HQ Level</div>
              <div class="calc-row-right">
                <select onchange="state.hqLevel=parseInt(this.value);refresh()">${hqOptions}</select>
              </div>
            </div>
          </div>
        </div>

        <div class="calc-subsection">
          <div class="calc-subsection-header">
            <span class="calc-subsection-title">🤖 Nova Military Skills</span>
            <span class="calc-subsection-total">${fmt(calcNova())}</span>
          </div>
          <div class="calc-subsection-body">
            <div class="calc-row">
              <div class="calc-row-label">Troop Size Skill Level<small>Nova military skill tree</small></div>
              <div class="calc-row-right">
                <select onchange="state.novaLevel=parseInt(this.value);refresh()">${novaOptions}</select>
              </div>
            </div>
          </div>
        </div>

        <div class="calc-subsection">
          <div class="calc-subsection-header">
            <span class="calc-subsection-title">🎯 Commander Talents</span>
            <span class="calc-subsection-total">${fmt(calcTalent())}</span>
          </div>
          <div class="calc-subsection-body">
            ${['talentI','talentII','talentIII'].map((k,i) => `
              <div class="calc-row">
                <div class="calc-row-label">March Cap ${['I','II','III'][i]}</div>
                <div class="calc-row-right">
                  <select onchange="state.${k}=parseInt(this.value);refresh()">${talentOpts(k)}</select>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="calc-subsection">
          <div class="calc-subsection-header">
            <span class="calc-subsection-title">🔬 Research</span>
            <span class="calc-subsection-total">${fmt(calcResearch())}</span>
          </div>
          <div class="calc-subsection-body">
            ${['researchI','researchII','researchIII','researchIV'].map((k,i) => `
              <div class="calc-row">
                <div class="calc-row-label">Troop Size ${['I','II','III','IV'][i]}</div>
                <div class="calc-row-right">
                  <select onchange="state.${k}=parseInt(this.value);refresh()">${researchOpts(k)}</select>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="calc-subsection">
          <div class="calc-subsection-header">
            <span class="calc-subsection-title">🦸 Heroes</span>
            <span class="calc-subsection-total">${fmt(calcHeroes())}</span>
          </div>
          <div class="calc-subsection-body">
            ${PNS_DATA.heroes.list.map(hero => {
              const nano = PNS_DATA.nanoweapons.list.find(n => n.pairedHero === hero.id);
              const owned = state.heroOwned[hero.id];
              const currMarch = owned ? (hero.enhancements.find(e => e.level === state.heroes[hero.id])?.march || 0) : 0;
              const enhOpts = `<option value="none" ${!owned?'selected':''}>Not owned</option>` +
                hero.enhancements.map(e => `<option value="${e.level}" ${owned && state.heroes[hero.id]===e.level?'selected':''}>${e.level} (+${fmt(e.march)})</option>`).join('');
              return `
                <div class="calc-row" style="flex-wrap:wrap;gap:8px;">
                  <div class="calc-row-label">
                    ${hero.name} ${'⭐'.repeat(hero.stars)}
                    ${nano ? `<span class="pair-chip">🔗 ${nano.name}</span>` : ''}
                    <small>${getBadgeSmall(hero.obtainability)}</small>
                  </div>
                  <div class="calc-row-right">
                    <div class="calc-row-march ${currMarch===0?'zero':''}">${owned?'+'+fmt(currMarch):'—'}</div>
                    <select onchange="
                      if(this.value==='none'){state.heroOwned['${hero.id}']=false;state.heroes['${hero.id}']='+0';}
                      else{state.heroOwned['${hero.id}']=true;state.heroes['${hero.id}']=this.value;}
                      refresh()
                    ">${enhOpts}</select>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="calc-subsection">
          <div class="calc-subsection-header">
            <span class="calc-subsection-title">⚡ Nanoweapons</span>
            <span class="calc-subsection-total">${fmt(calcNano())}</span>
          </div>
          <div class="calc-subsection-body">
            <div class="nano-warning" style="margin-bottom:12px;">⚠️ Apex bonus requires paired hero at +6 or higher. Nano bonuses scale with your hero's enhancement level.</div>
            ${PNS_DATA.nanoweapons.list.map(weapon => {
              const pairedHero = PNS_DATA.heroes.list.find(h => h.id === weapon.pairedHero);
              const heroEnh = getNanoHeroEnh(weapon.pairedHero);
              const row = getNanoRow(weapon);
              const currMarch = row && !row.blocked ? row.march : 0;
              const blocked = row && row.blocked;
              const nOpts = tierOpts.map(t => `<option value="${t}" ${state.nano[weapon.id]===t?'selected':''}>${t}</option>`).join('');
              return `
                <div class="calc-row" style="flex-wrap:wrap;gap:8px;">
                  <div class="calc-row-label">
                    ${weapon.name}
                    <small style="color:var(--text-muted);">Paired: ${pairedHero?.name || '?'} (${state.heroOwned[weapon.pairedHero] ? 'Hero @ '+state.heroes[weapon.pairedHero] : 'Hero not owned'})</small>
                    ${blocked ? `<small class="nano-warning" style="display:block;margin-top:4px;">Hero needs +6 for Apex bonus!</small>` : ''}
                  </div>
                  <div class="calc-row-right">
                    <div class="calc-row-march ${currMarch===0?'zero':''}">${state.nano[weapon.id]!=='None'?'+'+fmt(currMarch):'—'}</div>
                    <select onchange="state.nano['${weapon.id}']=this.value;refresh()">${nOpts}</select>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="calc-subsection">
          <div class="calc-subsection-header">
            <span class="calc-subsection-title">🦾 Mecha Skills</span>
            <span class="calc-subsection-total">${fmt(calcMecha())}</span>
          </div>
          <div class="calc-subsection-body">
            <div class="calc-row">
              <div class="calc-row-label">Troop Size Skill Level<small>Requires HQ 35+ — ✓ confirmed / ~ estimated</small></div>
              <div class="calc-row-right">
                <select onchange="state.mechaLevel=parseInt(this.value);refresh()">${mechOpts}</select>
              </div>
            </div>
            <div class="community-box">
              <p>📊 Some Mecha values are still unknown. If you know a level we're missing, submit it here!</p>
              <input type="number" id="mecha-submit-level" placeholder="Level (2–15 or 18)" min="2" max="18">
              <input type="number" id="mecha-submit-value" placeholder="Troop size value">
              <button class="btn btn-blue" onclick="submitMechaValue()">Submit Value</button>
            </div>
          </div>
        </div>

        <div class="calc-subsection">
          <div class="calc-subsection-header">
            <span class="calc-subsection-title">💳 Other</span>
            <span class="calc-subsection-total">${state.subscription?'3,000':'0'}</span>
          </div>
          <div class="calc-subsection-body">
            <div class="calc-row">
              <div class="calc-row-label">Privilege Card (Subscription)<small>${getBadgeSmall('pay_only')} Active subscription grants +3,000</small></div>
              <div class="calc-row-right">
                <select onchange="state.subscription=this.value==='yes';refresh()">
                  <option value="no" ${!state.subscription?'selected':''}>Inactive</option>
                  <option value="yes" ${state.subscription?'selected':''}>Active (+3,000)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div id="results-panel"></div>
    </div>
  `;

  renderResults();
}

function renderResults() {
  const panel = document.getElementById('results-panel');
  if (!panel) return;
  const total = calcTotal();
  const max = calcMax();
  const pct = Math.min(100, Math.round((total / max) * 100));
  const upgrades = getUpgrades();

  panel.innerHTML = `
    <div class="results-panel">
      <div class="total-march">
        <div class="total-label">Your March Size</div>
        <div class="total-value">${fmt(total)}</div>
        <div class="total-max">of ${fmt(max)} max (${pct}%)</div>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
        <div class="card-sm" style="text-align:center;">
          <div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim);margin-bottom:3px;">Missing</div>
          <div style="font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--red);">-${fmt(max-total)}</div>
        </div>
        <div class="card-sm" style="text-align:center;">
          <div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--text-dim);margin-bottom:3px;">Complete</div>
          <div style="font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--green);">${pct}%</div>
        </div>
      </div>

      <div class="upgrades-title">Top upgrades by march gained</div>
      ${upgrades.map(u => `
        <div class="upgrade-item">
          <div class="upgrade-gain">${u.gain != null ? '+'+fmt(u.gain) : '+?'}</div>
          <div class="upgrade-info">
            <div class="upgrade-name">${u.name}</div>
            <div class="upgrade-sub">${getBadgeSmall(u.obtain)}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function submitMechaValue() {
  const lvl = parseInt(document.getElementById('mecha-submit-level').value);
  const val = parseInt(document.getElementById('mecha-submit-value').value);
  if (!lvl || !val || lvl < 2 || lvl > 18) {
    alert('Please enter a valid level (2–18) and value.');
    return;
  }
  const entry = PNS_DATA.mecha.levels.find(l => l.level === lvl);
  if (entry) {
    entry.march = val;
    entry.confirmed = false; // community submitted, not verified
    alert(`Thanks! Level ${lvl} = ${val.toLocaleString()} added. The community will verify this value.`);
    refresh();
  }
}

// ── NAVIGATION ────────────────────────────────────────────────────────────────

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelector(`[data-page="${id}"]`).classList.add('active');
  if (id === 'page-overview') renderOverview();
  if (id === 'page-calc') renderCalculator();
}

function refresh() {
  const active = document.querySelector('.page.active');
  if (!active) return;
  if (active.id === 'page-overview') renderOverview();
  if (active.id === 'page-calc') {
    renderCalculator();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showPage('page-overview');
});
