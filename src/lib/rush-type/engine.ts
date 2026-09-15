import {
  ARRIVE_S,
  BLOOM_BIAS,
  BLOOM_GAIN,
  AUTO_HOLD,
  AUTO_HOLD_AT,
  BLOOM_SPREAD,
  CRT_BEAM,
  CRT_GAIN,
  CRT_HUM,
  CRT_HUM_SPEED,
  CRT_MASK,
  CRT_PITCH,
  CRT_SCAN,
  CRT_SCAN_PITCH,
  CYCLE_S,
  DRIFT_DIR,
  EXPOSURE,
  FALL,
  FOCAL,
  FONT_VAR,
  GLOW_BASE,
  GLOW_MAX_Y,
  GLOW_MIN,
  GLOW_SPEED,
  GLOW_SPREAD,
  HANG_S,
  HOLD_EASE_IN,
  HOLD_EASE_OUT,
  HOLD_STRENGTH,
  LAG_U,
  LEAVE_S,
  ORBIT_DEPTH,
  ORBIT_HANG_ARC,
  ORBIT_IN,
  ORBIT_OUT,
  ORBIT_PITCH,
  ORBIT_PITCH_LAG,
  ORBIT_RISE,
  ORBIT_YAW,
  ORBIT_YAW_LAG,
  PIVOT_FRAC,
  REST_CAP_FRAC,
  REST_S,
  RISE,
  ROLL_U,
  SAMPLES,
  SCROLL_DECAY,
  SCROLL_GAIN,
  SCROLL_MAX,
  SHUTTER_K,
  SHUTTER_S,
  SHUTTER_SHAPE,
  SMEAR_GAIN,
  SPEED_GAIN,
  SWAP_FLASH,
  SWAP_SPREAD,
  SX_PEAK,
  SY_PEAK,
  THIN,
  WORDS,
  orbitTurn,
  sampleTable,
} from './params'

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FRAG = (samples: number, bloomSpread: number, bloomBias: number) => `
precision highp float;
varying vec2 vUv;

uniform sampler2D uText;
uniform vec2  uRes;
uniform vec2  uHalfPx;
uniform float uSx;
uniform vec3  uSyQ;

uniform float uCenterY;
uniform float uSwapU;
uniform float uHalfA;
uniform float uHalfB;
uniform vec3  uK;
uniform vec2  uSwapScl;
uniform float uShape;
uniform float uRoll;
uniform float uLag;
uniform float uThin;
uniform float uBloom;
uniform float uGain;
uniform float uExp;
uniform float uFocal;
uniform vec3  uPos;
uniform vec4  uRot;
uniform float uCrt;
uniform float uTime;
uniform vec4  uGlow;
uniform float uGlowAmp;

#define SAMPLES ${samples}
#define BLOOM_TAPS 4
#define BLOOM_SPREAD ${bloomSpread.toFixed(3)}
#define BLOOM_BIAS ${bloomBias.toFixed(3)}
#define TAU 6.2831853
#define CRT_PITCH ${CRT_PITCH.toFixed(3)}
#define CRT_MASK ${CRT_MASK.toFixed(4)}
#define CRT_SCAN_PITCH ${CRT_SCAN_PITCH.toFixed(3)}
#define CRT_SCAN ${CRT_SCAN.toFixed(4)}
#define CRT_BEAM ${CRT_BEAM.toFixed(4)}
#define CRT_HUM ${CRT_HUM.toFixed(4)}
#define CRT_HUM_SPEED ${CRT_HUM_SPEED.toFixed(4)}

vec2 atlasUv(float sy, float halfIdx, vec2 W, out float inside) {
  float sx = max(uSx, 1e-4);
  float sv = max(abs(sy), 1e-4);
  vec2 q = vec2(
    (W.x / sx + uHalfPx.x * 0.5) / uHalfPx.x,
    (W.y / sv + uHalfPx.y * 0.5) / uHalfPx.y
  );

  inside = step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);
  return vec2(clamp(q.x, 0.0, 1.0), (clamp(q.y, 0.0, 1.0) + halfIdx) * 0.5);
}

float tap(float sy, float halfIdx, vec2 W, float front) {
  float inside;
  vec2 t = atlasUv(sy, halfIdx, W, inside);
  inside *= front;
  float v = texture2D(uText, t).r * inside;

  return v * mix(1.0, v, uThin);
}

float tapBlur(float sy, float halfIdx, vec2 W, float front) {
  float inside;
  vec2 t = atlasUv(sy, halfIdx, W, inside);
  inside *= front;
  return texture2D(uText, t, BLOOM_BIAS).r * inside;
}

void main() {
  vec2 P = vUv * uRes;
  vec2 C = vec2(uRes.x * 0.5, uRes.y * uCenterY);
  vec2 sp = P - C;

  float sy = uRot.x, cy = uRot.y, sps = uRot.z, cps = uRot.w;
  float a1 = -(sp.x * sy + uFocal * cy);
  float b1 = sps * (sp.x * cy - uFocal * sy);
  float c1 = uFocal * uPos.x - sp.x * uPos.z;
  float a2 = -sp.y * sy;
  float b2 = sp.y * sps * cy - uFocal * cps;
  float c2 = uFocal * uPos.y - sp.y * uPos.z;
  float det = a1 * b2 - a2 * b1;
  float inv = 1.0 / (abs(det) < 1e-4 ? 1e-4 : det);
  float a = (c1 * b2 - c2 * b1) * inv;
  float b = (a1 * c2 - a2 * c1) * inv;
  float Zc = uPos.z - a * sy + b * sps * cy;
  vec2 W = vec2(a, b);

  float front = step(uFocal * 0.05, Zc);

  vec3 acc = vec3(0.0);

  if (abs(uSyQ.y) + abs(uSyQ.z) < 1e-5) {
    acc = vec3(tap(uSyQ.x, uHalfA, W, front));
  } else {
    float off = uLag * (W.x / uRes.x) - uRoll * (sp.y / uRes.y);

    float wsum = 0.0;
    for (int i = 0; i < SAMPLES; i++) {
      float u = float(i) / float(SAMPLES - 1) - 0.5;

      float w = 1.0 - uShape * abs(u) * 2.0;
      wsum += w;

      float us = u + off;

      vec3 uk = us * uK;
      vec3 sy = uSyQ.x + uSyQ.y * uk + uSyQ.z * uk * uk;
      acc.r += w * tap(
        sy.r * (uk.r < uSwapU ? uSwapScl.x : uSwapScl.y),
        uk.r < uSwapU ? uHalfA : uHalfB, W, front);
      acc.g += w * tap(
        sy.g * (uk.g < uSwapU ? uSwapScl.x : uSwapScl.y),
        uk.g < uSwapU ? uHalfA : uHalfB, W, front);
      acc.b += w * tap(
        sy.b * (uk.b < uSwapU ? uSwapScl.x : uSwapScl.y),
        uk.b < uSwapU ? uHalfA : uHalfB, W, front);
    }

    acc /= max(wsum, 1e-4);

    vec3 halo = vec3(0.0);
    for (int j = 0; j < BLOOM_TAPS; j++) {
      float u = (float(j) / float(BLOOM_TAPS - 1) - 0.5) * BLOOM_SPREAD + off;
      vec3 uk = u * uK;
      vec3 sy = uSyQ.x + uSyQ.y * uk + uSyQ.z * uk * uk;
      halo.r += tapBlur(
        sy.r * (uk.r < uSwapU ? uSwapScl.x : uSwapScl.y),
        uk.r < uSwapU ? uHalfA : uHalfB, W, front);
      halo.g += tapBlur(
        sy.g * (uk.g < uSwapU ? uSwapScl.x : uSwapScl.y),
        uk.g < uSwapU ? uHalfA : uHalfB, W, front);
      halo.b += tapBlur(
        sy.b * (uk.b < uSwapU ? uSwapScl.x : uSwapScl.y),
        uk.b < uSwapU ? uHalfA : uHalfB, W, front);
    }
    acc += halo * (uBloom / float(BLOOM_TAPS));

    acc *= uGain;
  }

  acc = (1.0 - exp(-acc * uExp)) / (1.0 - exp(-uExp));

  vec2 gd = (P - uGlow.xy) / max(uGlow.zw, vec2(1.0));
  float ground = uGlowAmp * (1.0 - smoothstep(0.0, 1.0, length(gd)));
  acc += ground * (1.0 - acc);

  if (uCrt > 0.0) {
    float lum = max(max(acc.r, acc.g), acc.b);

    vec3 m = 0.5 + 0.5 * cos(TAU * (P.x / CRT_PITCH - vec3(0.0, 0.33333, 0.66667)));
    vec3 mask = mix(vec3(1.0), m * 2.0, CRT_MASK * uCrt);

    float s = 0.5 + 0.5 * cos(TAU * P.y / CRT_SCAN_PITCH);
    float scan = 1.0 - CRT_SCAN * uCrt * (1.0 - CRT_BEAM * lum) * (1.0 - s);

    float bar = 0.5 + 0.5 * cos(TAU * (P.y / uRes.y - uTime * CRT_HUM_SPEED));
    float hum = 1.0 + CRT_HUM * uCrt * (bar * 2.0 - 1.0);

    acc *= mask * scan * hum;
  }

  gl_FragColor = vec4(acc, 1.0);
}
`

const SEQ = WORDS.length % 2 ? [...WORDS, ...WORDS] : WORDS

interface Frame {
  p: number
  psi: number
  idx: number

  rising: boolean
}

const HANG_H = HANG_S * 0.5
const ARRIVE_END = HANG_H + ARRIVE_S
const REST_END = ARRIVE_END + REST_S
const LEAVE_END = REST_END + LEAVE_S

const SWING_ARC = Math.PI - ORBIT_HANG_ARC

function frameAt(tSec: number): Frame {
  const total = CYCLE_S * SEQ.length
  let t = tSec % total
  if (t < 0) t += total
  const idx = Math.floor(t / CYCLE_S)
  const tau = t - idx * CYCLE_S

  let p: number
  let psi: number
  let rising = false
  if (tau < HANG_H) {
    p = 1
    psi = ORBIT_HANG_ARC * (tau / HANG_H)
  } else if (tau < ARRIVE_END) {
    const u = (tau - HANG_H) / ARRIVE_S
    p = sampleTable(FALL, u)
    psi = ORBIT_HANG_ARC + SWING_ARC * sampleTable(ORBIT_IN, u)
  } else if (tau < REST_END) {
    p = 0
    psi = Math.PI
  } else if (tau < LEAVE_END) {
    const u = (tau - REST_END) / LEAVE_S
    p = sampleTable(RISE, u)
    psi = Math.PI + SWING_ARC * sampleTable(ORBIT_OUT, u)
    rising = true
  } else {
    p = 1
    psi = 2 * Math.PI - ORBIT_HANG_ARC * (1 - (tau - LEAVE_END) / HANG_H)
    rising = true
  }
  return { p, psi, idx, rising }
}

function resolveFamily(cssVar: string): string {
  if (typeof document === 'undefined') return 'sans-serif'
  const probe = document.createElement('span')
  probe.style.cssText = `position:absolute;visibility:hidden;font-family:${cssVar}`
  probe.textContent = 'Ag'
  document.body.appendChild(probe)
  const fam = getComputedStyle(probe).fontFamily
  document.body.removeChild(probe)
  return fam || 'sans-serif'
}

export class RushType {
  ok = false

  private host: HTMLElement
  private canvas: HTMLCanvasElement
  private gl: WebGLRenderingContext | null = null
  private prog: WebGLProgram | null = null
  private quad: WebGLBuffer | null = null
  private tex: WebGLTexture | null = null
  private uni: Record<string, WebGLUniformLocation | null> = {}

  private aw = 1024
  private hh = 256
  private texCap = 164
  private scratch: HTMLCanvasElement | null = null

  private halfWord: [string | null, string | null] = [null, null]

  private wordHalfW = 1

  private rasteredFor = Number.NaN

  private family = 'sans-serif'
  private raf = 0
  private running = false
  private last = 0

  private readonly startOffset = ARRIVE_END + REST_S * 0.5

  private clock = this.startOffset

  private vel = 0
  private lastY = 0

  private held = false
  private hold = 0

  private autoUntil = 0
  private autoCycle = -1

  private wall = 0

  constructor(host: HTMLElement) {
    this.host = host
    this.canvas = document.createElement('canvas')
    this.canvas.style.cssText = 'display:block;width:100%;height:100%'
    host.appendChild(this.canvas)
    this.family = resolveFamily(FONT_VAR)
    this.init()
  }

  private init() {
    const gl = this.canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    }) as WebGLRenderingContext | null
    if (!gl) return
    this.gl = gl

    const coarse =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches
    const prog = this.link(VERT, FRAG(coarse ? 18 : SAMPLES, BLOOM_SPREAD, BLOOM_BIAS))
    if (!prog) return
    this.prog = prog

    this.quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )

    for (const n of [
      'uText', 'uRes', 'uHalfPx', 'uSx', 'uSyQ',
      'uCenterY', 'uSwapU', 'uHalfA', 'uHalfB', 'uK',
      'uShape', 'uRoll', 'uLag', 'uThin', 'uBloom', 'uGain', 'uExp', 'uSwapScl',
      'uFocal', 'uPos', 'uRot', 'uCrt', 'uTime', 'uGlow', 'uGlowAmp',
    ]) {
      this.uni[n] = gl.getUniformLocation(prog, n)
    }

    gl.clearColor(0, 0, 0, 1)
    this.resize()
    this.ok = true
  }

  private link(vs: string, fs: string): WebGLProgram | null {
    const gl = this.gl!
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s)
        return null
      }
      return s
    }
    const v = compile(gl.VERTEX_SHADER, vs)
    const f = compile(gl.FRAGMENT_SHADER, fs)
    if (!v || !f) return null
    const p = gl.createProgram()!
    gl.attachShader(p, v)
    gl.attachShader(p, f)
    gl.bindAttribLocation(p, 0, 'aPos')
    gl.linkProgram(p)
    gl.deleteShader(v)
    gl.deleteShader(f)
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      gl.deleteProgram(p)
      return null
    }
    return p
  }

  private allocAtlas() {
    const gl = this.gl!

    const needed = this.canvas.width * (SX_PEAK / (1 - ORBIT_DEPTH)) * 1.3
    const aw = needed > 1000 ? 2048 : 1024
    const hh = aw / 4
    const changed = aw !== this.aw || !this.tex
    this.aw = aw
    this.hh = hh

    this.texCap = Math.round(hh * 0.64)

    if (changed) {
      if (this.tex) gl.deleteTexture(this.tex)
      this.tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, this.tex)
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, aw, hh * 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, null,
      )
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      this.scratch = document.createElement('canvas')
      this.scratch.width = aw
      this.scratch.height = hh
      this.halfWord = [null, null]
      this.rasteredFor = Number.NaN
    }
  }

  private rasterWord(word: string, half: 0 | 1) {
    const gl = this.gl
    const c = this.scratch
    if (!gl || !c || !this.tex) return
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, c.width, c.height)

    const text = (word || '').trim()
    if (text) {
      let size = this.texCap * 1.4
      ctx.font = `400 ${size}px ${this.family}`
      const capOf = () => {
        const m = ctx.measureText('H')
        return m.actualBoundingBoxAscent || size * 0.72
      }
      size *= this.texCap / capOf()
      ctx.font = `400 ${size}px ${this.family}`

      const maxW = c.width * 0.92
      const w = ctx.measureText(text).width
      if (w > maxW) {
        size *= maxW / w
        ctx.font = `400 ${size}px ${this.family}`
      }
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'

      ctx.fillText(text, c.width / 2, c.height / 2 + this.texCap / 2)
      this.wordHalfW = ctx.measureText(text).width * 0.5
    }

    gl.bindTexture(gl.TEXTURE_2D, this.tex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texSubImage2D(
      gl.TEXTURE_2D, 0, 0, half * this.hh, gl.RGBA, gl.UNSIGNED_BYTE, c,
    )
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    gl.generateMipmap(gl.TEXTURE_2D)
    this.halfWord[half] = word
  }

  private resize() {
    const gl = this.gl
    if (!gl) return
    const r = this.host.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const w = Math.max(1, Math.round(r.width * dpr))
    const h = Math.max(1, Math.round(r.height * dpr))
    if (w === this.canvas.width && h === this.canvas.height && this.tex) return
    this.canvas.width = w
    this.canvas.height = h
    gl.viewport(0, 0, w, h)
    this.allocAtlas()

    this.rasterWord(SEQ[0], 0)
    this.rasterWord(SEQ[1 % SEQ.length], 1)
    this.rasteredFor = 0
  }

  onResize() {
    this.resize()
    if (!this.running) this.draw(this.clock)
  }

  refreshFont() {
    this.family = resolveFamily(FONT_VAR)
    const a = this.halfWord[0]
    const b = this.halfWord[1]
    if (a) this.rasterWord(a, 0)
    if (b) this.rasterWord(b, 1)
    if (!this.running) this.draw(this.clock)
  }

  private draw(tSec: number) {
    const gl = this.gl
    const prog = this.prog
    if (!gl || !prog || !this.tex) return

    const half = SHUTTER_S * 0.5
    const here = frameAt(tSec)
    const before = frameAt(tSec - half)
    const after = frameAt(tSec + half)

    const total = CYCLE_S * SEQ.length
    let tw = tSec % total
    if (tw < 0) tw += total
    const k = Math.floor(tw / CYCLE_S)
    if (this.rasteredFor !== k && tw - k * CYCLE_S >= ARRIVE_END) {
      const nextIdx = (k + 1) % SEQ.length
      this.rasterWord(SEQ[nextIdx], (nextIdx % 2) as 0 | 1)
      this.rasteredFor = k
    }

    const k0 = Math.floor((tSec - half) / CYCLE_S)
    const k1 = Math.floor((tSec + half) / CYCLE_S)
    const swapU = k1 > k0 ? (k1 * CYCLE_S - tSec) / SHUTTER_S : 2

    const swapSep = Math.max(0, 1 - (2 * (tSec - Math.round(tSec / CYCLE_S) * CYCLE_S)) ** 2 / SHUTTER_S ** 2)

    const restCap = this.canvas.height * REST_CAP_FRAC
    const unit = restCap / this.texCap
    const syOf = (f: Frame) => unit * (1 + f.p * (SY_PEAK - 1))

    const syB = syOf(before)
    const syC = syOf(here)
    const syA = syOf(after)
    const qa = syC
    const qc = 2 * (syA + syB - 2 * syC)

    const qbT = syA - syB
    const extra = SMEAR_GAIN * here.p * syC
    const mag = Math.sqrt(qbT * qbT + extra * extra)
    const qb = qbT < 0 ? -mag : mag
    const sx = unit * (1 + here.p * (SX_PEAK - 1))

    const pivot = PIVOT_FRAC * here.p

    const cw = DRIFT_DIR[here.idx % DRIFT_DIR.length] ?? 1
    const psi = here.psi * Math.sign(cw || 1)
    const amp = Math.abs(cw)
    const f = this.canvas.height * FOCAL

    const z = f * (1 - ORBIT_DEPTH * (1 + Math.cos(psi)) * 0.5)

    const x = 0
    const y = f * ORBIT_RISE * amp * Math.sin(psi)

    const yaw = orbitTurn(psi, ORBIT_YAW, ORBIT_YAW_LAG)
    const pitch = orbitTurn(psi, ORBIT_PITCH, ORBIT_PITCH_LAG)

    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.tex)

    gl.uniform1i(this.uni.uText, 0)
    gl.uniform2f(this.uni.uRes, this.canvas.width, this.canvas.height)
    gl.uniform2f(this.uni.uHalfPx, this.aw, this.hh)
    gl.uniform1f(this.uni.uSx, sx)
    gl.uniform3f(this.uni.uSyQ, qa, qb, qc)
    gl.uniform1f(this.uni.uCenterY, 0.5 + pivot)
    gl.uniform1f(this.uni.uSwapU, swapU)
    gl.uniform1f(this.uni.uHalfA, before.idx % 2)
    gl.uniform1f(this.uni.uHalfB, after.idx % 2)
    gl.uniform3f(this.uni.uK, SHUTTER_K[0], SHUTTER_K[1], SHUTTER_K[2])
    gl.uniform1f(this.uni.uShape, SHUTTER_SHAPE)
    gl.uniform1f(this.uni.uRoll, ROLL_U)
    gl.uniform1f(this.uni.uLag, LAG_U)

    gl.uniform1f(this.uni.uThin, THIN * here.p)
    gl.uniform1f(this.uni.uBloom, BLOOM_GAIN * here.p)

    gl.uniform1f(
      this.uni.uGain,
      (1 + SPEED_GAIN * here.p) * (1 + SWAP_FLASH * swapSep),
    )
    gl.uniform2f(
      this.uni.uSwapScl,
      1 + SWAP_SPREAD * swapSep,
      1 - SWAP_SPREAD * swapSep,
    )
    gl.uniform1f(this.uni.uExp, EXPOSURE)
    gl.uniform1f(this.uni.uFocal, f)
    gl.uniform3f(this.uni.uPos, x, y, z)
    gl.uniform4f(
      this.uni.uRot,
      Math.sin(yaw), Math.cos(yaw),
      Math.sin(pitch), Math.cos(pitch),
    )
    gl.uniform1f(this.uni.uCrt, CRT_GAIN * here.p)

    const gx = this.canvas.width * 0.5 + (f * x) / z
    const gy = this.canvas.height * (0.5 + pivot) + (f * y) / z
    const persp = f / z
    const wordW = this.wordHalfW * sx * persp
    const wordH = this.texCap * syC * persp
    gl.uniform4f(
      this.uni.uGlow,
      gx,
      gy,
      Math.max(wordW * GLOW_SPREAD, this.canvas.width * GLOW_MIN),
      Math.min(
        Math.max(wordH * GLOW_SPREAD, this.canvas.height * GLOW_MIN),
        this.canvas.height * GLOW_MAX_Y,
      ),
    )
    gl.uniform1f(this.uni.uGlowAmp, GLOW_BASE + GLOW_SPEED * here.p)

    gl.uniform1f(this.uni.uTime, this.wall % (1 / CRT_HUM_SPEED))

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  private onScroll = () => {
    const y = window.scrollY
    this.vel = Math.min(this.vel + Math.abs(y - this.lastY), SCROLL_MAX / SCROLL_GAIN)
    this.lastY = y
  }

  private tick = (now: number) => {
    if (!this.running) return

    const dt = this.last ? Math.min((now - this.last) / 1000, 0.05) : 0
    this.last = now
    this.wall += dt
    this.vel *= Math.exp(-SCROLL_DECAY * dt)

    const fr = frameAt(this.clock)
    const auto = AUTO_HOLD[fr.idx % AUTO_HOLD.length] ?? 0
    const cycle = Math.floor(this.clock / CYCLE_S)
    if (auto > 0 && fr.rising && fr.p > AUTO_HOLD_AT && this.autoCycle !== cycle) {
      this.autoCycle = cycle
      this.autoUntil = this.wall + auto
    }

    const want = Math.max(this.held ? 1 : 0, this.wall < this.autoUntil ? 1 : 0)
    const ease = want > this.hold ? HOLD_EASE_IN : HOLD_EASE_OUT
    const k = dt > 0 ? 1 - Math.exp(-dt / ease) : 0
    this.hold += (want - this.hold) * k

    const pp = fr.p * fr.p
    const brake = 1 - this.hold * HOLD_STRENGTH * pp * pp
    this.clock += dt * (1 + Math.min(SCROLL_GAIN * this.vel, SCROLL_MAX)) * brake
    this.draw(this.clock)
    this.raf = requestAnimationFrame(this.tick)
  }

  start() {
    if (this.running || !this.ok) return
    this.running = true
    this.last = 0
    this.lastY = window.scrollY
    this.vel = 0
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.raf = requestAnimationFrame(this.tick)
  }

  setHeld(v: boolean) {
    this.held = v
  }

  stop() {
    if (this.running) window.removeEventListener('scroll', this.onScroll)
    this.running = false
    cancelAnimationFrame(this.raf)
    this.raf = 0
  }

  renderStill() {
    this.draw(this.clock)
  }

  destroy() {
    this.stop()
    const gl = this.gl
    if (gl) {
      if (this.prog) gl.deleteProgram(this.prog)
      if (this.quad) gl.deleteBuffer(this.quad)
      if (this.tex) gl.deleteTexture(this.tex)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    this.gl = null
    this.prog = null
    this.quad = null
    this.tex = null
    this.scratch = null
    this.canvas.remove()
  }
}