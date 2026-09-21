// @ts-nocheck
import {
  $c,
  BOT_NAMES,
  BRAWLER_DEFS,
  COLLISION_RADIUS,
  DIFFICULTIES,
  GAME_CONFIG,
  H,
  Ln,
  Q,
  QUALITY_PRESETS,
  RenderPipeline,
  Tn,
  a,
  ao,
  br,
  c,
  e,
  el,
  hi,
  i,
  kl,
  l,
  mr,
  n,
  nl,
  o,
  pn,
  r,
  s,
  sl,
  t,
  tl,
  u,
  ut,
  vt,
  x,
  y,
  yr,
  z
} from './shared.js';
import {
  $u,
  Bot,
  Brawler,
  CAMERA_PITCH,
  Combat,
  Effects,
  FOV,
  GameAudio,
  GasRing,
  HUD,
  Input,
  SETTINGS_KEY,
  TIME_PRESETS,
  Uu,
  ad,
  id,
  nd,
  od,
  rd,
  sd
} from './gameplay.js';
import { World } from './world.js';
function cd(items) {
  for (let index = items.length - 1; index > 0; index--) {
    let randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }
  return items;
}
var Game = class {
  constructor(e = {}) {
    this.params = new URLSearchParams(location.search);
    let t = {};
    try {
      t = JSON.parse(localStorage.getItem(SETTINGS_KEY) || `{}`);
    } catch {
      t = {};
    }
    ((this.saved = t),
      (this.scene = new vt()),
      (this.camera = new hi(
        FOV,
        window.innerWidth / window.innerHeight,
        1,
        260
      )),
      (this.pipeline = new RenderPipeline(
        document.getElementById(`game`),
        this.scene,
        this.camera
      )),
      (this.pipeline.renderer.info.autoReset = !1),
      t.ao === !1 && (this.pipeline.toggles.ao = !1),
      t.bloom === !1 && (this.pipeline.toggles.bloom = !1));
    let n = !!(
        window.matchMedia && window.matchMedia(`(pointer: coarse)`).matches
      ),
      r = this.params.get(`q`) || t.quality || (n ? `medium` : `high`);
    ((this.userPickedQuality = !!(this.params.get(`q`) || t.quality)),
      (this.pipeline.superSample = $c(
        parseFloat(this.params.get(`ss`)) || 0,
        0,
        3
      )),
      this.pipeline.setQuality(QUALITY_PRESETS[r] ? r : `high`));
    let i = this.params.get(`bots`) || t.difficulty;
    ((this.difficultyName = DIFFICULTIES[i] ? i : `normal`),
      (this.difficulty = DIFFICULTIES[this.difficultyName]),
      (this.lighting = new kl(this.scene, this.pipeline)),
      this.lighting.applyQuality(this.pipeline.quality),
      (this.audio = new GameAudio()),
      (this.audio.muted = !!t.muted),
      (this.input = new Input(
        this.pipeline.renderer.domElement,
        document.getElementById(`super`)
      )),
      (this.input.onTouchMode = (e) => this.hud.setTouchMode(e)),
      (this.elapsed = 0),
      (this.matchTime = 0),
      (this.state = `menu`),
      (this.brawlers = []),
      (this.brains = []),
      (this.player = null),
      (this.spectate = null),
      (this.focus = new H(0, 0, 0)),
      (this.shakeAmp = 0),
      (this.leanX = 0),
      (this.leanZ = 0),
      (this.menuAngle = 0.6),
      (this.attractT = 0),
      (this.endT = 0),
      (this.pendingResult = null),
      (this.countdownT = 0),
      (this.lastCount = 0),
      (this.camZoom = parseFloat(this.params.get(`zoom`)) || 1),
      (this.paused = !1),
      (this.simSteps = $c(parseInt(this.params.get(`speed`), 10) || 1, 1, 16)),
      (this.timePreset = 0),
      (this.autoTime = t.autoTime !== !1),
      (this.perf = {
        t: 0,
        frames: 0,
        done: !1
      }),
      (this.frameStats = {
        calls: 0,
        triangles: 0
      }));
    let a = parseInt(this.params.get(`seed`), 10);
    ((this.nextSeed = Number.isFinite(a) ? a : (Math.random() * 1e9) | 0),
      (this.fixedSeed = Number.isFinite(a) ? a : null),
      (this.maxAniso = this.pipeline.renderer.capabilities.getMaxAnisotropy()),
      (this.world = new World(this.scene, this.nextSeed, this.maxAniso)),
      this.lighting.setLamps(this.world.lanterns, this.world.lampGlass),
      (this.effects = new Effects(this)),
      (this.combat = new Combat(this)),
      (this.gas = new GasRing(this)),
      (this.hud = new HUD(this)),
      this.buildAimGuide(),
      e.selected && BRAWLER_DEFS[e.selected] && this.hud.select(e.selected),
      n && this.input.setTouchMode(!0));
    let o = parseFloat(this.params.get(`time`));
    (Number.isFinite(o)
      ? ((this.autoTime = !1), this.lighting.setTime(o))
      : !this.autoTime &&
        Number.isFinite(t.time) &&
        this.lighting.setTime(t.time),
      window.addEventListener(`keydown`, (e) => {
        if (e.repeat) return;
        let t = Uu(e);
        (t === `KeyT` && this.cycleTime(),
          t === `KeyM` && this.setMuted(!this.audio.muted),
          t === `KeyP` &&
            this.state !== `menu` &&
            ((this.paused = !this.paused),
            this.hud.toast(
              this.paused ? `Paused - press P to resume` : `Resumed`
            )),
          t === `Escape` &&
            document.getElementById(`settings`).classList.remove(`open`));
      }),
      this.hud.syncSettings(),
      this.toMenu());
    let s = this.params.get(`auto`);
    (s && BRAWLER_DEFS[s] && this.startMatch(s),
      (this.last = performance.now()),
      (this.frame = this.frame.bind(this)),
      (this.warmup = 3),
      (this.frameRequest = requestAnimationFrame(this.frame)));
  }
  dispose() {
    this.disposed = true;
    if (this.frameRequest) cancelAnimationFrame(this.frameRequest);
    if (this.onKeyDown) window.removeEventListener(`keydown`, this.onKeyDown);
    this.input?.dispose?.();
    this.world?.dispose?.();
    this.combat?.clear?.();
    this.pipeline?.composer?.dispose?.();
    this.pipeline?.renderer?.dispose?.();
    this.audio?.ctx?.close?.();
  }
  save() {
    let e = {
      quality: this.userPickedQuality ? this.pipeline.qualityName : void 0,
      ao: this.pipeline.toggles.ao,
      bloom: this.pipeline.toggles.bloom,
      muted: this.audio.muted,
      autoTime: this.autoTime,
      time: this.lighting.time,
      difficulty: this.difficultyName
    };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(e));
    } catch {}
  }
  setQuality(e, t = !1) {
    (t && (this.userPickedQuality = !0),
      this.pipeline.setQuality(e),
      this.lighting.applyQuality(this.pipeline.quality),
      this.hud.syncSettings(),
      this.save());
  }
  setToggle(e, t) {
    (this.pipeline.setToggle(e, t), this.save());
  }
  setDifficulty(e) {
    DIFFICULTIES[e] &&
      ((this.difficultyName = e),
      (this.difficulty = DIFFICULTIES[e]),
      this.hud.syncSettings(),
      this.save());
  }
  setAutoTime(e) {
    ((this.autoTime = e), this.hud.syncSettings(), this.save());
  }
  setMuted(e) {
    (this.audio.setMuted(e), this.hud.syncSettings(), this.save());
  }
  cycleTime() {
    this.timePreset = (this.timePreset + 1) % TIME_PRESETS.length;
    let e = TIME_PRESETS[this.timePreset];
    e === null
      ? (this.setAutoTime(!0),
        this.hud.toast(`Time of day: following the match`))
      : (this.setAutoTime(!1),
        this.lighting.setTime(e),
        this.hud.toast(
          `Time of day locked to ${String(Math.floor(e)).padStart(2, `0`)}:${String(Math.round((e % 1) * 60)).padStart(2, `0`)}`
        ));
  }
  clearEntities() {
    for (let e of this.brawlers) e.dispose();
    ((this.brawlers = []),
      (this.brains = []),
      (this.player = null),
      (this.spectate = null),
      this.combat.clear(),
      this.gas.reset(),
      this.hud.reset());
  }
  newWorld() {
    (this.world.dispose(),
      (this.nextSeed =
        this.fixedSeed === null ? (Math.random() * 1e9) | 0 : this.fixedSeed),
      (this.fixedSeed = null),
      (this.world = new World(this.scene, this.nextSeed, this.maxAniso)),
      this.lighting.setLamps(this.world.lanterns, this.world.lampGlass),
      this.effects.rebuildFireflies());
  }
  spawnRoster(e) {
    this.clearEntities();
    let t = this.world,
      n = cd(t.spawns.slice()),
      r = cd(BOT_NAMES.slice()),
      i = Object.keys(BRAWLER_DEFS),
      a = GAME_CONFIG.bots + 1;
    for (let o = 0; o < a; o++) {
      let [a, s] = n[o % n.length],
        c = o === 0 && !!e,
        l = BRAWLER_DEFS[c ? e : i[(o + Math.floor(Math.random() * 4)) % 4]],
        u = new Brawler(this, l, {
          isPlayer: c,
          name: c ? `YOU` : r[o % r.length],
          x: t.center(a),
          z: t.center(s),
          hueShift: c ? 0 : Q(-0.07, 0.07)
        });
      (this.brawlers.push(u),
        this.hud.addBrawler(u),
        c ? (this.player = u) : this.brains.push(new Bot(this, u)));
    }
    for (let [e, n] of t.boxSpots) this.combat.addBox(e, n);
    ((t.aoDirty = !0), (t.aoTimer = 0));
  }
  toMenu() {
    ((this.state = `menu`),
      this.hud.showMenu(!0),
      this.spawnRoster(null),
      (this.attractT = 0));
  }
  startMatch(e) {
    (this.audio.unlock(),
      this.audio.play(`click`),
      this.newWorld(),
      this.spawnRoster(e),
      this.hud.showMenu(!1),
      this.hud.hideResult(),
      (this.state = `countdown`),
      (this.countdownT = 3.4),
      (this.lastCount = 4),
      (this.matchTime = 0),
      (this.pendingResult = null),
      (this.shakeAmp = 0),
      this.focus.set(this.player.x, 0, this.player.z),
      this.setupGuideFor(this.player.def),
      this.autoTime && this.lighting.setTime(GAME_CONFIG.startHour),
      this.input.touchMode &&
        window.innerHeight > window.innerWidth &&
        this.hud.toast(`Tip: turn your phone sideways for a wider view`));
  }
  onPlayerHurt(e) {
    (this.hud.flashHurt(e), (this.shakeAmp = Math.max(this.shakeAmp, 0.07)));
  }
  onBrawlerDown(e, t) {
    let n = this.brawlers.reduce((e, t) => e + +!!t.alive, 0);
    if (
      ((e.rank = n + 1),
      this.effects.defeat(e.x, e.z, e.lightColor),
      this.audio.play(`down`, e.x, e.z),
      this.combat.dropCubes(e.x, e.z, 1 + Math.floor(e.cubes / 2)),
      this.state === `menu`)
    )
      return;
    let r = (e) => (e && e.isPlayer ? `you` : ``);
    if (
      (t && t !== e
        ? this.hud.feed(
            `<span class="k ${r(t)}">${t.name}</span> ⚔ <span class="v ${r(e)}">${e.name}</span>`
          )
        : this.hud.feed(
            `<span class="v ${r(e)}">${e.name}</span> ☠ poison gas`
          ),
      this.state !== `playing`)
    )
      return;
    let i = this.player;
    e === i
      ? ((this.state = `ended`),
        (this.spectate = t && t.alive ? t : null),
        (this.pendingResult = {
          t: 1.5,
          won: !1,
          rank: e.rank
        }),
        this.audio.play(`lose`))
      : n === 1 && i && i.alive
        ? ((this.state = `ended`),
          (i.rank = 1),
          (this.pendingResult = {
            t: 1.3,
            won: !0,
            rank: 1
          }),
          this.audio.play(`win`))
        : n === 2 && i && i.alive && this.hud.banner(`SHOWDOWN!`, 1.5, !0);
  }
  shake(e, t, n) {
    let r = sl(t, n, this.focus.x, this.focus.z);
    this.shakeAmp = Math.max(this.shakeAmp, e * $c(1 - r / 8, 0, 1));
  }
  clearBots() {
    for (let e of this.brawlers) {
      if (e.isPlayer) continue;
      let t = this.hud.overheads.get(e.id);
      (t && t.root.remove(), this.hud.overheads.delete(e.id), e.dispose());
    }
    ((this.brawlers = this.brawlers.filter((e) => e.isPlayer)),
      (this.brains = []));
  }
  spawnBot(e, t, n, r, i = !1) {
    let a = BRAWLER_DEFS[e] || BRAWLER_DEFS.dusty,
      o = new Brawler(this, a, {
        isPlayer: !1,
        name: r || BOT_NAMES[this.brawlers.length % BOT_NAMES.length],
        x: t,
        z: n,
        hueShift: Q(-0.06, 0.06)
      });
    return (
      this.brawlers.push(o),
      this.hud.addBrawler(o),
      i && this.brains.push(new Bot(this, o)),
      o
    );
  }
  buildAimGuide() {
    let e = () =>
        new Tn({
          color: 16777215,
          transparent: !0,
          opacity: 0.18,
          depthWrite: !1
        }),
      t = new ut();
    ((t.userData.noAO = !0),
      (t.position.y = 0.06),
      (t.visible = !1),
      (this.guideRect = new Ln(
        new yr(1, 1).rotateX(-Math.PI / 2).translate(0.5, 0, 0),
        e()
      )),
      (this.guideSector = new Ln(new pn(), e())),
      (this.guideCircle = new Ln(new mr(1, 48).rotateX(-Math.PI / 2), e())),
      (this.guideRing = new Ln(new br(0.93, 1, 48).rotateX(-Math.PI / 2), e())),
      (this.guideRing.material.opacity = 0.7),
      this.guideCircle.add(this.guideRing));
    for (let e of [this.guideRect, this.guideSector, this.guideCircle])
      ((e.renderOrder = 3), t.add(e));
    ((this.guide = t), this.scene.add(t), (this.sectorGeos = {}));
  }
  setupGuideFor(e) {
    for (let t of [`attack`, `super`]) {
      let n = e[t];
      n.kind === `spread` &&
        (this.sectorGeos[t] && this.sectorGeos[t].dispose(),
        (this.sectorGeos[t] = new mr(
          1,
          28,
          -n.spread / 2 - 0.07,
          n.spread + 0.14
        ).rotateX(-Math.PI / 2)));
    }
  }
  updateGuide(e, t, n, r, i, a) {
    let o = this.player,
      s = this.guide;
    ((s.visible = !0),
      s.position.set(o.x, 0.06, o.z),
      (s.rotation.y = Math.atan2(n, r) - Math.PI / 2));
    let c = a ? 16765498 : 16777215,
      l = a ? 0.34 : 0.17;
    if (
      ((this.guideRect.visible =
        this.guideSector.visible =
        this.guideCircle.visible =
          !1),
      e.kind === `spread`)
    )
      ((this.guideSector.geometry = this.sectorGeos[t]),
        this.guideSector.scale.setScalar(e.range),
        (this.guideSector.visible = !0),
        this.guideSector.material.color.set(c),
        (this.guideSector.material.opacity = l));
    else if (e.kind === `burst` || e.kind === `melee`) {
      let t = e.range,
        i = this.world.raycast(o.x, o.z, o.x + n * e.range, o.z + r * e.range);
      (i &&
        !(e.breaksWalls && this.world.isBreakable(i.tx, i.ty)) &&
        (t = Math.max(0.6, i.dist)),
        this.guideRect.scale.set(t, 1, Math.max(0.42, e.radius * 2.6)),
        (this.guideRect.visible = !0),
        this.guideRect.material.color.set(c),
        (this.guideRect.material.opacity = l));
    } else {
      let t = $c(i, e.kind === `leap` ? 2 : 0.5, e.range);
      (this.guideCircle.position.set(t, 0, 0),
        this.guideCircle.scale.setScalar(e.blast),
        (this.guideCircle.visible = !0),
        this.guideCircle.material.color.set(c),
        (this.guideCircle.material.opacity = l * 0.8),
        this.guideRing.material.color.set(c),
        this.guideRect.scale.set(Math.max(0.1, t - e.blast), 1, 0.12),
        (this.guideRect.visible = !0),
        this.guideRect.material.color.set(c),
        (this.guideRect.material.opacity = l));
    }
  }
  controlPlayer() {
    let e = this.player;
    if (
      !e ||
      !e.alive ||
      (this.state !== `playing` && this.state !== `countdown`)
    ) {
      ((this.guide.visible = !1),
        e && (e.moveX = e.moveZ = 0),
        this.input.takeShots());
      return;
    }
    let t = this.input,
      n = t.axis();
    ((e.moveX = n.x), (e.moveZ = n.z));
    for (let n of t.takeShots()) {
      if (n.cancelled) continue;
      let t = n.kind === `super` ? e.def.super : e.def.attack,
        r = n.tap ? this.autoAim(t) : this.stickAim(n, t);
      n.kind === `super`
        ? e.useSuper(r.dx, r.dz, r.x, r.z)
        : e.attack(r.dx, r.dz, r.x, r.z);
    }
    if (t.touchMode) {
      let n = t.sticks,
        r =
          n.super.id !== null && n.super.moved && e.superReady
            ? `super`
            : n.aim.id !== null && n.aim.moved
              ? `attack`
              : null;
      if (r && !e.airborne) {
        let t = this.stickAim(r === `super` ? n.super : n.aim, e.def[r]);
        (ad.set(e.x + t.dx * 5, 0.5, e.z + t.dz * 5),
          this.updateGuide(e.def[r], r, t.dx, t.dz, t.dist, r === `super`));
      } else (ad.set(e.x, 0.5, e.z), (this.guide.visible = !1));
      return;
    }
    (rd.set(t.ndcX, t.ndcY),
      nd.setFromCamera(rd, this.camera),
      nd.ray.intersectPlane(id, ad) || ad.set(e.x, 0.5, e.z + 1));
    let r = ad.x - e.x,
      i = ad.z - e.z,
      a = Math.hypot(r, i) || 1;
    ((r /= a), (i /= a));
    let o = t.consumeSuperRelease(),
      s = t.superHeld && e.superReady;
    o && e.superReady
      ? e.useSuper(r, i, ad.x, ad.z)
      : t.fire && !s && e.attack(r, i, ad.x, ad.z);
    let c = s ? `super` : `attack`;
    e.airborne
      ? (this.guide.visible = !1)
      : this.updateGuide(e.def[c], c, r, i, a, s);
  }
  stickAim(e, t) {
    let n = this.player,
      r = Math.hypot(e.x, e.y) || 1,
      i = e.x / r,
      a = e.y / r,
      o =
        t.kind === `lob` || t.kind === `leap`
          ? Math.max(t.kind === `leap` ? 2 : 1, e.mag * t.range)
          : t.range;
    return {
      dx: i,
      dz: a,
      dist: o,
      x: n.x + i * o,
      z: n.z + a * o
    };
  }
  autoAim(e) {
    let t = this.player,
      n = e.range * 1.05,
      r = 0,
      i = 0,
      a = 1 / 0;
    for (let o of this.brawlers) {
      if (o === t || !o.alive || o.hidden || o.airborne) continue;
      let s = sl(t.x, t.z, o.x, o.z);
      if (s > n || s >= a) continue;
      let c =
        e.kind === `lob`
          ? e.flight + e.fuse * 0.6
          : e.kind === `leap`
            ? e.flight
            : s / (e.speed || 15);
      ((a = s), (r = o.x + o.vel.x * c * 0.7), (i = o.z + o.vel.y * c * 0.7));
    }
    if (a === 1 / 0)
      for (let e of this.combat.boxes) {
        if (!e.alive) continue;
        let o = sl(t.x, t.z, e.x, e.z);
        o > n || o >= a || ((a = o), (r = e.x), (i = e.z));
      }
    if (a === 1 / 0) {
      let n = e.kind === `lob` || e.kind === `leap` ? e.range * 0.6 : e.range;
      ((r = t.x + Math.sin(t.facing) * n), (i = t.z + Math.cos(t.facing) * n));
    }
    let o = Math.hypot(r - t.x, i - t.z) || 1;
    return {
      dx: (r - t.x) / o,
      dz: (i - t.z) / o,
      dist: o,
      x: r,
      z: i
    };
  }
  separateBrawlers() {
    let e = this.brawlers,
      t = COLLISION_RADIUS * 1.9;
    for (let n = 0; n < e.length; n++) {
      let r = e[n];
      if (r.alive && !r.airborne)
        for (let i = n + 1; i < e.length; i++) {
          let n = e[i];
          if (!n.alive || n.airborne) continue;
          let a = n.x - r.x,
            o = n.z - r.z,
            s = Math.hypot(a, o);
          if (s >= t || s < 1e-4) continue;
          let c = (t - s) * 0.5,
            l = a / s,
            u = o / s;
          ((r.root.position.x -= l * c),
            (r.root.position.z -= u * c),
            (n.root.position.x += l * c),
            (n.root.position.z += u * c));
        }
    }
  }
  updateVisibility() {
    let e = this.player && this.player.alive ? this.player : null,
      t = this.world.grassUniforms.uPushers.value,
      n = 0;
    for (let r of this.brawlers) {
      let i = !1;
      if (
        (e &&
          r !== e &&
          r.alive &&
          r.inBush &&
          r.revealT <= 0 &&
          (i = sl(e.x, e.z, r.x, r.z) > 2.4),
        (r.hidden = i),
        r.alive && (r.root.visible = !i),
        n < 8)
      ) {
        let e = Math.min(1, r.vel.length() / 3),
          a = r.alive && !i && !r.airborne ? 0.55 + e * 0.45 : 0;
        t[n++].set(r.x, r.z, 1.05, a);
      }
    }
    for (; n < 8; ) t[n++].set(0, 0, 1, 0);
    let r = this.world.grassUniforms.uReveal.value;
    e ? r.set(e.x, e.z, 0, +!!e.inBush) : r.set(0, 0, 0, 0);
  }
  updateTime(e) {
    this.autoTime &&
      (this.state === `menu`
        ? this.lighting.setTime(this.lighting.time + e * 0.4)
        : this.lighting.setTime(
            el(
              GAME_CONFIG.startHour,
              GAME_CONFIG.endHour,
              $c(this.matchTime / GAME_CONFIG.dayLength, 0, 1)
            )
          ));
  }
  updateCamera(e) {
    let t = this.camera,
      n = t.aspect,
      r = $c(1.55 / n, 1, 1.75);
    if (this.state === `menu`) {
      this.menuAngle += e * 0.05;
      let n = 27 * r;
      (this.focus.set(0, 0, -1),
        t.position.set(
          Math.sin(this.menuAngle) * n * 0.55,
          30 * r,
          9 + Math.cos(this.menuAngle) * n * 0.62
        ),
        t.lookAt(this.focus));
      return;
    }
    let i =
      this.player && this.player.alive
        ? this.player
        : this.spectate && this.spectate.alive
          ? this.spectate
          : this.brawlers.find((e) => e.alive);
    if (i) {
      let t = i.x,
        n = i.z;
      (i === this.player &&
        this.state === `playing` &&
        ((this.leanX = nl(this.leanX, $c(ad.x - i.x, -8, 8) * 0.09, 2.2, e)),
        (this.leanZ = nl(this.leanZ, $c(ad.z - i.z, -8, 8) * 0.09, 2.2, e)),
        (t += this.leanX),
        (n += this.leanZ)),
        (t = $c(t, -14, 14)),
        (n = $c(n, -15, 17)),
        (this.focus.x = nl(this.focus.x, t, 5.5, e)),
        (this.focus.z = nl(this.focus.z, n, 5.5, e)));
    }
    let a = this.state === `countdown` ? tl(0.4, 3.2, this.countdownT) : 0,
      o = $u * r * this.camZoom * (1 + a * 0.75);
    this.shakeAmp = nl(this.shakeAmp, 0, 9, e);
    let s = this.shakeAmp,
      c = this.elapsed,
      l = Math.sin(c * 43) * s * 0.3,
      u = Math.cos(c * 37 + 1.3) * s * 0.22;
    (t.position.set(
      this.focus.x + l,
      Math.sin(CAMERA_PITCH) * o,
      this.focus.z + Math.cos(CAMERA_PITCH) * o + u
    ),
      t.lookAt(this.focus.x + l, 0, this.focus.z + u));
  }
  update(e) {
    if ((this.pipeline.resize(), this.paused)) {
      (this.updateCamera(0),
        this.world.update(e, this.elapsed),
        this.lighting.update(e, this.elapsed, this.camera, this.focus, !0),
        this.hud.update(0));
      return;
    }
    if (((this.elapsed += e), this.state === `countdown`)) {
      this.countdownT -= e;
      let t = Math.ceil(this.countdownT - 0.4);
      (t !== this.lastCount &&
        t >= 1 &&
        t <= 3 &&
        ((this.lastCount = t),
        this.hud.banner(String(t), 0.8),
        this.audio.play(`count`)),
        this.countdownT <= 0.4 &&
          this.lastCount !== 0 &&
          ((this.lastCount = 0),
          (this.state = `playing`),
          this.lighting.resetShadowFit(),
          this.hud.banner(`BRAWL!`, 0.9),
          this.audio.play(`go`)));
    } else this.state !== `menu` && (this.matchTime += e);
    this.controlPlayer();
    for (let t of this.brains) t.update(e);
    for (let t of this.brawlers) t.update(e);
    if (
      (this.separateBrawlers(), this.combat.update(e), this.state !== `menu`)
    ) {
      let t = this.gas.active;
      (this.gas.update(e, this.matchTime),
        !t &&
          this.gas.active &&
          this.hud.banner(`POISON GAS IS CLOSING IN!`, 2.2, !0));
    }
    (this.effects.update(e),
      this.updateVisibility(),
      this.updateTime(e),
      this.updateCamera(e),
      this.world.update(e, this.elapsed));
    let t = this.lighting;
    for (let e of this.brawlers)
      e.alive &&
        !e.hidden &&
        e.superReady &&
        t.addLight(
          e.x,
          0.9,
          e.z,
          od,
          1.5 + Math.sin(this.elapsed * 6) * 0.4,
          3.6
        );
    let n = this.player;
    if (
      (n &&
        n.alive &&
        t.night > 0.02 &&
        t.addLight(n.x, 1.9, n.z, sd, 2.4 * t.night, 6.5),
      (this.audio.listener.x = this.focus.x),
      (this.audio.listener.z = this.focus.z),
      t.update(e, this.elapsed, this.camera, this.focus),
      this.state === `menu`)
    ) {
      let t = this.brawlers.reduce((e, t) => e + +!!t.alive, 0);
      ((this.attractT = t <= 1 ? this.attractT + e : 0),
        this.attractT > 2.5 && this.toMenu());
    }
    if (
      this.pendingResult &&
      ((this.pendingResult.t -= e), this.pendingResult.t <= 0)
    ) {
      let e = this.pendingResult;
      ((this.pendingResult = null),
        this.hud.showResult(
          e.won,
          e.rank,
          this.brawlers.length,
          this.player.kills,
          this.player.cubes
        ));
    }
    this.hud.update(e);
  }
  benchmarkQuality() {
    if (this.userPickedQuality) return;
    let e = this.pipeline.renderer,
      t = e.getContext(),
      n = new Uint8Array(4),
      r = [`ultra`, `high`, `medium`, `low`],
      i = this.lighting.time;
    this.lighting.setTime(21.5);
    for (let i = 0; i < 3; i++) {
      let i = [];
      for (let r = 0; r < 10; r++) {
        let r = performance.now();
        (this.lighting.update(0, this.elapsed, this.camera, this.focus, !0),
          this.pipeline.render(0),
          e.setRenderTarget(null),
          t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, n),
          i.push(performance.now() - r));
      }
      (i.splice(0, 4), i.sort((e, t) => e - t));
      let a = i[Math.floor(i.length / 2)],
        o = r.indexOf(this.pipeline.qualityName);
      if (((this.perf.benchMs = a), a <= 20 || o >= r.length - 1)) break;
      (this.setQuality(r[o + 1]),
        this.hud.toast(
          `${QUALITY_PRESETS[r[o + 1]].label} quality picked for this GPU - change it any time under ⚙`
        ));
    }
    this.lighting.setTime(i);
  }
  adaptQuality(e) {
    let t = this.perf;
    if (
      this.userPickedQuality ||
      this.state !== `playing` ||
      this.paused ||
      document.hidden ||
      e > 0.1 ||
      ((t.t += e), t.frames++, t.t < 6)
    )
      return;
    let n = t.frames / t.t;
    ((t.t = 0), (t.frames = 0));
    let r = [`ultra`, `high`, `medium`, `low`],
      i = r.indexOf(this.pipeline.qualityName);
    n < 24 &&
      i < r.length - 1 &&
      (this.setQuality(r[i + 1]),
      this.hud.toast(
        `Running at ${Math.round(n)} fps - switched to ${QUALITY_PRESETS[r[i + 1]].label} quality`
      ));
  }
  frame(e) {
    if (this.disposed) return;
    let t = (e - this.last) / 1e3,
      n = Math.min(0.05, Math.max(1e-4, t));
    this.last = e;
    let r = this.pipeline.renderer.info;
    ((this.frameStats.calls = r.render.calls),
      (this.frameStats.triangles = r.render.triangles),
      r.reset());
    for (let e = 0; e < this.simSteps; e++) this.update(n);
    (this.pipeline.render(n),
      this.warmup > 0 &&
        --this.warmup === 0 &&
        (this.benchmarkQuality(),
        (this.last = performance.now()),
        document.getElementById(`loading`).classList.add(`done`)),
      this.adaptQuality(t),
      (this.frameRequest = requestAnimationFrame(this.frame)));
  }
};
function startGame(e = {}) {
  const game = new Game(e);
  window.__game = game;
  return game;
}
export { Game, cd, startGame };
