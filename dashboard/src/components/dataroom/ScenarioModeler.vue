<script setup>
import { ref, computed } from 'vue'

const open  = ref(false)
const cash  = ref(5000000)
const burn  = ref(400000)
const cac   = ref(8000)
const ltv   = ref(60000)
const price = ref(5000)
const cogs  = ref(2000)

const fmt = v =>
  v >= 1_000_000 ? `${(v/1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `${(v/1_000).toFixed(0)}K`
  : String(v)

const runway = computed(() => burn.value > 0 ? Math.round(cash.value / burn.value) : 99)
const ratio  = computed(() => cac.value  > 0 ? Math.round(ltv.value / cac.value * 10) / 10 : 0)
const margin = computed(() => price.value > 0 ? Math.round((price.value - cogs.value) / price.value * 100) : 0)

const rwColor  = computed(() => runway.value < 3 ? '#c11633' : runway.value < 6 ? '#c49000' : '#1a5c3a')
const ratColor = computed(() => ratio.value  < 1 ? '#c11633' : ratio.value  < 3 ? '#c49000' : '#1a5c3a')
const mgColor  = computed(() => margin.value < 20 ? '#c11633' : margin.value < 50 ? '#c49000' : '#1a5c3a')

function pct(val, min, max) { return Math.min(100, Math.max(0, (val - min) / (max - min) * 100)) }
function resPct(val, target) { return Math.min(100, Math.round(val / target * 100)) }
</script>

<template>
  <div style="border-radius:16px;border:1px solid rgba(23,58,112,.13);overflow:hidden;margin-bottom:16px;background:#eef2fa">

    <!-- Header -->
    <div
      style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;cursor:pointer;background:#eef2fa"
      :style="open ? 'border-bottom:1px solid rgba(23,58,112,.13)' : ''"
      @click="open = !open"
    >
      <div style="display:flex;align-items:center;gap:10px">
        <!-- Calc icon -->
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a6090" stroke-width="2">
          <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/>
          <line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/>
          <line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/>
          <line x1="8" y1="18" x2="10" y2="18"/><line x1="14" y1="18" x2="16" y2="18"/>
        </svg>
        <div>
          <div style="font-size:13px;font-weight:600;color:#1a3260">Scenario Modeler</div>
          <div style="font-size:11px;color:#8090b0">Slide or type your numbers — all values in RWF</div>
        </div>
      </div>
      <div style="font-size:11px;font-weight:600;color:#1a3260;background:rgba(23,58,112,.07);padding:4px 10px;border-radius:6px;user-select:none">
        {{ open ? '▲ Collapse' : '▼ Expand' }}
      </div>
    </div>

    <!-- Body -->
    <div v-if="open" style="padding:18px;background:#eef2fa">

      <!-- Row 1: Runway + Unit Economics -->
      <div class="grid2" style="gap:14px;margin-bottom:14px">

        <!-- Runway card -->
        <div style="background:#fff;border-radius:12px;border:1px solid rgba(23,58,112,.13);padding:16px">
          <div style="font-size:9px;font-weight:700;color:#8090b0;letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px">Runway</div>

          <div style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
              <span style="font-size:11px;font-weight:500;color:#4a6090">Cash on Hand (RWF)</span>
              <input class="num-inp" type="text" inputmode="numeric" :value="cash"
                @change="cash = Math.min(50_000_000, Math.max(0, Number($event.target.value.replace(/[^0-9]/g,'')) || 0))" />
            </div>
            <input type="range" min="0" max="50000000" step="500000" :value="cash" @input="cash = Number($event.target.value)"
              :style="{ background: `linear-gradient(to right,#1e4d94 ${pct(cash,0,50000000)}%,rgba(23,58,112,.12) ${pct(cash,0,50000000)}%)` }" />
            <div style="display:flex;justify-content:space-between;font-size:9px;color:#8090b0;margin-top:2px"><span>0</span><span>50M</span></div>
          </div>

          <div style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
              <span style="font-size:11px;font-weight:500;color:#4a6090">Monthly Burn (RWF)</span>
              <input class="num-inp" type="text" inputmode="numeric" :value="burn"
                @change="burn = Math.min(5_000_000, Math.max(0, Number($event.target.value.replace(/[^0-9]/g,'')) || 0))" />
            </div>
            <input type="range" min="50000" max="5000000" step="50000" :value="burn" @input="burn = Number($event.target.value)"
              :style="{ background: `linear-gradient(to right,#c11633 ${pct(burn,50000,5000000)}%,rgba(23,58,112,.12) ${pct(burn,50000,5000000)}%)` }" />
            <div style="display:flex;justify-content:space-between;font-size:9px;color:#8090b0;margin-top:2px"><span>50K</span><span>5M</span></div>
          </div>

          <!-- Result -->
          <div :style="{ borderLeft: `3px solid ${rwColor}`, background:'rgba(23,58,112,.05)', borderRadius:'0 8px 8px 0', padding:'10px 14px', marginTop:12 }">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
              <span style="font-size:11px;font-weight:600;color:#4a6090">Months of Runway</span>
              <span :style="{ fontSize:'22px', fontWeight:700, fontFamily:`'DM Mono',monospace`, color: rwColor }">{{ runway }}<span style="font-size:13px">mo</span></span>
            </div>
            <div style="height:5px;background:rgba(23,58,112,.1);border-radius:4px;overflow:hidden">
              <div :style="{ width: resPct(runway,24) + '%', height:'100%', borderRadius:'4px', background: rwColor, transition:'width .4s' }"></div>
            </div>
          </div>
        </div>

        <!-- Unit Economics card -->
        <div style="background:#fff;border-radius:12px;border:1px solid rgba(23,58,112,.13);padding:16px">
          <div style="font-size:9px;font-weight:700;color:#8090b0;letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px">Unit Economics</div>

          <div style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
              <span style="font-size:11px;font-weight:500;color:#4a6090">CAC — Cost per Customer</span>
              <input class="num-inp" type="text" inputmode="numeric" :value="cac"
                @change="cac = Math.min(100_000, Math.max(500, Number($event.target.value.replace(/[^0-9]/g,'')) || 500))" />
            </div>
            <input type="range" min="500" max="100000" step="500" :value="cac" @input="cac = Number($event.target.value)"
              :style="{ background: `linear-gradient(to right,#1e4d94 ${pct(cac,500,100000)}%,rgba(23,58,112,.12) ${pct(cac,500,100000)}%)` }" />
            <div style="display:flex;justify-content:space-between;font-size:9px;color:#8090b0;margin-top:2px"><span>500</span><span>100K</span></div>
          </div>

          <div style="margin-bottom:14px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
              <span style="font-size:11px;font-weight:500;color:#4a6090">LTV — Lifetime Value</span>
              <input class="num-inp" type="text" inputmode="numeric" :value="ltv"
                @change="ltv = Math.min(500_000, Math.max(1000, Number($event.target.value.replace(/[^0-9]/g,'')) || 1000))" />
            </div>
            <input type="range" min="1000" max="500000" step="1000" :value="ltv" @input="ltv = Number($event.target.value)"
              :style="{ background: `linear-gradient(to right,#1a5c3a ${pct(ltv,1000,500000)}%,rgba(23,58,112,.12) ${pct(ltv,1000,500000)}%)` }" />
            <div style="display:flex;justify-content:space-between;font-size:9px;color:#8090b0;margin-top:2px"><span>1K</span><span>500K</span></div>
          </div>

          <!-- Result -->
          <div :style="{ borderLeft: `3px solid ${ratColor}`, background:'rgba(23,58,112,.05)', borderRadius:'0 8px 8px 0', padding:'10px 14px', marginTop:12 }">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
              <span style="font-size:11px;font-weight:600;color:#4a6090">LTV to CAC Ratio</span>
              <span :style="{ fontSize:'22px', fontWeight:700, fontFamily:`'DM Mono',monospace`, color: ratColor }">{{ ratio }}<span style="font-size:13px">:1</span></span>
            </div>
            <div style="position:relative;height:5px;background:rgba(23,58,112,.1);border-radius:4px;overflow:hidden">
              <div :style="{ width: resPct(ratio,10) + '%', height:'100%', borderRadius:'4px', background: ratColor, transition:'width .4s' }"></div>
            </div>
            <div style="font-size:9px;color:#8090b0;margin-top:4px;text-align:right">3:1 healthy</div>
          </div>
        </div>
      </div>

      <!-- Row 2: Gross Margin (full width) -->
      <div style="background:#fff;border-radius:12px;border:1px solid rgba(23,58,112,.13);padding:16px">
        <div style="font-size:9px;font-weight:700;color:#8090b0;letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px">Gross Margin</div>
        <div class="grid2" style="gap:14px">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
              <span style="font-size:11px;font-weight:500;color:#4a6090">Price per Unit (RWF)</span>
              <input class="num-inp" type="text" inputmode="numeric" :value="price"
                @change="price = Math.min(100_000, Math.max(100, Number($event.target.value.replace(/[^0-9]/g,'')) || 100))" />
            </div>
            <input type="range" min="100" max="100000" step="100" :value="price" @input="price = Number($event.target.value)"
              :style="{ background: `linear-gradient(to right,#b8860b ${pct(price,100,100000)}%,rgba(23,58,112,.12) ${pct(price,100,100000)}%)` }" />
            <div style="display:flex;justify-content:space-between;font-size:9px;color:#8090b0;margin-top:2px"><span>100</span><span>100K</span></div>
          </div>
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
              <span style="font-size:11px;font-weight:500;color:#4a6090">Cost per Unit / COGS (RWF)</span>
              <input class="num-inp" type="text" inputmode="numeric" :value="cogs"
                @change="cogs = Math.min(100_000, Math.max(0, Number($event.target.value.replace(/[^0-9]/g,'')) || 0))" />
            </div>
            <input type="range" min="0" max="100000" step="100" :value="cogs" @input="cogs = Number($event.target.value)"
              :style="{ background: `linear-gradient(to right,#c11633 ${pct(cogs,0,100000)}%,rgba(23,58,112,.12) ${pct(cogs,0,100000)}%)` }" />
            <div style="display:flex;justify-content:space-between;font-size:9px;color:#8090b0;margin-top:2px"><span>0</span><span>100K</span></div>
          </div>
        </div>
        <!-- Result -->
        <div :style="{ borderLeft: `3px solid ${mgColor}`, background:'rgba(23,58,112,.05)', borderRadius:'0 8px 8px 0', padding:'10px 14px', marginTop:14 }">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
            <span style="font-size:11px;font-weight:600;color:#4a6090">Gross Margin</span>
            <span :style="{ fontSize:'22px', fontWeight:700, fontFamily:`'DM Mono',monospace`, color: mgColor }">{{ margin }}<span style="font-size:13px">%</span></span>
          </div>
          <div style="height:5px;background:rgba(23,58,112,.1);border-radius:4px;overflow:hidden">
            <div :style="{ width: margin + '%', height:'100%', borderRadius:'4px', background: mgColor, transition:'width .4s' }"></div>
          </div>
          <div style="font-size:9px;color:#8090b0;margin-top:4px;text-align:right">50% healthy</div>
        </div>
      </div>

      <div style="font-size:11px;color:#8090b0;text-align:center;margin-top:14px;line-height:1.6">
        Use these figures to inform the fields below. Write your conclusions in your own words.
      </div>
    </div>
  </div>
</template>
