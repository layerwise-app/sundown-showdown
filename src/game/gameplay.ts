// @ts-nocheck
import {
  $c,
  BRAWLER_DEFS,
  COLLISION_RADIUS,
  DIFFICULTIES,
  GAME_CONFIG,
  H,
  Hi,
  J,
  Ke,
  Ln,
  N,
  Nr,
  Q,
  QUALITY_PRESETS,
  Re,
  T,
  TileType,
  Tn,
  V,
  Yn,
  Zt,
  _,
  _e,
  _n,
  a,
  al,
  ao,
  ar,
  b,
  br,
  c,
  cr,
  d,
  e,
  el,
  f,
  fr,
  g,
  h,
  i,
  il,
  instanceColor,
  instanceMatrix,
  jr,
  k,
  l,
  m,
  mr,
  n,
  nl,
  o,
  on,
  p,
  pn,
  q,
  r,
  s,
  sl,
  t,
  tl,
  u,
  ut,
  v,
  w,
  x,
  xr,
  y,
  yr,
  z,
} from "./shared.js";
import { au, cu, eu, iu, lu, nu, ou, ru, su, tu } from "./world.js";

function uu(e, t) {
  let n = e.palette,
    r = {
      body: lu(n.body),
      accent: lu(n.accent),
      skin: lu(n.skin, { roughness: 0.72 }),
      dark: lu(n.dark, { roughness: 0.8 }),
      metal: lu(10133938, { metalness: 0.75, roughness: 0.3 }),
      wood: lu(8014370, { roughness: 0.75 }),
      white: lu(16777215, { roughness: 0.35 }),
      black: lu(1381659, { roughness: 0.4 }),
    };
  t &&
    (r.body.color.offsetHSL(t, 0, 0), r.accent.color.offsetHSL(t * 0.6, 0, 0));
  let i = lu(3351040, { emissive: 16765562, emissiveIntensity: 3 }),
    a = new ut(),
    o = new ut();
  a.add(o);
  let s = (e, t, n, r = 0, i = 0, a = 0, o = 1, s = 1, c = 1) => {
      let l = new Ln(t, n);
      return (
        l.position.set(r, i, a),
        l.scale.set(o, s, c),
        (l.castShadow = !0),
        (l.receiveShadow = !0),
        e.add(l),
        l
      );
    },
    c = [-1, 1].map((e) => {
      let t = new ut();
      return (
        t.position.set(e * 0.13, 0.37, 0),
        s(t, tu(0.09, 0.12), r.dark, 0, -0.13, 0),
        s(t, eu(0.11), r.black, 0, -0.3, 0.05, 1, 0.62, 1.5),
        a.add(t),
        t
      );
    }),
    l = e.id === `titan`,
    u = s(
      o,
      tu(0.235, 0.2),
      r.body,
      0,
      0.6,
      0,
      l ? 1.32 : 1,
      l ? 1.08 : 1,
      l ? 1.12 : 0.86,
    );
  s(
    o,
    nu(0.245, 0.245, 0.075),
    r.dark,
    0,
    0.42,
    0,
    l ? 1.28 : 1,
    1,
    l ? 1.1 : 0.88,
  );
  let d = new ut();
  (d.position.set(0, 1.07, 0), o.add(d));
  let f = s(d, eu(0.3, 24, 18), l ? r.body : r.skin, 0, 0, 0, 1, 0.94, 0.97);
  for (let e of [-1, 1]) {
    (s(d, eu(0.075), r.white, e * 0.115, 0.03, 0.252, 1, 1.2, 0.55),
      s(d, eu(0.04), r.black, e * 0.112, 0.03, 0.29, 1, 1.2, 0.5));
    let t = s(d, ru(0.14, 0.036, 0.04), r.dark, e * 0.115, 0.14, 0.268);
    t.rotation.z = -e * 0.32;
  }
  let p = l ? 0.38 : 0.31,
    m = [-1, 1].map((e) => {
      let t = new ut();
      (t.position.set(e * p, 0.8, 0),
        s(t, tu(0.075, 0.15), l ? r.skin : r.body, 0, -0.12, 0));
      let n = s(
        t,
        eu(l ? 0.165 : 0.095),
        l ? r.accent : r.skin,
        0,
        -0.28,
        0,
        1,
        1,
        l ? 1.12 : 1,
      );
      return ((t.userData.hand = n), o.add(t), t);
    }),
    h = new ut();
  o.add(h);
  let g = [],
    _ = {
      armBase: [
        [0, 0],
        [0, 0],
      ],
      swingArms: !1,
    };
  if (e.id === `dusty`) {
    (s(d, iu(0.325, 0.56), r.accent, 0, 0.02, -0.025),
      s(d, eu(0.13), r.accent, 0, 0.03, -0.34),
      s(d, eu(0.09), r.accent, 0, -0.1, -0.42));
    let e = s(d, au(0.295, 0.034), r.body, 0, 0.1, 0);
    ((e.rotation.x = Math.PI / 2), h.position.set(0.02, 0.63, 0.24));
    for (let e of [-1, 1])
      s(
        h,
        nu(0.045, 0.045, 0.62, 10),
        r.metal,
        e * 0.046,
        0.02,
        0.36,
      ).rotation.x = Math.PI / 2;
    (s(h, ru(0.1, 0.13, 0.34), r.wood, 0, -0.02, -0.06),
      s(h, ru(0.15, 0.085, 0.2), r.wood, 0, -0.04, 0.3),
      g.push(new H(0.02, 0.65, 0.95)),
      (_.armBase = [
        [-1.35, 0.55],
        [-1.2, -0.4],
      ]));
  } else if (e.id === `ace`) {
    (s(d, nu(0.2, 0.235, 0.21), r.accent, 0, 0.29, 0),
      s(d, nu(0.47, 0.47, 0.036, 28), r.accent, 0, 0.19, 0, 1, 1, 0.92),
      s(d, nu(0.24, 0.24, 0.055), r.dark, 0, 0.215, 0));
    let e = s(o, au(0.19, 0.06), r.accent, 0, 0.87, 0.02);
    ((e.rotation.x = Math.PI / 2), h.position.set(0, 0.67, 0.34));
    for (let e of [-1, 1])
      ((s(
        h,
        nu(0.035, 0.035, 0.32, 8),
        r.metal,
        e * 0.27,
        0.025,
        0.18,
      ).rotation.x = Math.PI / 2),
        (s(
          h,
          nu(0.058, 0.058, 0.09, 10),
          r.metal,
          e * 0.27,
          0.025,
          0.03,
        ).rotation.x = Math.PI / 2),
        s(h, ru(0.06, 0.14, 0.075), r.dark, e * 0.27, -0.055, -0.02),
        g.push(new H(e * 0.27, 0.7, 0.72)));
    _.armBase = [
      [-1.45, 0.08],
      [-1.45, -0.08],
    ];
  } else if (e.id === `fuse`) {
    (s(d, iu(0.335, 0.5), r.accent, 0, 0.04, 0),
      s(d, nu(0.365, 0.365, 0.035, 24), r.accent, 0, 0.06, 0.02),
      (s(d, nu(0.078, 0.078, 0.07, 12), r.metal, 0, 0.2, 0.3).rotation.x =
        Math.PI / 2));
    let e = s(d, eu(0.062), i, 0, 0.2, 0.34, 1, 1, 0.4);
    ((e.castShadow = !1),
      s(d, eu(0.2), r.white, 0, -0.17, 0.14, 1.12, 0.8, 0.72),
      h.position.set(0.31, 0.66, 0.36),
      s(h, eu(0.15), r.black),
      s(h, nu(0.035, 0.035, 0.07, 8), r.metal, 0, 0.16, 0));
    let t = s(
      h,
      eu(0.045),
      lu(3347456, { emissive: 16747050, emissiveIntensity: 4 }),
      0.01,
      0.23,
      0,
    );
    ((t.castShadow = !1),
      g.push(new H(0.31, 0.8, 0.4)),
      (_.armBase = [
        [0, 0.12],
        [-1.3, -0.05],
      ]),
      (_.swingLeft = !0));
  } else {
    (s(d, eu(0.2), r.skin, 0, -0.085, 0.2, 1, 0.78, 0.5),
      s(d, ru(0.065, 0.2, 0.44), r.accent, 0, 0.27, -0.02));
    for (let e of [-1, 1]) s(o, eu(0.14), r.accent, e * 0.37, 0.88, 0);
    (f.scale.set(1, 0.96, 1),
      g.push(new H(-0.3, 0.72, 0.55), new H(0.3, 0.72, 0.55)),
      (_.armBase = [
        [-0.95, 0.25],
        [-0.95, -0.25],
      ]),
      (_.punch = !0));
  }
  m.forEach((e, t) => {
    ((e.rotation.x = _.armBase[t][0]), (e.rotation.z = _.armBase[t][1]));
  });
  let v = Object.values(r);
  return {
    root: a,
    body: o,
    head: d,
    torso: u,
    legs: c,
    arms: m,
    weapon: h,
    muzzles: g,
    pose: _,
    flashMats: v,
    allMats: [...v, i],
  };
}
var brawlerId = 1,
  Brawler = class {
    constructor(e, t, n) {
      ((this.game = e),
        (this.def = t),
        (this.id = brawlerId++),
        (this.isPlayer = !!n.isPlayer),
        (this.name = n.name),
        (this.model = uu(t, n.hueShift || 0)),
        (this.root = this.model.root),
        this.root.position.set(n.x, 0, n.z),
        e.scene.add(this.root));
      let r = this.isPlayer ? 4063114 : 16730682;
      if (
        ((this.ring = new Ln(
          ou,
          new Tn({ color: r, transparent: !0, opacity: 0.92, depthWrite: !1 }),
        )),
        (this.ring.position.y = 0.04),
        (this.ring.renderOrder = 2),
        (this.ring.userData.noAO = !0),
        this.root.add(this.ring),
        this.isPlayer)
      ) {
        let e = new Ln(
          su,
          new Tn({ color: r, transparent: !0, opacity: 0.16, depthWrite: !1 }),
        );
        ((e.position.y = 0.035),
          (e.renderOrder = 2),
          (e.userData.noAO = !0),
          this.root.add(e),
          (this.disc = e));
      }
      ((this.superRing = new Ln(
        cu,
        new Tn({
          color: new J(3.2, 2.3, 0.4),
          transparent: !0,
          opacity: 0,
          depthWrite: !1,
          blending: 2,
        }),
      )),
        (this.superRing.position.y = 0.045),
        (this.superRing.renderOrder = 3),
        (this.superRing.userData.noAO = !0),
        this.root.add(this.superRing),
        (this.maxHp = t.hp),
        (this.hp = t.hp),
        (this.ammo = 3),
        (this.reloadT = 0),
        (this.superCharge = 0),
        (this.cubes = 0),
        (this.kills = 0),
        (this.alive = !0),
        (this.deadT = 0),
        (this.rank = 0),
        (this.vel = new V()),
        (this.knock = new V()),
        (this.moveX = 0),
        (this.moveZ = 0),
        (this.facing = Math.atan2(-n.x, -n.z)),
        (this.aimAngle = this.facing),
        (this.aimHold = 0),
        (this.fireCooldown = 0),
        (this.burst = null),
        (this.leap = null),
        (this.muzzleIndex = 0),
        (this.lastCombat = -10),
        (this.lastAttacker = null),
        (this.lastHitTime = -10),
        (this.regenT = 0),
        (this.inBush = !1),
        (this.revealT = 0),
        (this.hidden = !1),
        (this.flash = 0),
        (this.recoil = 0),
        (this.punch = [0, 0]),
        (this.walkPhase = Math.random() * 6),
        (this.squash = 0),
        (this.spawnT = 0),
        (this.lightColor = new J(t.attack.color)),
        (this.superColor = new J(t.super.color)));
    }
    get x() {
      return this.root.position.x;
    }
    get z() {
      return this.root.position.z;
    }
    get damageMul() {
      return 1 + this.cubes * GAME_CONFIG.cubeDamage;
    }
    get superReady() {
      return this.superCharge >= 1;
    }
    get airborne() {
      return this.leap !== null;
    }
    muzzleWorld(e) {
      let t = this.model.muzzles,
        n = t[this.muzzleIndex % t.length],
        r = Math.cos(this.aimAngle),
        i = Math.sin(this.aimAngle);
      return (
        e.set(this.x + n.x * r + n.z * i, n.y, this.z - n.x * i + n.z * r),
        e
      );
    }
    canAct() {
      return this.alive && !this.leap && this.game.state !== `countdown`;
    }
    attack(e, t, n, r) {
      return !this.canAct() ||
        this.ammo < 1 ||
        this.fireCooldown > 0 ||
        this.burst
        ? !1
        : (--this.ammo, this.startVolley(this.def.attack, e, t, n, r, !1), !0);
    }
    useSuper(e, t, n, r) {
      return !this.canAct() || !this.superReady || this.burst
        ? !1
        : ((this.superCharge = 0),
          this.startVolley(this.def.super, e, t, n, r, !0),
          this.game.audio.play(`super`),
          !0);
    }
    startVolley(e, t, n, r, i, a) {
      let o = Math.hypot(t, n) || 1;
      ((t /= o),
        (n /= o),
        (this.aimAngle = Math.atan2(t, n)),
        (this.aimHold = 0.55),
        (this.lastCombat = this.game.elapsed),
        (this.revealT = Math.max(this.revealT, 0.9)),
        (this.fireCooldown = 0.22));
      let s = this.game.combat;
      if (e.kind === `spread`) {
        this.recoil = 1;
        let r = this.muzzleWorld(new H());
        for (let t = 0; t < e.pellets; t++) {
          let n = e.pellets === 1 ? 0 : t / (e.pellets - 1) - 0.5,
            i = this.aimAngle + n * e.spread + (Math.random() - 0.5) * 0.04;
          s.spawnBullet(
            this,
            r.x,
            r.z,
            Math.sin(i),
            Math.cos(i),
            e,
            a,
            e.speed * (0.94 + Math.random() * 0.12),
          );
        }
        (this.game.effects.muzzle(
          r.x,
          r.y,
          r.z,
          t,
          n,
          this.bulletColor(a),
          a ? 1.6 : 1.1,
        ),
          this.game.audio.play(a ? `blastBig` : `blast`, this.x, this.z),
          a && this.knock.set(-t * 3, -n * 3));
      } else if (e.kind === `burst` || e.kind === `melee`)
        ((this.burst = {
          a: e,
          left: e.count,
          timer: 0,
          dirX: t,
          dirZ: n,
          isSuper: a,
        }),
          (this.fireCooldown = e.count * e.interval + 0.12));
      else if (e.kind === `lob`) {
        this.recoil = 1;
        let o = Math.min(e.range, Math.hypot(r - this.x, i - this.z)),
          c = this.muzzleWorld(new H());
        (s.spawnBomb(this, c.x, c.y, c.z, this.x + t * o, this.z + n * o, e, a),
          this.game.audio.play(`lob`, this.x, this.z),
          (this.fireCooldown = 0.3));
      } else if (e.kind === `leap`) {
        let a = $c(Math.hypot(r - this.x, i - this.z), 2, e.range),
          o = this.game.world.nearestOpen(this.x + t * a, this.z + n * a);
        ((this.leap = { a: e, t: 0, sx: this.x, sz: this.z, tx: o.x, tz: o.z }),
          this.game.effects.dust(this.x, this.z, 10, 2.4),
          this.game.audio.play(`leap`, this.x, this.z));
      }
    }
    bulletColor(e) {
      return e ? this.superColor : this.lightColor;
    }
    fireBurstShot() {
      let e = this.burst,
        t = e.a;
      (this.muzzleIndex++, (this.recoil = 1));
      let n = this.muzzleWorld(new H()),
        r =
          Math.atan2(e.dirX, e.dirZ) +
          (Math.random() - 0.5) * 2 * (t.jitter || 0),
        i = Math.sin(r),
        a = Math.cos(r);
      (this.game.combat.spawnBullet(
        this,
        n.x,
        n.z,
        i,
        a,
        t,
        e.isSuper,
        t.speed,
      ),
        t.kind === `melee`
          ? ((this.punch[this.muzzleIndex % 2] = 1),
            this.game.audio.play(`punch`, this.x, this.z))
          : (this.game.effects.muzzle(
              n.x,
              n.y,
              n.z,
              i,
              a,
              this.bulletColor(e.isSuper),
              e.isSuper ? 1.1 : 0.75,
            ),
            this.game.audio.play(
              e.isSuper ? `shotBig` : `shot`,
              this.x,
              this.z,
            )));
    }
    addCharge(e) {
      if (!this.alive) return;
      let t = this.superReady;
      ((this.superCharge = Math.min(
        1,
        this.superCharge + e / this.def.superCharge,
      )),
        !t &&
          this.superReady &&
          this.isPlayer &&
          this.game.audio.play(`ready`));
    }
    takeDamage(e, t, n = !1) {
      if (!this.alive || this.airborne || this.spawnT > 0) return 0;
      (t &&
        !t.isPlayer &&
        (e *= this.isPlayer ? this.game.difficulty.damage : 0.34),
        t && ((this.lastAttacker = t), (this.lastHitTime = this.game.elapsed)),
        (e = Math.round(e)));
      let r = Math.min(this.hp, e);
      return (
        (this.hp -= e),
        (this.lastCombat = this.game.elapsed),
        (this.regenT = 0),
        (this.flash = 1),
        (this.squash = 1),
        (this.revealT = Math.max(this.revealT, 0.9)),
        this.def.id === `titan` && this.addCharge(e * 0.35),
        (!this.hidden || this.isPlayer) &&
          this.game.hud.floatText(
            this.x,
            1.7,
            this.z,
            `${e}`,
            this.isPlayer ? `dmg-self` : `dmg`,
          ),
        t && t !== this && (t.addCharge(r), (t.lastCombat = this.game.elapsed)),
        n || this.game.audio.play(`hit`, this.x, this.z),
        this.isPlayer && this.game.onPlayerHurt(e),
        this.hp <= 0 && this.die(t),
        r
      );
    }
    heal(e) {
      if (!this.alive || this.hp >= this.maxHp) return;
      let t = this.hp;
      this.hp = Math.min(this.maxHp, this.hp + e);
      let n = Math.round(this.hp - t);
      n > 0 &&
        (!this.hidden || this.isPlayer) &&
        (this.game.hud.floatText(this.x, 1.7, this.z, `+${n}`, `heal`),
        this.game.effects.healPuff(this.x, this.z));
    }
    addCube() {
      this.cubes++;
      let e = this.hp / this.maxHp;
      ((this.maxHp += GAME_CONFIG.cubeHp),
        (this.hp = Math.min(
          this.maxHp,
          Math.round(this.maxHp * e) + GAME_CONFIG.cubeHp * 0.5,
        )),
        (this.squash = -1));
    }
    die(e) {
      this.alive &&
        ((this.alive = !1),
        (this.hp = 0),
        (this.deadT = 0),
        (this.burst = null),
        (this.leap = null),
        e && e !== this && e.kills++,
        this.game.onBrawlerDown(this, e));
    }
    update(e) {
      let t = this.game,
        n = this.model;
      if (!this.alive) {
        this.deadT += e;
        let t = $c(1 - this.deadT / 0.32, 0, 1);
        (this.root.scale.setScalar(t),
          (this.root.rotation.y += e * 14),
          t <= 0 && (this.root.visible = !1));
        return;
      }
      if (
        ((this.spawnT = Math.max(0, this.spawnT - e)),
        (this.fireCooldown = Math.max(0, this.fireCooldown - e)),
        (this.aimHold = Math.max(0, this.aimHold - e)),
        (this.revealT = Math.max(0, this.revealT - e)),
        (this.flash = Math.max(0, this.flash - e * 7)),
        (this.recoil = nl(this.recoil, 0, 14, e)),
        (this.punch[0] = nl(this.punch[0], 0, 16, e)),
        (this.punch[1] = nl(this.punch[1], 0, 16, e)),
        (this.squash = nl(this.squash, 0, 12, e)),
        this.ammo < 3
          ? ((this.reloadT += e / this.def.reload),
            this.reloadT >= 1 &&
              ((this.reloadT = 0), (this.ammo = Math.min(3, this.ammo + 1))))
          : (this.reloadT = 0),
        this.burst)
      ) {
        let t = this.burst;
        for (t.timer -= e; t.timer <= 0 && t.left > 0;)
          (this.fireBurstShot(), t.left--, (t.timer += t.a.interval));
        (t.left <= 0 && (this.burst = null),
          (this.aimHold = Math.max(this.aimHold, 0.35)));
      }
      let r = this.root.position;
      if (this.leap) {
        let i = this.leap;
        i.t += e;
        let a = $c(i.t / i.a.flight, 0, 1);
        ((r.x = el(i.sx, i.tx, a)),
          (r.z = el(i.sz, i.tz, a)),
          (r.y = Math.sin(a * Math.PI) * 3.4),
          (n.body.rotation.x = a * Math.PI * 2),
          (this.aimAngle = Math.atan2(i.tx - i.sx, i.tz - i.sz)),
          (this.aimHold = 0.3),
          a >= 1 &&
            ((r.y = 0),
            (n.body.rotation.x = 0),
            (this.leap = null),
            (this.squash = 1.4),
            t.world.resolveCircle(r, COLLISION_RADIUS),
            t.combat.explode(r.x, r.z, i.a, this, !0, !0)));
      } else {
        let n = this.def.speed;
        (this.burst && this.burst.a.kind !== `melee` && (n *= 0.82),
          t.state === `countdown` && (n = 0),
          this.vel.set(this.moveX * n, this.moveZ * n));
        let i = this.knock.x,
          a = this.knock.y;
        ((r.x += (this.vel.x + i) * e), (r.z += (this.vel.y + a) * e));
        let o = Math.exp(-7 * e);
        (this.knock.multiplyScalar(o),
          t.world.resolveCircle(r, COLLISION_RADIUS));
      }
      let i = this.vel.lengthSq() > 0.2 && !this.leap,
        a =
          this.aimHold > 0
            ? this.aimAngle
            : i
              ? Math.atan2(this.vel.x, this.vel.y)
              : this.facing;
      ((this.facing = il(this.facing, a, this.aimHold > 0 ? 26 : 13, e)),
        (this.root.rotation.y = this.facing));
      let o = this.inBush;
      ((this.inBush = !this.leap && t.world.isBushAt(r.x, r.z)),
        this.inBush !== o &&
          (!this.hidden || this.isPlayer) &&
          t.effects.leaves(r.x, r.z, 5),
        t.elapsed - this.lastCombat > 3 &&
          this.hp < this.maxHp &&
          ((this.regenT += e),
          this.regenT >= 1 &&
            ((this.regenT = 0), this.heal(Math.round(this.maxHp * 0.13)))),
        this.animate(e, i));
    }
    animate(e, t) {
      let n = this.model,
        r = this.game.elapsed,
        i = this.vel.length();
      t &&
        ((this.walkPhase += e * i * 3.3),
        Math.sin(this.walkPhase) * Math.sin(this.walkPhase - e * i * 3.3) < 0 &&
          (!this.hidden || this.isPlayer) &&
          !this.inBush &&
          this.game.effects.footDust(this.x, this.z));
      let a = t ? Math.sin(this.walkPhase) * 0.8 : 0;
      ((n.legs[0].rotation.x = nl(n.legs[0].rotation.x, a, 20, e)),
        (n.legs[1].rotation.x = nl(n.legs[1].rotation.x, -a, 20, e)));
      let o = t
          ? Math.abs(Math.cos(this.walkPhase)) * 0.05
          : Math.sin(r * 2.3 + this.id) * 0.012,
        s = this.squash;
      ((n.body.position.y = o - Math.max(0, s) * 0.07),
        n.body.scale.set(1 + s * 0.09, 1 - s * 0.11, 1 + s * 0.09),
        this.leap || (n.body.rotation.x = (t ? 0.13 : 0) - this.recoil * 0.2),
        (n.head.rotation.z = t ? Math.sin(this.walkPhase) * 0.05 : 0),
        (n.weapon.position.z =
          (n.weapon.userData.baseZ ??
            (n.weapon.userData.baseZ = n.weapon.position.z)) -
          this.recoil * 0.17));
      let c = n.pose.armBase;
      if (n.pose.punch)
        for (let e = 0; e < 2; e++) {
          let r = this.punch[e];
          ((n.arms[e].rotation.x =
            c[e][0] -
            r * 0.75 +
            (t ? Math.sin(this.walkPhase + e * Math.PI) * 0.25 : 0)),
            (n.arms[e].position.z = r * 0.42));
        }
      else
        n.pose.swingLeft &&
          ((n.arms[0].rotation.x = c[0][0] + (t ? -a * 0.7 : 0)),
          (n.arms[1].rotation.x = c[1][0] - this.recoil * 1.1));
      let l = this.flash;
      for (let e of n.flashMats) e.emissive.setRGB(l, l * 0.92, l * 0.85);
      let u = this.root.position.y;
      ((this.ring.position.y = 0.04 - u),
        (this.superRing.position.y = 0.045 - u),
        this.disc && (this.disc.position.y = 0.035 - u));
      let d = this.superReady,
        f = this.superRing.material;
      ((f.opacity = nl(f.opacity, d ? 0.55 + Math.sin(r * 6) * 0.25 : 0, 8, e)),
        (this.superRing.visible = f.opacity > 0.01),
        (this.superRing.rotation.y = -this.facing));
    }
    dispose() {
      this.game.scene.remove(this.root);
      for (let e of this.model.allMats) e.dispose();
      (this.ring.material.dispose(),
        this.superRing.material.dispose(),
        this.disc && this.disc.material.dispose());
    }
  },
  pu = new Re(),
  mu = new _e(),
  hu = new H(),
  gu = new H(),
  _u = new Ke(),
  vu = new J(),
  yu = 0.64,
  bu = 360;
function xu() {
  let e = (e) => {
    let t = al(128, 128),
      n = t.getContext(`2d`);
    if (e) ((n.fillStyle = `#000`), n.fillRect(0, 0, 128, 128));
    else {
      ((n.fillStyle = `#5d4a86`), n.fillRect(0, 0, 128, 128));
      for (let e = 0; e < 4; e++)
        ((n.fillStyle = e % 2 ? `#584480` : `#65518f`),
          n.fillRect(0, e * 32, 128, 30));
      ((n.strokeStyle = `#33264f`),
        (n.lineWidth = 16),
        n.strokeRect(8, 8, 112, 112));
    }
    ((n.fillStyle = e ? `#7dffb0` : `#2fe07a`),
      n.beginPath(),
      n.moveTo(72, 22),
      n.lineTo(40, 70),
      n.lineTo(60, 70),
      n.lineTo(52, 106),
      n.lineTo(90, 54),
      n.lineTo(68, 54),
      n.closePath(),
      n.fill(),
      e &&
        ((n.strokeStyle = `#2aff80`),
        (n.lineWidth = 3),
        n.strokeRect(17, 17, 94, 94)));
    let r = new cr(t);
    return ((r.colorSpace = k), r);
  };
  return { map: e(!1), emissiveMap: e(!0) };
}
var Combat = class {
    constructor(e) {
      ((this.game = e),
        (this.bullets = []),
        (this.bombs = []),
        (this.boxes = []),
        (this.cubes = []));
      let t = new xr(1, 10, 8);
      ((this.bulletMesh = new Yn(t, new Tn({ color: 16777215 }), bu)),
        (this.bulletMesh.count = 0),
        (this.bulletMesh.frustumCulled = !1),
        (this.bulletMesh.userData.noAO = !0),
        this.bulletMesh.setColorAt(0, vu.set(1, 1, 1)),
        e.scene.add(this.bulletMesh),
        (this.bombPool = []));
      let n = new xr(0.2, 16, 12),
        r = new Nr({ color: 1776418, roughness: 0.35, metalness: 0.3 }),
        i = new xr(0.07, 8, 6);
      for (let t = 0; t < 14; t++) {
        let t = new ut(),
          a = new Ln(n, r);
        a.castShadow = !0;
        let o = new Ln(i, new Tn({ color: new J(6, 2.4, 0.5) }));
        (o.position.set(0, 0.24, 0),
          (o.userData.noAO = !0),
          t.add(a, o),
          (t.visible = !1),
          e.scene.add(t));
        let s = new Ln(
            new br(0.93, 1, 56).rotateX(-Math.PI / 2),
            new Tn({
              color: 16728112,
              transparent: !0,
              opacity: 0,
              depthWrite: !1,
            }),
          ),
          c = new Ln(
            new mr(0.93, 48).rotateX(-Math.PI / 2),
            new Tn({
              color: 16728112,
              transparent: !0,
              opacity: 0,
              depthWrite: !1,
            }),
          );
        (s.add(c),
          (s.position.y = 0.05),
          (s.visible = !1),
          (s.userData.noAO = !0),
          (s.renderOrder = 2),
          e.scene.add(s),
          this.bombPool.push({
            group: t,
            ring: s,
            fillDisc: c,
            spark: o,
            busy: !1,
          }));
      }
      let a = xu();
      ((this.boxGeo = new fr(0.92, 0.92, 0.92)),
        (this.boxTex = a),
        (this.cubeGeo = new fr(0.34, 0.34, 0.34)),
        (this.cubeMat = new Nr({
          color: 1870410,
          emissive: 3211136,
          emissiveIntensity: 2.4,
          roughness: 0.25,
          metalness: 0.2,
        })),
        (this.cubeLight = new J(4259722)),
        (this.orange = new J(16747066)));
    }
    addBox(e, t) {
      let n = this.game.world,
        r = new Nr({
          map: this.boxTex.map,
          emissiveMap: this.boxTex.emissiveMap,
          emissive: 16777215,
          emissiveIntensity: 1.4,
          roughness: 0.7,
        }),
        i = new Ln(this.boxGeo, r);
      (i.position.set(n.center(e), 0.46, n.center(t)),
        (i.castShadow = !0),
        (i.receiveShadow = !0),
        this.game.scene.add(i),
        n.setBlocker(e, t, !0));
      let a = {
        tx: e,
        ty: t,
        x: i.position.x,
        z: i.position.z,
        hp: GAME_CONFIG.boxHp,
        maxHp: GAME_CONFIG.boxHp,
        mesh: i,
        mat: r,
        shake: 0,
        alive: !0,
        isBox: !0,
      };
      return (this.boxes.push(a), a);
    }
    boxAt(e, t) {
      for (let n of this.boxes)
        if (n.alive && n.tx === e && n.ty === t) return n;
      return null;
    }
    damageBox(e, t, n) {
      e.alive &&
        ((e.hp -= t),
        (e.shake = 1),
        this.game.hud.floatText(e.x, 1.2, e.z, `${Math.round(t)}`, `dmg`),
        n && (n.lastCombat = this.game.elapsed),
        e.hp <= 0 &&
          ((e.alive = !1),
          this.game.scene.remove(e.mesh),
          e.mat.dispose(),
          this.game.world.setBlocker(e.tx, e.ty, !1),
          this.game.effects.debris(e.x, 0.5, e.z, 6968470, 9),
          this.game.effects.burst(e.x, 0.6, e.z, this.cubeLight, 16, 4.5),
          this.game.effects.flash(e.x, 0.8, e.z, this.cubeLight, 9, 6, 0.3),
          this.game.audio.play(`crate`, e.x, e.z),
          this.spawnCube(e.x, e.z, e.x, e.z)));
    }
    spawnCube(e, t, n, r) {
      let i = new Ln(this.cubeGeo, this.cubeMat);
      ((i.castShadow = !0),
        i.position.set(e, 0.5, t),
        this.game.scene.add(i),
        this.cubes.push({
          mesh: i,
          sx: e,
          sz: t,
          x: n,
          z: r,
          t: 0,
          alive: !0,
          phase: Math.random() * 6,
        }));
    }
    dropCubes(e, t, n) {
      let r = this.game.world;
      for (let i = 0; i < n; i++) {
        let a = (i / n) * Math.PI * 2 + Math.random(),
          o = n === 1 ? 0 : 0.7 + Math.random() * 0.5,
          s = r.nearestOpen(e + Math.cos(a) * o, t + Math.sin(a) * o);
        this.spawnCube(e, t, s.x, s.z);
      }
    }
    spawnBullet(e, t, n, r, i, a, o, s) {
      if (this.bullets.length >= bu) return;
      let c = e.bulletColor(o).clone();
      this.bullets.push({
        owner: e,
        x: t,
        z: n,
        dx: r,
        dz: i,
        a,
        isSuper: o,
        speed: s,
        travel: 0,
        range: a.range,
        radius: a.radius,
        damage: a.damage * e.damageMul,
        color: c,
        alive: !0,
        trail: 0,
        melee: a.kind === `melee`,
      });
    }
    spawnBomb(e, t, n, r, i, a, o, s) {
      let c = this.bombPool.find((e) => !e.busy);
      if (!c) return;
      ((c.busy = !0),
        (c.group.visible = !0),
        c.group.position.set(t, n, r),
        c.group.scale.setScalar(o.big ? 1.75 : 1),
        (c.ring.visible = !0),
        c.ring.position.set(i, 0.05, a),
        c.ring.scale.setScalar(o.blast));
      let l = s ? 16761402 : 16728112;
      (c.ring.material.color.set(l),
        c.fillDisc.material.color.set(l),
        this.bombs.push({
          owner: e,
          slot: c,
          sx: t,
          sy: n,
          sz: r,
          tx: i,
          tz: a,
          a: o,
          isSuper: s,
          t: 0,
          fuse: o.fuse,
          landed: !1,
          damage: o.damage * e.damageMul,
          color: e.bulletColor(s).clone(),
        }));
    }
    breakTile(e, t) {
      let n = this.game,
        r = n.world.destroyTile(e, t);
      r &&
        (r.type === TileType.BUSH
          ? n.effects.leaves(r.x, r.z, 14)
          : (n.effects.debris(
              r.x,
              0.6,
              r.z,
              [12166540, 11565628, 10116910, 5216842][r.style] ?? 12166540,
              10,
            ),
            n.effects.dust(r.x, r.z, 8, 2.2),
            n.audio.play(`crate`, r.x, r.z)));
    }
    explode(e, t, n, r, i, a = !1) {
      let o = this.game,
        s = o.world,
        c = n.blast,
        l = n.damage * r.damageMul;
      for (let i of o.brawlers) {
        if (!i.alive || i === r || i.airborne) continue;
        let a = Math.hypot(i.x - e, i.z - t);
        if (!(a > c + 0.24) && (i.takeDamage(l, r), n.knockback)) {
          let r = n.knockback * (1 - (a / (c + 0.5)) * 0.5),
            o = a > 0.01 ? (i.x - e) / a : 1,
            s = a > 0.01 ? (i.z - t) / a : 0;
          i.knock.set(o * r, s * r);
        }
      }
      for (let n of this.boxes)
        n.alive &&
          Math.hypot(n.x - e, n.z - t) < c + 0.4 &&
          this.damageBox(n, l, r);
      if (n.breaksWalls) {
        let n = Math.ceil(c),
          r = s.toTile(e),
          i = s.toTile(t);
        for (let a = -n; a <= n; a++)
          for (let o = -n; o <= n; o++) {
            let n = s.center(r + o),
              l = s.center(i + a);
            Math.hypot(n - e, l - t) < c - 0.25 && this.breakTile(r + o, i + a);
          }
      }
      (a
        ? o.effects.slam(e, t, c, r.superColor)
        : o.effects.explosion(
            e,
            t,
            c,
            n.big ? r.superColor : this.orange,
            !!n.big,
          ),
        o.shake(n.big || a ? 0.55 : 0.24, e, t),
        o.audio.play(n.big || a ? `boomBig` : `boom`, e, t));
    }
    update(e) {
      let t = this.game,
        n = t.world,
        r = t.lighting,
        i = t.effects,
        a = COLLISION_RADIUS + 0.06,
        o = 0;
      for (let s of this.bullets) {
        let c = s.speed * e;
        for (; c > 0 && s.alive;) {
          let e = Math.min(c, 0.2);
          ((c -= e), (s.x += s.dx * e), (s.z += s.dz * e), (s.travel += e));
          let r = n.toTile(s.x),
            o = n.toTile(s.z);
          if (n.blocksShots(r, o)) {
            let e = this.boxAt(r, o);
            if (
              (e
                ? (this.damageBox(e, s.damage, s.owner), (s.alive = !1))
                : s.a.breaksWalls && n.isBreakable(r, o)
                  ? (this.breakTile(r, o), s.a.pierce || (s.alive = !1))
                  : (s.alive = !1),
              !s.alive)
            ) {
              i.impact(
                s.x - s.dx * 0.12,
                yu,
                s.z - s.dz * 0.12,
                s.color,
                s.melee ? 3 : 6,
              );
              break;
            }
          } else
            s.a.breaksWalls &&
              n.tiles[o * 44 + r] === TileType.BUSH &&
              this.breakTile(r, o);
          for (let e of t.brawlers) {
            if (!e.alive || e === s.owner || e.airborne) continue;
            let t = e.x - s.x,
              n = e.z - s.z,
              r = a + s.radius;
            if (!(t * t + n * n > r * r)) {
              (e.takeDamage(s.damage, s.owner),
                s.a.knockback
                  ? e.knock.set(s.dx * s.a.knockback, s.dz * s.a.knockback)
                  : e.knock.set(e.knock.x + s.dx * 1.2, e.knock.y + s.dz * 1.2),
                i.impact(s.x, yu, s.z, s.color, 8),
                i.flash(s.x, yu, s.z, s.color, 5, 4, 0.12),
                (s.alive = !1));
              break;
            }
          }
          s.alive &&
            s.travel >= s.range &&
            ((s.alive = !1), i.impact(s.x, yu, s.z, s.color, 2));
        }
        if (!s.alive) continue;
        let l = $c((s.range - s.travel) / 0.8, 0.35, 1),
          u = s.melee ? s.radius * 1.2 : s.radius * (s.isSuper ? 3.6 : 3),
          d = s.radius * (s.melee ? 1 : 0.8) * l;
        (_u.set(0, Math.atan2(s.dx, s.dz), 0),
          mu.setFromEuler(_u),
          pu.compose(
            hu.set(s.x, yu, s.z),
            mu,
            gu.set(d, d * (s.melee ? 0.7 : 1), u),
          ),
          this.bulletMesh.setMatrixAt(o, pu));
        let f = s.isSuper ? 3.6 : 2.8;
        (this.bulletMesh.setColorAt(
          o,
          vu.copy(s.color).multiplyScalar(f * (s.melee ? 0.6 : 1)),
        ),
          o++);
        let p = s.a.kind === `spread` ? 1.6 / s.a.pellets : s.melee ? 0.5 : 1;
        (r.addLight(s.x, yu, s.z, s.color, (s.isSuper ? 2.6 : 1.9) * p, 4.2),
          (s.trail -= e),
          s.trail <= 0 &&
            ((s.trail = 0.03),
            i.trail(s.x, yu, s.z, s.color, s.radius * (s.melee ? 2.2 : 1.6))));
      }
      ((this.bullets = this.bullets.filter((e) => e.alive)),
        (this.bulletMesh.count = o),
        (this.bulletMesh.instanceMatrix.needsUpdate = !0),
        this.bulletMesh.instanceColor &&
          (this.bulletMesh.instanceColor.needsUpdate = !0));
      for (let n of this.bombs) {
        let a = n.slot,
          o = n.a;
        if (n.landed)
          ((n.fuse -= e), (a.group.position.y = 0.2 * a.group.scale.x));
        else {
          n.t += e;
          let t = $c(n.t / o.flight, 0, 1),
            r = o.big ? 4.4 : 3.3,
            s = el(n.sy, 0.2, t) + Math.sin(t * Math.PI) * r;
          (a.group.position.set(el(n.sx, n.tx, t), s, el(n.sz, n.tz, t)),
            (a.group.rotation.x += e * 9),
            (a.group.rotation.z += e * 5),
            t >= 1 && ((n.landed = !0), i.dust(n.tx, n.tz, 4, 1.4)));
        }
        let s = n.landed ? 1 - $c(n.fuse / o.fuse, 0, 1) : 0,
          c = 0.5 + 0.5 * Math.sin(t.elapsed * (14 + s * 30));
        (a.spark.scale.setScalar(0.8 + c * 0.9),
          (a.ring.material.opacity = 0.55 + c * 0.35),
          (a.fillDisc.material.opacity = 0.1 + s * 0.22));
        let l = a.group.position;
        (r.addLight(l.x, l.y + 0.3, l.z, this.orange, 2.2 + c * 2.5, 4),
          Math.random() < e * 40 &&
            i.spark(l.x, l.y + 0.25 * a.group.scale.x, l.z, this.orange),
          n.landed &&
            n.fuse <= 0 &&
            ((n.done = !0),
            (a.busy = !1),
            (a.group.visible = !1),
            (a.ring.visible = !1),
            this.explode(n.tx, n.tz, o, n.owner, n.isSuper)));
      }
      this.bombs = this.bombs.filter((e) => !e.done);
      for (let n of this.boxes) {
        if (!n.alive) continue;
        n.shake = Math.max(0, n.shake - e * 5);
        let i = n.shake;
        ((n.mesh.rotation.z = Math.sin(t.elapsed * 60) * 0.09 * i),
          n.mesh.scale.setScalar(1 + i * 0.08),
          (n.mat.emissiveIntensity = 1.1 + r.night * 1.6 + i * 3));
      }
      for (let n of this.cubes) {
        n.t += e;
        let a = $c(n.t / 0.45, 0, 1),
          o = el(n.sx, n.x, a),
          s = el(n.sz, n.z, a),
          c =
            0.42 +
            Math.sin(a * Math.PI) * 1.1 +
            (a >= 1 ? Math.sin(t.elapsed * 3 + n.phase) * 0.08 : 0);
        if (
          (n.mesh.position.set(o, c, s),
          n.mesh.rotation.set(0.6, t.elapsed * 1.8 + n.phase, 0.6),
          r.addLight(o, c + 0.1, s, this.cubeLight, 1.6 + r.night * 1.6, 3.4),
          !(a < 1))
        ) {
          for (let e of t.brawlers)
            if (
              e.alive &&
              !e.airborne &&
              Math.hypot(e.x - n.x, e.z - n.z) < 0.78
            ) {
              ((n.alive = !1),
                e.addCube(),
                t.scene.remove(n.mesh),
                i.burst(n.x, 0.7, n.z, this.cubeLight, 12, 3.5),
                i.flash(n.x, 0.8, n.z, this.cubeLight, 7, 5, 0.25),
                (!e.hidden || e.isPlayer) &&
                  t.hud.floatText(e.x, 2, e.z, `POWER UP!`, `power`),
                t.audio.play(`pickup`, n.x, n.z));
              break;
            }
        }
      }
      this.cubes = this.cubes.filter((e) => e.alive);
    }
    clear() {
      let e = this.game.scene;
      ((this.bullets.length = 0), (this.bulletMesh.count = 0));
      for (let e of this.bombs)
        ((e.slot.busy = !1),
          (e.slot.group.visible = !1),
          (e.slot.ring.visible = !1));
      this.bombs.length = 0;
      for (let t of this.boxes) (t.alive && e.remove(t.mesh), t.mat.dispose());
      this.boxes.length = 0;
      for (let t of this.cubes) e.remove(t.mesh);
      this.cubes.length = 0;
    }
  },
  Cu = new Re(),
  wu = new _e(),
  Tu = new H(),
  Eu = new H(),
  Du = new Ke(),
  Ou = new J(),
  ku = `
  attribute vec4 aColor;
  attribute float aSize;
  uniform float uScale;
  varying vec4 vColor;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uScale / max( 0.1, - mv.z );
  }`,
  Au = `
  uniform float uDim;
  varying vec4 vColor;
  void main() {
    float d = length( gl_PointCoord - 0.5 );
    float a = smoothstep( 0.5, 0.12, d ) * vColor.a;
    if ( a < 0.004 ) discard;
    gl_FragColor = vec4( vColor.rgb * uDim, a );
  }`,
  ju = class {
    constructor(e, t, n) {
      ((this.cap = t), (this.cursor = 0), (this.additive = n));
      let r = t;
      ((this.pos = new Float32Array(r * 3)),
        (this.col = new Float32Array(r * 4)),
        (this.size = new Float32Array(r)),
        (this.vel = new Float32Array(r * 3)),
        (this.life = new Float32Array(r)),
        (this.maxLife = new Float32Array(r)),
        (this.size0 = new Float32Array(r)),
        (this.size1 = new Float32Array(r)),
        (this.alpha = new Float32Array(r)),
        (this.drag = new Float32Array(r)),
        (this.grav = new Float32Array(r)));
      let i = new pn();
      (i.setAttribute(`position`, new Zt(this.pos, 3).setUsage(N)),
        i.setAttribute(`aColor`, new Zt(this.col, 4).setUsage(N)),
        i.setAttribute(`aSize`, new Zt(this.size, 1).setUsage(N)),
        (this.material = new jr({
          uniforms: { uScale: { value: 600 }, uDim: { value: 1 } },
          vertexShader: ku,
          fragmentShader: Au,
          transparent: !0,
          depthWrite: !1,
          blending: n ? 2 : 1,
        })),
        (this.points = new ar(i, this.material)),
        (this.points.frustumCulled = !1),
        (this.points.renderOrder = n ? 8 : 7),
        e.add(this.points));
    }
    emit(e, t, n, r, i, a, o, s, c, l, u, d, f = 1, p = 1.5, m = 0) {
      let h = this.cursor;
      ((this.cursor = (h + 1) % this.cap),
        (this.pos[h * 3] = e),
        (this.pos[h * 3 + 1] = t),
        (this.pos[h * 3 + 2] = n),
        (this.vel[h * 3] = r),
        (this.vel[h * 3 + 1] = i),
        (this.vel[h * 3 + 2] = a),
        (this.life[h] = o),
        (this.maxLife[h] = o),
        (this.size0[h] = s),
        (this.size1[h] = c),
        (this.col[h * 4] = l),
        (this.col[h * 4 + 1] = u),
        (this.col[h * 4 + 2] = d),
        (this.alpha[h] = f),
        (this.drag[h] = p),
        (this.grav[h] = m));
    }
    update(e) {
      let {
        pos: t,
        vel: n,
        life: r,
        maxLife: i,
        size: a,
        size0: o,
        size1: s,
        col: c,
        alpha: l,
        drag: u,
        grav: d,
      } = this;
      for (let f = 0; f < this.cap; f++) {
        if (r[f] <= 0) {
          a[f] = 0;
          continue;
        }
        r[f] -= e;
        let p = 1 - Math.max(0, r[f]) / i[f],
          m = Math.exp(-u[f] * e);
        ((n[f * 3] *= m),
          (n[f * 3 + 1] = n[f * 3 + 1] * m - d[f] * e),
          (n[f * 3 + 2] *= m),
          (t[f * 3] += n[f * 3] * e),
          (t[f * 3 + 1] += n[f * 3 + 1] * e),
          (t[f * 3 + 2] += n[f * 3 + 2] * e),
          t[f * 3 + 1] < 0.03 &&
            d[f] > 0 &&
            ((t[f * 3 + 1] = 0.03), (n[f * 3 + 1] *= -0.35)),
          (a[f] = r[f] <= 0 ? 0 : o[f] + (s[f] - o[f]) * p),
          (c[f * 4 + 3] = l[f] * (1 - p * p)));
      }
      let f = this.points.geometry;
      ((f.attributes.position.needsUpdate = !0),
        (f.attributes.aColor.needsUpdate = !0),
        (f.attributes.aSize.needsUpdate = !0));
    }
  };
function Mu() {
  let e = al(128, 128),
    t = e.getContext(`2d`),
    n = t.createRadialGradient(64, 64, 4, 64, 64, 62);
  (n.addColorStop(0, `rgba(10,6,4,0.85)`),
    n.addColorStop(0.45, `rgba(14,9,6,0.6)`),
    n.addColorStop(0.8, `rgba(20,12,8,0.18)`),
    n.addColorStop(1, `rgba(20,12,8,0)`),
    (t.fillStyle = n),
    t.fillRect(0, 0, 128, 128));
  for (let e = 0; e < 26; e++) {
    let e = Math.random() * 6.28,
      n = 20 + Math.random() * 38;
    ((t.fillStyle = `rgba(8,5,3,0.35)`),
      t.beginPath(),
      t.arc(
        64 + Math.cos(e) * n,
        64 + Math.sin(e) * n,
        2 + Math.random() * 5,
        0,
        7,
      ),
      t.fill());
  }
  return new cr(e);
}
var Effects = class {
    constructor(e) {
      this.game = e;
      let t = e.scene;
      ((this.glow = new ju(t, 1800, !0)),
        (this.smoke = new ju(t, 900, !1)),
        (this.flashes = []),
        (this.debrisCap = 140),
        (this.debrisMesh = new Yn(
          new fr(1, 1, 1),
          new Nr({ color: 16777215, roughness: 0.85 }),
          this.debrisCap,
        )),
        (this.debrisMesh.castShadow = !0),
        (this.debrisMesh.receiveShadow = !0),
        (this.debrisMesh.frustumCulled = !1),
        (this.debrisData = []));
      for (let e = 0; e < this.debrisCap; e++)
        (this.debrisData.push({
          life: 0,
          x: 0,
          y: 0,
          z: 0,
          vx: 0,
          vy: 0,
          vz: 0,
          rx: 0,
          ry: 0,
          rz: 0,
          wx: 0,
          wy: 0,
          wz: 0,
          s: 0.1,
        }),
          this.debrisMesh.setMatrixAt(e, Cu.makeScale(0, 0, 0)),
          this.debrisMesh.setColorAt(e, Ou.set(16777215)));
      ((this.debrisCursor = 0), t.add(this.debrisMesh), (this.decals = []));
      let n = Mu(),
        r = new yr(1, 1).rotateX(-Math.PI / 2);
      for (let e = 0; e < 18; e++) {
        let e = new Ln(
          r,
          new Tn({
            map: n,
            transparent: !0,
            opacity: 0,
            depthWrite: !1,
            color: 0,
          }),
        );
        ((e.visible = !1),
          (e.renderOrder = 1),
          (e.userData.noAO = !0),
          t.add(e),
          this.decals.push({ mesh: e, life: 0 }));
      }
      ((this.decalCursor = 0), (this.rings = []));
      let i = new br(0.82, 1, 64).rotateX(-Math.PI / 2);
      for (let e = 0; e < 10; e++) {
        let e = new Ln(
          i,
          new Tn({
            color: 16777215,
            transparent: !0,
            opacity: 0,
            depthWrite: !1,
            blending: 2,
          }),
        );
        ((e.visible = !1),
          (e.renderOrder = 6),
          (e.userData.noAO = !0),
          t.add(e),
          this.rings.push({ mesh: e, t: 0, T: 0, r: 1 }));
      }
      ((this.ringCursor = 0), this.buildFireflies());
    }
    buildFireflies() {
      let e = this.game.world,
        t = [],
        n = e.meshes.bush,
        r = new Float32Array(270),
        i = new Float32Array(90),
        a = new Re();
      for (let e = 0; e < 90; e++)
        (n && n.count > 0
          ? (n.getMatrixAt(Math.floor(Math.random() * n.count), a),
            Tu.setFromMatrixPosition(a))
          : Tu.set(Q(-18, 18), 0, Q(-18, 18)),
          (r[e * 3] = Tu.x + Q(-1.4, 1.4)),
          (r[e * 3 + 1] = Q(0.5, 1.9)),
          (r[e * 3 + 2] = Tu.z + Q(-1.4, 1.4)),
          (i[e] = Math.random() * 100),
          t.push(e));
      let o = new pn();
      (o.setAttribute(`position`, new Zt(r, 3)),
        o.setAttribute(`aPhase`, new Zt(i, 1)),
        (this.fireflyMat = new jr({
          uniforms: {
            uTime: { value: 0 },
            uNight: { value: 0 },
            uScale: { value: 600 },
          },
          vertexShader: `
        attribute float aPhase;
        uniform float uTime; uniform float uScale;
        varying float vBlink;
        void main() {
          vec3 p = position;
          p.x += sin( uTime * 0.6 + aPhase ) * 0.7 + sin( uTime * 1.3 + aPhase * 2.0 ) * 0.25;
          p.y += sin( uTime * 0.9 + aPhase * 1.7 ) * 0.3;
          p.z += cos( uTime * 0.5 + aPhase * 1.3 ) * 0.7;
          vBlink = pow( clamp( 0.5 + 0.5 * sin( uTime * 2.2 + aPhase * 5.0 ), 0.0, 1.0 ), 3.0 );
          vec4 mv = modelViewMatrix * vec4( p, 1.0 );
          gl_Position = projectionMatrix * mv;
          gl_PointSize = ( 0.1 + vBlink * 0.12 ) * uScale / max( 0.1, - mv.z );
        }`,
          fragmentShader: `
        uniform float uNight;
        varying float vBlink;
        void main() {
          float d = length( gl_PointCoord - 0.5 );
          float a = smoothstep( 0.5, 0.0, d );
          gl_FragColor = vec4( vec3( 1.6, 2.4, 0.5 ) * ( 0.4 + vBlink * 3.0 ), a * a * uNight );
        }`,
          transparent: !0,
          depthWrite: !1,
          blending: 2,
        })),
        (this.fireflies = new ar(o, this.fireflyMat)),
        (this.fireflies.frustumCulled = !1),
        (this.fireflies.renderOrder = 9),
        this.game.scene.add(this.fireflies));
    }
    rebuildFireflies() {
      (this.game.scene.remove(this.fireflies),
        this.fireflies.geometry.dispose(),
        this.fireflyMat.dispose(),
        this.buildFireflies());
    }
    flash(e, t, n, r, i, a, o) {
      this.flashes.push({
        x: e,
        y: t,
        z: n,
        color: r,
        intensity: i,
        distance: a,
        t: 0,
        T: o,
      });
    }
    spark(e, t, n, r) {
      this.glow.emit(
        e,
        t,
        n,
        Q(-1.4, 1.4),
        Q(0.6, 2.6),
        Q(-1.4, 1.4),
        Q(0.18, 0.4),
        0.14,
        0.02,
        r.r * 5,
        r.g * 5,
        r.b * 5,
        1,
        2,
        7,
      );
    }
    trail(e, t, n, r, i) {
      this.glow.emit(
        e + Q(-0.04, 0.04),
        t + Q(-0.04, 0.04),
        n + Q(-0.04, 0.04),
        0,
        0,
        0,
        0.15,
        i * 1.35,
        0.02,
        r.r * 1.15,
        r.g * 1.15,
        r.b * 1.15,
        0.5,
        0,
        0,
      );
    }
    impact(e, t, n, r, i) {
      for (let a = 0; a < i; a++) {
        let i = Math.random() * 6.28,
          a = Q(1.5, 5);
        this.glow.emit(
          e,
          t,
          n,
          Math.cos(i) * a,
          Q(0.5, 3.5),
          Math.sin(i) * a,
          Q(0.15, 0.35),
          0.15,
          0.02,
          r.r * 3.2,
          r.g * 3.2,
          r.b * 3.2,
          1,
          3,
          9,
        );
      }
      this.glow.emit(
        e,
        t,
        n,
        0,
        0,
        0,
        0.1,
        0.7,
        0.2,
        r.r * 1.6,
        r.g * 1.6,
        r.b * 1.6,
        0.8,
        0,
        0,
      );
    }
    burst(e, t, n, r, i, a) {
      for (let o = 0; o < i; o++) {
        let i = Math.random() * 6.28,
          o = Q(0.4, 1) * a;
        this.glow.emit(
          e,
          t,
          n,
          Math.cos(i) * o,
          Q(1, 4.5),
          Math.sin(i) * o,
          Q(0.35, 0.7),
          0.2,
          0.03,
          r.r * 4,
          r.g * 4,
          r.b * 4,
          1,
          2.2,
          8,
        );
      }
    }
    muzzle(e, t, n, r, i, a, o) {
      (this.flash(e + r * 0.2, t + 0.1, n + i * 0.2, a, 6.5 * o, 5.5, 0.09),
        this.glow.emit(
          e + r * 0.1,
          t,
          n + i * 0.1,
          r * 1.5,
          0,
          i * 1.5,
          0.07,
          0.95 * o,
          0.3,
          a.r * 3,
          a.g * 3,
          a.b * 3,
          1,
          0,
          0,
        ));
      for (let o = 0; o < 5; o++) {
        let o = 0.5,
          s = r * Q(4, 9) + Q(-0.5, o) * 3,
          c = i * Q(4, 9) + Q(-0.5, o) * 3;
        this.glow.emit(
          e,
          t,
          n,
          s,
          Q(-0.5, 1.5),
          c,
          Q(0.08, 0.2),
          0.13,
          0.02,
          a.r * 5,
          a.g * 5,
          a.b * 5,
          1,
          4,
          3,
        );
      }
      this.smoke.emit(
        e + r * 0.15,
        t + 0.05,
        n + i * 0.15,
        r * 0.9,
        0.5,
        i * 0.9,
        0.5,
        0.25,
        0.7,
        0.8,
        0.8,
        0.8,
        0.3,
        1.5,
        -0.3,
      );
    }
    dust(e, t, n, r) {
      for (let i = 0; i < n; i++) {
        let n = Math.random() * 6.28,
          i = Q(0.4, 1) * r;
        this.smoke.emit(
          e + Math.cos(n) * 0.2,
          0.12,
          t + Math.sin(n) * 0.2,
          Math.cos(n) * i,
          Q(0.2, 0.9),
          Math.sin(n) * i,
          Q(0.5, 0.95),
          0.35,
          1.1,
          0.78,
          0.66,
          0.47,
          0.42,
          2.4,
          -0.2,
        );
      }
    }
    footDust(e, t) {
      this.smoke.emit(
        e + Q(-0.1, 0.1),
        0.06,
        t + Q(-0.1, 0.1),
        Q(-0.2, 0.2),
        0.35,
        Q(-0.2, 0.2),
        0.42,
        0.16,
        0.5,
        0.8,
        0.68,
        0.48,
        0.3,
        2,
        -0.1,
      );
    }
    leaves(e, t, n) {
      for (let r = 0; r < n; r++) {
        let n = Math.random() * 6.28;
        this.smoke.emit(
          e + Q(-0.3, 0.3),
          Q(0.3, 0.9),
          t + Q(-0.3, 0.3),
          Math.cos(n) * Q(0.6, 2.2),
          Q(1.2, 3),
          Math.sin(n) * Q(0.6, 2.2),
          Q(0.5, 0.9),
          0.17,
          0.1,
          0.3,
          0.72,
          0.22,
          0.95,
          1.6,
          6,
        );
      }
    }
    healPuff(e, t) {
      for (let n = 0; n < 5; n++)
        this.glow.emit(
          e + Q(-0.4, 0.4),
          Q(0.4, 1.2),
          t + Q(-0.4, 0.4),
          0,
          Q(0.8, 1.6),
          0,
          Q(0.4, 0.7),
          0.16,
          0.04,
          0.5,
          3.2,
          0.9,
          0.9,
          0.5,
          0,
        );
    }
    debris(e, t, n, r, i) {
      for (let a = 0; a < i; a++) {
        let i = this.debrisCursor;
        this.debrisCursor = (i + 1) % this.debrisCap;
        let a = this.debrisData[i],
          o = Math.random() * 6.28,
          s = Q(1.2, 4.2);
        ((a.life = Q(1.6, 2.6)),
          (a.x = e + Q(-0.3, 0.3)),
          (a.y = t + Q(-0.2, 0.4)),
          (a.z = n + Q(-0.3, 0.3)),
          (a.vx = Math.cos(o) * s),
          (a.vy = Q(3, 7)),
          (a.vz = Math.sin(o) * s),
          (a.rx = Q(0, 6)),
          (a.ry = Q(0, 6)),
          (a.rz = Q(0, 6)),
          (a.wx = Q(-9, 9)),
          (a.wy = Q(-9, 9)),
          (a.wz = Q(-9, 9)),
          (a.s = Q(0.12, 0.27)),
          Ou.set(r).offsetHSL(0, 0, Q(-0.06, 0.06)),
          this.debrisMesh.setColorAt(i, Ou));
      }
      this.debrisMesh.instanceColor.needsUpdate = !0;
    }
    ring(e, t, n, r, i = 0.4, a = 3) {
      let o = this.rings[this.ringCursor];
      ((this.ringCursor = (this.ringCursor + 1) % this.rings.length),
        (o.t = 0),
        (o.T = i),
        (o.r = n),
        (o.mesh.visible = !0),
        o.mesh.position.set(e, 0.09, t),
        o.mesh.material.color.copy(r).multiplyScalar(a));
    }
    decal(e, t, n) {
      let r = this.decals[this.decalCursor];
      ((this.decalCursor = (this.decalCursor + 1) % this.decals.length),
        (r.life = 14),
        (r.mesh.visible = !0),
        r.mesh.position.set(e, 0.022 + this.decalCursor * 8e-4, t),
        (r.mesh.rotation.y = Math.random() * 6.28),
        r.mesh.scale.setScalar(n * 1.9));
    }
    explosion(e, t, n, r, i) {
      let a = i ? 46 : 24;
      (this.flash(e, 1.1, t, r, i ? 95 : 48, i ? 15 : 10, i ? 0.5 : 0.34),
        this.ring(e, t, n * 1.15, r, i ? 0.5 : 0.36),
        this.decal(e, t, n * 0.85),
        this.glow.emit(
          e,
          0.6,
          t,
          0,
          0.5,
          0,
          0.22,
          n * 3.2,
          n * 0.8,
          r.r * 6,
          r.g * 5,
          r.b * 4,
          1,
          0,
          0,
        ));
      for (let r = 0; r < a; r++) {
        let r = Math.random() * 6.28,
          i = Q(0.3, 1) * n * 4.2,
          a = Math.random();
        this.glow.emit(
          e,
          0.4,
          t,
          Math.cos(r) * i,
          Q(1, 6),
          Math.sin(r) * i,
          Q(0.3, 0.75),
          Q(0.25, 0.6),
          0.04,
          (1 + a) * 3.2,
          (0.4 + a * 0.6) * 3,
          0.75,
          1,
          2.6,
          6,
        );
      }
      for (let r = 0; r < (i ? 16 : 9); r++) {
        let r = Math.random() * 6.28,
          i = Q(0.2, 1) * n * 1.6;
        this.smoke.emit(
          e + Math.cos(r) * 0.3,
          Q(0.3, 0.9),
          t + Math.sin(r) * 0.3,
          Math.cos(r) * i,
          Q(0.8, 2.6),
          Math.sin(r) * i,
          Q(0.9, 1.7),
          n * 0.7,
          n * 1.9,
          0.22,
          0.2,
          0.2,
          0.55,
          1.6,
          -0.5,
        );
      }
      this.dust(e, t, i ? 14 : 8, n * 2.2);
    }
    slam(e, t, n, r) {
      (this.flash(e, 0.9, t, r, 40, 10, 0.32),
        this.ring(e, t, n * 1.2, r, 0.42, 2.4),
        this.decal(e, t, n * 0.6),
        this.dust(e, t, 22, n * 3.2));
      for (let n = 0; n < 18; n++) {
        let n = Math.random() * 6.28,
          i = Q(2, 7);
        this.glow.emit(
          e,
          0.2,
          t,
          Math.cos(n) * i,
          Q(1, 4),
          Math.sin(n) * i,
          Q(0.25, 0.5),
          0.2,
          0.03,
          r.r * 4,
          r.g * 4,
          r.b * 4,
          1,
          2.5,
          8,
        );
      }
    }
    defeat(e, t, n) {
      (this.flash(e, 1, t, n, 26, 8, 0.4),
        this.ring(e, t, 1.6, n, 0.45, 2.2),
        this.burst(e, 0.8, t, n, 26, 5));
      for (let n = 0; n < 8; n++)
        this.smoke.emit(
          e + Q(-0.3, 0.3),
          Q(0.3, 1.2),
          t + Q(-0.3, 0.3),
          Q(-0.6, 0.6),
          Q(0.8, 2),
          Q(-0.6, 0.6),
          Q(0.7, 1.2),
          0.5,
          1.4,
          0.85,
          0.85,
          0.9,
          0.5,
          1.4,
          -0.3,
        );
    }
    update(e) {
      let t = this.game,
        n = t.lighting,
        r =
          t.pipeline.renderer.getDrawingBufferSize(new V()).y /
          (2 * Math.tan((t.camera.fov * Math.PI) / 360));
      ((this.glow.material.uniforms.uScale.value = r),
        (this.smoke.material.uniforms.uScale.value = r),
        (this.smoke.material.uniforms.uDim.value = n.ambientLevel),
        (this.fireflyMat.uniforms.uScale.value = r),
        (this.fireflyMat.uniforms.uTime.value = t.elapsed),
        (this.fireflyMat.uniforms.uNight.value = n.night),
        (this.fireflies.visible = n.night > 0.01),
        this.glow.update(e),
        this.smoke.update(e));
      for (let t of this.flashes) {
        t.t += e;
        let r = 1 - $c(t.t / t.T, 0, 1);
        n.addLight(t.x, t.y, t.z, t.color, t.intensity * r * r, t.distance);
      }
      this.flashes = this.flashes.filter((e) => e.t < e.T);
      let i = !1;
      for (let t = 0; t < this.debrisCap; t++) {
        let n = this.debrisData[t];
        if (n.life <= 0) continue;
        ((i = !0),
          (n.life -= e),
          (n.vy -= 19 * e),
          (n.x += n.vx * e),
          (n.y += n.vy * e),
          (n.z += n.vz * e));
        let r = n.s * 0.5;
        (n.y < r &&
          ((n.y = r),
          (n.vy *= -0.38),
          (n.vx *= 0.6),
          (n.vz *= 0.6),
          (n.wx *= 0.5),
          (n.wy *= 0.5),
          (n.wz *= 0.5)),
          (n.rx += n.wx * e),
          (n.ry += n.wy * e),
          (n.rz += n.wz * e));
        let a = n.life <= 0 ? 0 : n.s * $c(n.life / 0.4, 0, 1);
        (Du.set(n.rx, n.ry, n.rz),
          wu.setFromEuler(Du),
          Cu.compose(Tu.set(n.x, n.y, n.z), wu, Eu.set(a, a, a)),
          this.debrisMesh.setMatrixAt(t, Cu));
      }
      i && (this.debrisMesh.instanceMatrix.needsUpdate = !0);
      for (let t of this.decals)
        t.life <= 0 ||
          ((t.life -= e),
          (t.mesh.material.opacity = $c(t.life / 4, 0, 1) * 0.55),
          t.life <= 0 && (t.mesh.visible = !1));
      for (let t of this.rings) {
        if (!t.mesh.visible) continue;
        t.t += e;
        let n = $c(t.t / t.T, 0, 1),
          r = 1 - (1 - n) * (1 - n);
        (t.mesh.scale.setScalar(0.2 + r * t.r),
          (t.mesh.material.opacity = (1 - n) * 0.9),
          n >= 1 && (t.mesh.visible = !1));
      }
    }
  },
  Pu = `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4( position, 1.0 );
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`,
  Fu = `
  uniform float uTime;
  uniform float uHalf;
  uniform float uRound;
  uniform float uLayer;
  uniform float uAlpha;
  uniform float uAmbient;
  uniform float uGlow;
  varying vec3 vWorld;

  float hash( vec2 p ) { return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 ); }
  float noise( vec2 p ) {
    vec2 i = floor( p ); vec2 f = fract( p );
    vec2 u = f * f * ( 3.0 - 2.0 * f );
    return mix( mix( hash( i ), hash( i + vec2( 1.0, 0.0 ) ), u.x ), mix( hash( i + vec2( 0.0, 1.0 ) ), hash( i + vec2( 1.0, 1.0 ) ), u.x ), u.y );
  }
  float fbm( vec2 p ) {
    float v = 0.0; float a = 0.5;
    for ( int i = 0; i < 4; i ++ ) { v += a * noise( p ); p = p * 2.03 + 17.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 p = vWorld.xz;
    vec2 q = abs( p ) - vec2( uHalf - uRound );
    float sd = length( max( q, 0.0 ) ) + min( max( q.x, q.y ), 0.0 ) - uRound; // < 0 inside the safe zone
    vec2 flow = vec2( uTime * 0.11, - uTime * 0.07 ) * ( 1.0 + uLayer * 0.35 );
    float n = fbm( p * 0.33 + flow + uLayer * 9.7 );
    float n2 = fbm( p * 0.9 - flow * 1.7 + uLayer * 3.1 );
    float edge = sd + ( n - 0.5 ) * 1.9;
    float body = smoothstep( 0.0, 2.2, edge );
    if ( body <= 0.001 ) discard;
    float dens = body * mix( 0.5, 1.0, n ) * mix( 0.7, 1.0, n2 );
    float rim = smoothstep( 0.0, 0.5, edge ) * ( 1.0 - smoothstep( 0.5, 2.4, edge ) );
    vec3 deep = vec3( 0.05, 0.42, 0.12 );
    vec3 light = vec3( 0.38, 0.95, 0.3 );
    vec3 col = mix( deep, light, n * n2 * 1.6 ) * uAmbient;
    // three sheets stack, so the rim must stay near 1.0 after blending: any hotter and
    // bloom turns the whole front line into a white wall (it did, at night)
    col += vec3( 0.28, 1.45, 0.4 ) * rim * uGlow;
    gl_FragColor = vec4( col, clamp( dens * uAlpha + rim * 0.25, 0.0, 0.95 ) );
  }`,
  Iu = [0.34, 0.3, 0.26],
  GasRing = class {
    constructor(e) {
      ((this.game = e),
        (this.half = GAME_CONFIG.gasStartHalf),
        (this.round = 5),
        (this.layers = []),
        (this.tickT = 0),
        (this.ticks = 0));
      let t = new yr(104, 104).rotateX(-Math.PI / 2);
      ([0.3, 0.72, 1.12].forEach((n, r) => {
        let i = new jr({
            uniforms: {
              uTime: { value: 0 },
              uHalf: { value: this.half },
              uRound: { value: this.round },
              uLayer: { value: r },
              uAlpha: { value: Iu[r] },
              uAmbient: { value: 1 },
              uGlow: { value: 1 },
            },
            vertexShader: Pu,
            fragmentShader: Fu,
            transparent: !0,
            depthWrite: !1,
          }),
          a = new Ln(t, i);
        ((a.position.y = n),
          (a.renderOrder = 4),
          (a.userData.noAO = !0),
          (a.frustumCulled = !1),
          e.scene.add(a),
          this.layers.push(a));
      }),
        this.reset());
    }
    reset() {
      ((this.half = GAME_CONFIG.gasStartHalf),
        (this.tickT = 0),
        (this.ticks = 0),
        (this.active = !1));
      for (let e of this.layers) e.visible = !1;
    }
    depthAt(e, t) {
      let n = Math.abs(e) - (this.half - this.round),
        r = Math.abs(t) - (this.half - this.round);
      return (
        Math.hypot(Math.max(n, 0), Math.max(r, 0)) +
        Math.min(Math.max(n, r), 0) -
        this.round
      );
    }
    update(e, t) {
      let n = this.game,
        r = $c((t - GAME_CONFIG.gasDelay) / GAME_CONFIG.gasDuration, 0, 1);
      ((this.active = t > GAME_CONFIG.gasDelay - 6),
        (this.half = el(GAME_CONFIG.gasStartHalf, GAME_CONFIG.gasEndHalf, r)),
        (this.round = el(5, 2.2, r)));
      let i = tl(GAME_CONFIG.gasDelay - 6, GAME_CONFIG.gasDelay, t);
      if (
        (this.layers.forEach((e, t) => {
          e.visible = this.active;
          let r = e.material.uniforms;
          ((r.uTime.value = n.elapsed),
            (r.uHalf.value = this.half),
            (r.uRound.value = this.round));
          let a = $c((n.lighting.ambientLevel - 0.36) / 0.64, 0, 1);
          ((r.uAmbient.value = el(0.2, 1, a)),
            (r.uGlow.value = (0.55 + n.lighting.night * 0.3) * i),
            (r.uAlpha.value = Iu[t] * i));
        }),
        !(t < GAME_CONFIG.gasDelay) && ((this.tickT += e), this.tickT >= 1))
      ) {
        (--this.tickT, this.ticks++);
        let e = 600 + Math.min(this.ticks, 60) * 25;
        for (let t of n.brawlers)
          t.alive &&
            !t.airborne &&
            this.depthAt(t.x, t.z) > 0.35 &&
            (t.takeDamage(e, null, !0), t.isPlayer && n.audio.play(`gas`));
      }
    }
  },
  Ru = 9,
  zu = 4.5,
  Bu = 2.4,
  Bot = class {
    constructor(e, t) {
      ((this.game = e),
        (this.b = t),
        (this.thinkT = Q(0, 0.35)),
        (this.state = `loot`),
        (this.target = null),
        (this.box = null),
        (this.goal = null),
        (this.path = null),
        (this.pathI = 0),
        (this.repathT = 0),
        (this.strafeDir = Math.random() < 0.5 ? 1 : -1),
        (this.strafeT = Q(0.6, 1.6)),
        (this.reactT = 0),
        (this.shootT = Q(0.4, 1)),
        (this.stuckT = 0),
        (this.lastX = t.x),
        (this.lastZ = t.z),
        (this.jitterT = 0),
        (this.jx = 0),
        (this.jz = 0),
        (this.wanderT = 0));
      let [n, r] = e.difficulty.skill;
      ((this.skill = Q(n, r)), (this.thrower = t.def.attack.kind === `lob`));
    }
    canSee(e, t) {
      return t > Ru || (e.inBush && t > Bu && e.revealT <= 0)
        ? !1
        : this.thrower && t < 8
          ? !0
          : t < 2.5 ||
            this.game.world.hasLineOfSight(this.b.x, this.b.z, e.x, e.z);
    }
    seesBox(e) {
      let t = this.game.world.raycast(this.b.x, this.b.z, e.x, e.z);
      return !t || (t.tx === e.tx && t.ty === e.ty);
    }
    think() {
      let { b: e, game: t } = this,
        n = t.world,
        r = t.gas,
        i =
          t.state !== `menu` &&
          t.matchTime < 14 &&
          t.elapsed - e.lastCombat > 2.5,
        a = null,
        o = i ? 3.5 : 1 / 0;
      for (let n of t.brawlers) {
        if (n === e || !n.alive || n.airborne) continue;
        let r = sl(e.x, e.z, n.x, n.z),
          i = e.lastAttacker === n && t.elapsed - e.lastHitTime < 4;
        if (!(!n.isPlayer && !i && r > zu)) {
          if (n.isPlayer && !i && this.target !== n) {
            let e = t.difficulty;
            if (
              r > e.engage ||
              (t.brains.reduce(
                (e, t) =>
                  e + (t !== this && t.b.alive && t.target === n ? 1 : 0),
                0,
              ) >= e.hunters &&
                r > 2.5)
            )
              continue;
          }
          r < o && this.canSee(n, r) && ((a = n), (o = r));
        }
      }
      (a !== this.target &&
        (this.reactT = Q(0.22, 0.5) * (2 - this.skill) * t.difficulty.react),
        (this.target = a));
      let s = r.active ? r.depthAt(e.x, e.z) : -99,
        c = null,
        l;
      if (s > -1.6) {
        l = `escape`;
        let t = Math.max(0, r.half - 4.5),
          i = Math.max(Math.abs(e.x), Math.abs(e.z), 0.001),
          a = Math.min(1, t / i);
        c = n.nearestOpen(e.x * a, e.z * a);
      } else if (a) {
        let t = e.hp / e.maxHp,
          i = a.hp / a.maxHp;
        if (t < 0.42 && i > t + 0.05 && o < 9) {
          l = `flee`;
          let t = (e.x - a.x) / (o || 1),
            i = (e.z - a.z) / (o || 1),
            s = e.x + t * 6 - e.x * 0.15,
            u = e.z + i * 6 - e.z * 0.15,
            d = Math.max(2, r.half - 3);
          ((s = $c(s, -d, d)), (u = $c(u, -d, d)), (c = n.nearestOpen(s, u)));
        } else l = `fight`;
      } else {
        let i = null,
          a = 9;
        for (let n of t.combat.cubes) {
          let t = sl(e.x, e.z, n.x, n.z);
          t < a && r.depthAt(n.x, n.z) < -0.5 && ((i = n), (a = t));
        }
        if (i) ((l = `cube`), (c = { x: i.x, z: i.z }));
        else {
          let i = null,
            a = 26;
          for (let n of t.combat.boxes) {
            if (!n.alive || n.skipBy === e.id) continue;
            let t = sl(e.x, e.z, n.x, n.z);
            t < a && r.depthAt(n.x, n.z) < -2 && ((i = n), (a = t));
          }
          if (((this.box = i), i)) ((l = `box`), (c = { x: i.x, z: i.z }));
          else {
            if (
              ((l = `wander`),
              (this.wanderT -= 0.3),
              !this.goal ||
                this.wanderT <= 0 ||
                sl(e.x, e.z, this.goal.x, this.goal.z) < 1.2)
            ) {
              let e = Math.max(2, Math.min(r.half - 4, 17));
              ((this.wanderGoal = n.nearestOpen(Q(-e, e), Q(-e, e))),
                (this.wanderT = 7));
            }
            c = this.wanderGoal;
          }
        }
      }
      (l !== `box` && (this.box = null),
        (this.state = l),
        (this.repathT -= 0.3),
        c
          ? (!this.goal ||
              sl(c.x, c.z, this.goal.x, this.goal.z) > 1.4 ||
              this.repathT <= 0 ||
              !this.path) &&
            this.planTo(c)
          : ((this.goal = null), (this.path = null)));
    }
    planTo(e) {
      let { b: t, game: n } = this,
        r = n.world,
        i = n.gas;
      ((this.goal = e), (this.repathT = 1.3));
      let a = i.active
        ? (e, t) => (i.depthAt(r.center(e), r.center(t)) > -0.5 ? 6 : 0)
        : null;
      ((this.path = r.findPath(
        r.toTile(t.x),
        r.toTile(t.z),
        r.toTile(e.x),
        r.toTile(e.z),
        a,
      )),
        (this.pathI = 0),
        !this.path &&
          this.box &&
          ((this.box.skipBy = t.id), (this.box = null)));
    }
    followPath() {
      let { b: e, game: t } = this;
      if (!this.path || this.pathI >= this.path.length) return [0, 0];
      let n = t.world,
        [r, i] = this.path[this.pathI],
        a = n.center(r),
        o = n.center(i);
      if (sl(e.x, e.z, a, o) < 0.36) {
        if ((this.pathI++, this.pathI >= this.path.length)) return [0, 0];
        (([r, i] = this.path[this.pathI]),
          (a = n.center(r)),
          (o = n.center(i)));
      }
      let s = sl(e.x, e.z, a, o) || 1;
      return [(a - e.x) / s, (o - e.z) / s];
    }
    aimAt(e, t, n, r, i) {
      let { b: a } = this,
        o = sl(a.x, a.z, e, t),
        s = i.kind === `lob` ? i.flight + i.fuse * 0.7 : o / (i.speed || 14),
        c = 0.8 * this.skill,
        l = e + n * s * c,
        u = t + r * s * c,
        d = (Math.random() - 0.5) * 2 * (0.05 + (1 - this.skill) * 0.3),
        f = Math.atan2(l - a.x, u - a.z) + d,
        p = sl(a.x, a.z, l, u);
      return {
        dx: Math.sin(f),
        dz: Math.cos(f),
        x: a.x + Math.sin(f) * p,
        z: a.z + Math.cos(f) * p,
      };
    }
    update(e) {
      let { b: t, game: n } = this;
      if (!t.alive) return;
      if (n.state === `countdown`) {
        t.moveX = t.moveZ = 0;
        return;
      }
      ((this.thinkT -= e),
        this.thinkT <= 0 && ((this.thinkT = 0.3), this.think()),
        (this.reactT = Math.max(0, this.reactT - e)),
        (this.shootT -= e));
      let r = n.world,
        i = t.def.attack,
        a = 0,
        o = 0,
        s = this.target && this.target.alive ? this.target : null;
      if (this.state === `fight` && s) {
        let n = sl(t.x, t.z, s.x, s.z) || 0.001;
        if (!(this.thrower || r.hasLineOfSight(t.x, t.z, s.x, s.z)))
          ((!this.path || this.pathI >= this.path.length) &&
            this.planTo({ x: s.x, z: s.z }),
            ([a, o] = this.followPath()));
        else {
          let r = (s.x - t.x) / n,
            i = (s.z - t.z) / n,
            c = t.def.preferred,
            l = 0;
          (n > c + 0.8 ? (l = 1) : n < c - 1.2 && (l = -1),
            (this.strafeT -= e),
            this.strafeT <= 0 &&
              ((this.strafeT = Q(0.5, 1.5)), (this.strafeDir *= -1)));
          let u = c < 2.5 ? 0.25 : 0.85;
          ((a = r * l + -i * this.strafeDir * u),
            (o = i * l + r * this.strafeDir * u));
        }
      } else
        this.state === `box` && this.box && this.box.alive
          ? (sl(t.x, t.z, this.box.x, this.box.z) >
              Math.min(i.range * 0.7, 5) ||
              !this.seesBox(this.box)) &&
            ([a, o] = this.followPath())
          : ([a, o] = this.followPath());
      if (((this.stuckT += e), this.stuckT > 0.6)) {
        let e = sl(t.x, t.z, this.lastX, this.lastZ);
        if ((a || o) && e < 0.14) {
          this.jitterT = 0.4;
          let e = Math.random() * 6.28;
          ((this.jx = Math.cos(e)),
            (this.jz = Math.sin(e)),
            (this.strafeDir *= -1),
            (this.repathT = 0));
        }
        ((this.stuckT = 0), (this.lastX = t.x), (this.lastZ = t.z));
      }
      this.jitterT > 0 && ((this.jitterT -= e), (a = this.jx), (o = this.jz));
      let c = Math.hypot(a, o);
      if (
        ((t.moveX = c > 0.01 ? a / c : 0),
        (t.moveZ = c > 0.01 ? o / c : 0),
        s && this.reactT <= 0 && !s.airborne)
      ) {
        let e = sl(t.x, t.z, s.x, s.z),
          a = this.thrower ? e < i.range : r.hasLineOfSight(t.x, t.z, s.x, s.z);
        if (a && t.superReady && this.shootT <= 0) {
          let n = t.def.super,
            r =
              n.kind === `spread`
                ? 5
                : n.kind === `leap`
                  ? n.range
                  : n.range * 0.9,
            i = n.kind === `leap` ? 2.5 : 0;
          if (e < r && e > i && Math.random() < 0.6) {
            let e = this.aimAt(s.x, s.z, s.vel.x, s.vel.y, n);
            t.useSuper(e.dx, e.dz, e.x, e.z) && (this.shootT = Q(0.4, 0.8));
          }
        }
        if (a && e < i.range * 0.95 && this.shootT <= 0 && t.ammo >= 1) {
          let e = this.aimAt(s.x, s.z, s.vel.x, s.vel.y, i);
          t.attack(e.dx, e.dz, e.x, e.z) &&
            (this.shootT =
              (Q(0.45, 1) + (t.ammo < 1 ? 0.4 : 0)) *
              (s.isPlayer ? n.difficulty.cadence : 1));
        }
      } else if (
        this.state === `box` &&
        this.box &&
        this.box.alive &&
        this.shootT <= 0 &&
        t.ammo >= 1
      ) {
        let e = sl(t.x, t.z, this.box.x, this.box.z);
        if (e < i.range * 0.85 && (this.thrower || this.seesBox(this.box))) {
          let n = (this.box.x - t.x) / (e || 1),
            r = (this.box.z - t.z) / (e || 1);
          t.attack(n, r, this.box.x, this.box.z) &&
            (this.shootT = Q(0.35, 0.7));
        }
      }
    }
  },
  Hu = {
    w: `KeyW`,
    a: `KeyA`,
    s: `KeyS`,
    d: `KeyD`,
    e: `KeyE`,
    t: `KeyT`,
    p: `KeyP`,
    m: `KeyM`,
    " ": `Space`,
    spacebar: `Space`,
    escape: `Escape`,
    arrowleft: `ArrowLeft`,
    arrowright: `ArrowRight`,
    arrowup: `ArrowUp`,
    arrowdown: `ArrowDown`,
  },
  Uu = (e) => e.code || Hu[(e.key || ``).toLowerCase()] || ``,
  Wu = () => ({ id: null, ox: 0, oy: 0, x: 0, y: 0, mag: 0, moved: !1 }),
  Input = class {
    constructor(e, t) {
      ((this.keys = new Set()),
        (this.ndcX = 0),
        (this.ndcY = 0),
        (this.fire = !1),
        (this.superHeld = !1),
        (this.superReleased = !1),
        (this.enabled = !0),
        (this.touchMode = !1),
        (this.onTouchMode = null),
        (this.lastTouch = -1e9),
        (this.sticks = { move: Wu(), aim: Wu(), super: Wu() }),
        (this.shots = []));
      let n = new Set([`Space`, `KeyE`]);
      (window.addEventListener(`keydown`, (e) => {
        if (
          e.repeat ||
          (e.target &&
            (e.target.tagName === `INPUT` || e.target.tagName === `SELECT`))
        )
          return;
        let t = Uu(e);
        (this.keys.add(t),
          n.has(t) && ((this.superHeld = !0), e.preventDefault()),
          t.startsWith(`Arrow`) && e.preventDefault());
      }),
        window.addEventListener(`keyup`, (e) => {
          let t = Uu(e);
          (this.keys.delete(t),
            n.has(t) &&
              this.superHeld &&
              ((this.superHeld = !1), (this.superReleased = !0)));
        }),
        window.addEventListener(`blur`, () => {
          (this.keys.clear(), (this.fire = !1), (this.superHeld = !1));
          for (let e of Object.values(this.sticks)) this.resetStick(e);
        }));
      let r = () => performance.now() - this.lastTouch < 900,
        i = (e) => {
          ((this.ndcX = (e.clientX / window.innerWidth) * 2 - 1),
            (this.ndcY = -(e.clientY / window.innerHeight) * 2 + 1));
        };
      (window.addEventListener(`mousemove`, (e) => {
        r() || i(e);
      }),
        e.addEventListener(`mousedown`, (e) => {
          r() ||
            (this.touchMode && this.setTouchMode(!1),
            i(e),
            e.button === 0 && (this.fire = !0),
            e.button === 2 && (this.superHeld = !0));
        }),
        window.addEventListener(`mouseup`, (e) => {
          (e.button === 0 && (this.fire = !1),
            e.button === 2 &&
              this.superHeld &&
              ((this.superHeld = !1), (this.superReleased = !0)));
        }),
        e.addEventListener(`contextmenu`, (e) => e.preventDefault()));
      let a = (e, t) => {
          if (e.pointerType !== `touch`) return;
          ((this.lastTouch = performance.now()),
            this.touchMode || this.setTouchMode(!0));
          let n =
            t === `super`
              ? this.sticks.super
              : e.clientX < window.innerWidth * 0.45
                ? this.sticks.move
                : this.sticks.aim;
          n.id === null &&
            ((n.id = e.pointerId),
            (n.ox = e.clientX),
            (n.oy = e.clientY),
            (n.x = n.y = n.mag = 0),
            (n.moved = !1),
            e.preventDefault());
        },
        o = (e) => Object.values(this.sticks).find((t) => t.id === e.pointerId);
      (e.addEventListener(`pointerdown`, (e) => a(e, `field`)),
        t &&
          (t.addEventListener(`pointerdown`, (e) => a(e, `super`)),
          t.addEventListener(`click`, () => {
            r() ||
              this.shots.push({
                kind: `super`,
                x: 0,
                y: 0,
                mag: 0,
                tap: !0,
                cancelled: !1,
              });
          })),
        window.addEventListener(`pointermove`, (e) => {
          if (e.pointerType !== `touch`) return;
          this.lastTouch = performance.now();
          let t = o(e);
          if (!t) return;
          let n = (e.clientX - t.ox) / 58,
            r = (e.clientY - t.oy) / 58,
            i = Math.hypot(n, r);
          (i > 1 && ((n /= i), (r /= i)),
            (t.x = n),
            (t.y = r),
            (t.mag = Math.min(1, i)),
            t.mag > 0.22 && (t.moved = !0));
        }));
      let s = (e) => {
        if (e.pointerType !== `touch`) return;
        this.lastTouch = performance.now();
        let t = o(e);
        t &&
          (t !== this.sticks.move &&
            e.type === `pointerup` &&
            this.shots.push({
              kind: t === this.sticks.super ? `super` : `attack`,
              x: t.x,
              y: t.y,
              mag: t.mag,
              tap: !t.moved,
              cancelled: t.moved && t.mag <= 0.22,
            }),
          this.resetStick(t));
      };
      (window.addEventListener(`pointerup`, s),
        window.addEventListener(`pointercancel`, s));
    }
    resetStick(e) {
      ((e.id = null), (e.x = e.y = e.mag = 0), (e.moved = !1));
    }
    setTouchMode(e) {
      if (this.touchMode !== e) {
        if (((this.touchMode = e), (this.fire = !1), !e))
          for (let e of Object.values(this.sticks)) this.resetStick(e);
        this.onTouchMode && this.onTouchMode(e);
      }
    }
    axis() {
      let e = this.sticks.move;
      if (e.id !== null && e.mag > 0.22) {
        let t = Math.hypot(e.x, e.y) || 1;
        return { x: e.x / t, z: e.y / t };
      }
      let t = this.keys,
        n = 0,
        r = 0;
      ((t.has(`KeyA`) || t.has(`ArrowLeft`)) && --n,
        (t.has(`KeyD`) || t.has(`ArrowRight`)) && (n += 1),
        (t.has(`KeyW`) || t.has(`ArrowUp`)) && --r,
        (t.has(`KeyS`) || t.has(`ArrowDown`)) && (r += 1));
      let i = Math.hypot(n, r);
      return i > 0 ? { x: n / i, z: r / i } : { x: 0, z: 0 };
    }
    consumeSuperRelease() {
      let e = this.superReleased;
      return ((this.superReleased = !1), e);
    }
    takeShots() {
      if (this.shots.length === 0) return this.shots;
      let e = this.shots;
      return ((this.shots = []), e);
    }
  },
  projectedPosition = new H(),
  $ = (e) => document.getElementById(e),
  qu = (e) => {
    let t = Math.floor(e) % 24,
      n = Math.floor((e - Math.floor(e)) * 60);
    return `${String(t).padStart(2, `0`)}:${String(n).padStart(2, `0`)}`;
  },
  Ju = (e) =>
    e >= 19.4 || e < 5.6 ? `🌙` : e >= 17.2 || e < 7.2 ? `🌇` : `☀️`,
  HUD = class {
    constructor(e) {
      ((this.game = e),
        (this.root = $(`hud`)),
        (this.overheadLayer = $(`overheads`)),
        (this.floaterLayer = $(`floaters`)),
        (this.overheads = new Map()),
        (this.boxBars = new Map()),
        (this.floaters = []));
      for (let e = 0; e < 36; e++) {
        let e = document.createElement(`div`);
        ((e.className = `floater`),
          (e.hidden = !0),
          this.floaterLayer.appendChild(e),
          this.floaters.push({ el: e, life: 0, x: 0, y: 0, z: 0, drift: 0 }));
      }
      ((this.floaterCursor = 0),
        (this.bannerT = 0),
        (this.hurt = 0),
        (this.selected = `dusty`),
        (this.lastLeft = -1),
        (this.lastClock = ``),
        (this.lastSuper = -1),
        (this.statsT = 0),
        (this.frames = 0),
        (this.fps = 0),
        (this.touch = !1),
        (this.stickEls = { move: $(`stick-move`), aim: $(`stick-aim`) }),
        this.buildMenu(),
        this.buildSettings());
    }
    setTouchMode(e) {
      ((this.touch = e),
        document.body.classList.toggle(`touch`, e),
        (this.lastSuper = -1));
    }
    updateSticks() {
      if (!this.touch) return;
      let e = this.game.input.sticks,
        t = window.innerWidth,
        n = window.innerHeight,
        r = {
          move: [Math.max(96, t * 0.14), n - 118],
          aim: [t - Math.max(104, t * 0.13), n - 128],
        };
      for (let t of [`move`, `aim`]) {
        let n = e[t],
          i = this.stickEls[t];
        if (!i) continue;
        let a = n.id !== null,
          o = a ? n.ox : r[t][0],
          s = a ? n.oy : r[t][1];
        ((i.style.transform = `translate3d(${o.toFixed(1)}px, ${s.toFixed(1)}px, 0)`),
          i.classList.toggle(`on`, a),
          (i.firstElementChild.style.transform = `translate(${(n.x * 58).toFixed(1)}px, ${(n.y * 58).toFixed(1)}px)`));
      }
    }
    buildMenu() {
      let e = $(`cards`),
        t = { dusty: `💥`, ace: `🎯`, fuse: `💣`, titan: `🥊` },
        n = (e, t) =>
          `<div class="stat"><span>${e}</span><i><b style="width:${Math.round(t * 100)}%"></b></i></div>`;
      for (let r of Object.values(BRAWLER_DEFS)) {
        let i = document.createElement(`div`);
        ((i.className = `card` + (r.id === this.selected ? ` on` : ``)),
          (i.dataset.id = r.id),
          (i.tabIndex = 0),
          i.setAttribute(`role`, `button`),
          i.setAttribute(`aria-pressed`, String(r.id === this.selected)));
        let a = `#` + r.palette.body.toString(16).padStart(6, `0`),
          o = `#` + r.palette.accent.toString(16).padStart(6, `0`),
          s = r.attack.range / 9.5,
          c =
            r.attack.kind === `spread`
              ? 0.85
              : r.attack.kind === `burst`
                ? 0.75
                : r.attack.kind === `lob`
                  ? 0.7
                  : 0.8;
        i.innerHTML = `<div class="swatch" style="background:linear-gradient(135deg, ${a}, ${o})">${t[r.id]}</div>
        <h2>${r.name}</h2><div class="role">${r.role}</div><p>${r.blurb}</p>
        ${n(`HEALTH`, r.hp / 6200)}${n(`RANGE`, s)}${n(`DAMAGE`, c)}`;
        let l = () => {
          (this.game.audio.unlock(),
            this.game.audio.play(`click`),
            this.select(r.id));
        };
        (i.addEventListener(`click`, l),
          i.addEventListener(`keydown`, (e) => {
            (e.key === `Enter` || e.key === ` `) && (e.preventDefault(), l());
          }),
          e.appendChild(i));
      }
      ($(`play`).addEventListener(`click`, () => {
        (this.game.audio.unlock(), this.game.startMatch(this.selected));
      }),
        $(`again`).addEventListener(`click`, () =>
          this.game.startMatch(this.selected),
        ),
        $(`to-menu`).addEventListener(`click`, () => this.game.toMenu()));
    }
    select(e) {
      ((this.selected = e),
        document.querySelectorAll(`#cards .card`).forEach((t) => {
          let n = t.dataset.id === e;
          (t.classList.toggle(`on`, n),
            t.setAttribute(`aria-pressed`, String(n)));
        }));
    }
    showMenu(e) {
      ($(`menu`).classList.toggle(`open`, e),
        e && $(`result`).classList.remove(`open`),
        this.root.classList.toggle(`hidden`, e));
    }
    showResult(e, t, n, r, i) {
      let a = $(`result-title`);
      ((a.textContent = e ? `VICTORY!` : t <= 3 ? `SO CLOSE!` : `DEFEATED`),
        a.classList.toggle(`lose`, !e),
        ($(`result-rank`).textContent = `RANK #${t} of ${n}`),
        ($(`result-stats`).textContent =
          `${r} takedown${r === 1 ? `` : `s`}  ·  ${i} power cube${i === 1 ? `` : `s`}`),
        $(`result`).classList.add(`open`));
    }
    hideResult() {
      $(`result`).classList.remove(`open`);
    }
    buildSettings() {
      let e = this.game,
        t = $(`settings`);
      $(`gear`).addEventListener(`click`, () => t.classList.toggle(`open`));
      let n = $(`quality-seg`);
      for (let [t, r] of Object.entries(QUALITY_PRESETS)) {
        let i = document.createElement(`button`);
        ((i.textContent = r.label),
          (i.dataset.q = t),
          i.addEventListener(`click`, () => e.setQuality(t, !0)),
          n.appendChild(i));
      }
      let r = $(`difficulty-seg`);
      for (let [t, n] of Object.entries(DIFFICULTIES)) {
        let i = document.createElement(`button`);
        ((i.textContent = n.label),
          (i.dataset.d = t),
          i.addEventListener(`click`, () => e.setDifficulty(t)),
          r.appendChild(i));
      }
      ($(`auto-time`).addEventListener(`change`, (t) =>
        e.setAutoTime(t.target.checked),
      ),
        $(`time-slider`).addEventListener(`input`, (t) => {
          (e.setAutoTime(!1), e.lighting.setTime(parseFloat(t.target.value)));
        }),
        $(`tog-ao`).addEventListener(`change`, (t) =>
          e.setToggle(`ao`, t.target.checked),
        ),
        $(`tog-bloom`).addEventListener(`change`, (t) =>
          e.setToggle(`bloom`, t.target.checked),
        ),
        $(`tog-mute`).addEventListener(`change`, (t) =>
          e.setMuted(t.target.checked),
        ));
    }
    syncSettings() {
      let e = this.game;
      (document
        .querySelectorAll(`#quality-seg button`)
        .forEach((t) =>
          t.classList.toggle(`on`, t.dataset.q === e.pipeline.qualityName),
        ),
        document
          .querySelectorAll(`#difficulty-seg button`)
          .forEach((t) =>
            t.classList.toggle(`on`, t.dataset.d === e.difficultyName),
          ),
        ($(`auto-time`).checked = e.autoTime),
        ($(`tog-ao`).checked = e.pipeline.toggles.ao),
        ($(`tog-ao`).disabled = !e.pipeline.quality.ao),
        ($(`tog-bloom`).checked = e.pipeline.toggles.bloom),
        ($(`tog-mute`).checked = e.audio.muted));
    }
    toast(e) {
      let t = $(`toast`);
      ((t.textContent = e),
        t.classList.add(`show`),
        clearTimeout(this.toastTimer),
        (this.toastTimer = setTimeout(() => t.classList.remove(`show`), 3200)));
    }
    reset() {
      for (let e of this.overheads.values()) e.root.remove();
      this.overheads.clear();
      for (let e of this.boxBars.values()) e.root.remove();
      this.boxBars.clear();
      for (let e of this.floaters) ((e.life = 0), (e.el.hidden = !0));
      (($(`feed`).innerHTML = ``), (this.lastLeft = -1), this.hideResult());
    }
    addBrawler(e) {
      let t = document.createElement(`div`);
      ((t.className = `oh` + (e.isPlayer ? ` me` : ``)),
        (t.innerHTML = `<div class="oh-name"><span class="n"></span><span class="oh-cubes"></span></div>
      <div class="oh-bar"><div class="oh-fill"></div><span class="oh-hp"></span></div>
      ${e.isPlayer ? `<div class="oh-ammo"><i><b></b></i><i><b></b></i><i><b></b></i></div>` : ``}`),
        (t.querySelector(`.n`).textContent = e.name),
        this.overheadLayer.appendChild(t),
        this.overheads.set(e.id, {
          root: t,
          fill: t.querySelector(`.oh-fill`),
          hp: t.querySelector(`.oh-hp`),
          cubes: t.querySelector(`.oh-cubes`),
          ammo: [...t.querySelectorAll(`.oh-ammo b`)],
          lastHp: -1,
          lastMax: -1,
          lastCubes: -1,
          lastAmmo: [-1, -1, -1],
          shown: !0,
        }));
    }
    floatText(e, t, n, r, i) {
      let a = this.floaters[this.floaterCursor];
      ((this.floaterCursor = (this.floaterCursor + 1) % this.floaters.length),
        (a.life = 0.85),
        (a.x = e + (Math.random() - 0.5) * 0.5),
        (a.y = t),
        (a.z = n),
        (a.drift = (Math.random() - 0.5) * 30),
        (a.el.textContent = r),
        (a.el.className = `floater ` + i),
        (a.el.hidden = !1));
    }
    feed(e) {
      let t = $(`feed`),
        n = document.createElement(`div`);
      for (n.innerHTML = e, t.appendChild(n); t.children.length > 4;)
        t.firstChild.remove();
      setTimeout(() => n.remove(), 6e3);
    }
    banner(e, t = 1, n = !1) {
      let r = $(`banner`);
      ((r.textContent = e),
        r.classList.toggle(`small`, n),
        r.classList.add(`show`),
        (this.bannerT = t));
    }
    flashHurt(e) {
      this.hurt = $c(this.hurt + e / 1400, 0.35, 1);
    }
    project(e, t, n, r) {
      return (
        projectedPosition.set(e, t, n).project(this.game.camera),
        (r.x = (projectedPosition.x * 0.5 + 0.5) * window.innerWidth),
        (r.y = (-projectedPosition.y * 0.5 + 0.5) * window.innerHeight),
        (r.on =
          projectedPosition.z < 1 &&
          Math.abs(projectedPosition.x) < 1.15 &&
          Math.abs(projectedPosition.y) < 1.2),
        r
      );
    }
    update(e) {
      let t = this.game,
        n = {};
      for (let e of t.brawlers) {
        let t = this.overheads.get(e.id);
        if (!t) continue;
        let r = e.alive && e.root.visible,
          i = r ? this.project(e.x, e.root.position.y + 1.72, e.z, n) : null,
          a = r && i.on;
        if ((a !== t.shown && ((t.root.hidden = !a), (t.shown = a)), !a))
          continue;
        t.root.style.transform = `translate3d(${i.x.toFixed(1)}px, ${(i.y - 44).toFixed(1)}px, 0)`;
        let o = Math.max(0, Math.ceil(e.hp));
        if (
          ((o !== t.lastHp || e.maxHp !== t.lastMax) &&
            ((t.lastHp = o),
            (t.lastMax = e.maxHp),
            (t.fill.style.transform = `scaleX(${$c(o / e.maxHp, 0, 1).toFixed(3)})`),
            (t.hp.textContent = o)),
          e.cubes !== t.lastCubes &&
            ((t.lastCubes = e.cubes),
            (t.cubes.textContent = e.cubes > 0 ? `⚡${e.cubes}` : ``)),
          e.isPlayer)
        )
          for (let n = 0; n < 3; n++) {
            let r = $c(
                e.ammo - n + (Math.floor(e.ammo) === n ? e.reloadT : 0),
                0,
                1,
              ),
              i = Math.round(r * 40);
            i !== t.lastAmmo[n] &&
              ((t.lastAmmo[n] = i),
              (t.ammo[n].style.transform = `scaleX(${(i / 40).toFixed(3)})`),
              (t.ammo[n].style.opacity = r >= 1 ? `1` : `0.55`));
          }
      }
      for (let e of t.combat.boxes) {
        let t = this.boxBars.get(e);
        if (!(e.alive && e.hp < e.maxHp)) {
          t && (t.root.remove(), this.boxBars.delete(e));
          continue;
        }
        if (!t) {
          let n = document.createElement(`div`);
          ((n.className = `oh box`),
            (n.innerHTML = `<div class="oh-bar"><div class="oh-fill"></div><span class="oh-hp"></span></div>`),
            this.overheadLayer.appendChild(n),
            (t = {
              root: n,
              fill: n.querySelector(`.oh-fill`),
              hp: n.querySelector(`.oh-hp`),
              last: -1,
            }),
            this.boxBars.set(e, t));
        }
        let r = this.project(e.x, 1.35, e.z, n);
        ((t.root.hidden = !r.on),
          (t.root.style.transform = `translate3d(${r.x.toFixed(1)}px, ${(r.y - 20).toFixed(1)}px, 0)`));
        let i = Math.max(0, Math.ceil(e.hp));
        i !== t.last &&
          ((t.last = i),
          (t.fill.style.transform = `scaleX(${$c(i / e.maxHp, 0, 1).toFixed(3)})`),
          (t.hp.textContent = i));
      }
      for (let t of this.floaters) {
        if (t.life <= 0) continue;
        if (((t.life -= e), t.life <= 0)) {
          t.el.hidden = !0;
          continue;
        }
        let r = 1 - t.life / 0.85,
          i = this.project(t.x, t.y + r * 0.9, t.z, n),
          a =
            r < 0.15
              ? 0.6 + (r / 0.15) * 0.6
              : 1.2 - Math.min(1, (r - 0.15) * 1.5) * 0.2;
        ((t.el.style.transform = `translate3d(${(i.x + t.drift * r).toFixed(1)}px, ${i.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${a.toFixed(2)})`),
          (t.el.style.opacity = r > 0.7 ? ((1 - r) / 0.3).toFixed(2) : `1`));
      }
      let r = t.brawlers.reduce((e, t) => e + +!!t.alive, 0);
      r !== this.lastLeft &&
        ((this.lastLeft = r),
        ($(`left-count`).innerHTML = `BRAWLERS LEFT <b>${r}</b>`));
      let i = `${Ju(t.lighting.time)} ${qu(t.lighting.time)}`;
      i !== this.lastClock &&
        ((this.lastClock = i),
        ($(`clock`).textContent = i),
        ($(`time-label`).textContent = qu(t.lighting.time)),
        document.activeElement !== $(`time-slider`) &&
          ($(`time-slider`).value = t.lighting.time));
      let a = t.player,
        o = a ? Math.round(a.superCharge * 100) : 0;
      if (o !== this.lastSuper) {
        this.lastSuper = o;
        let e = $(`super`);
        (e.style.setProperty(`--p`, o),
          e.classList.toggle(`ready`, o >= 100),
          ($(`super-core`).textContent =
            o >= 100 ? (this.touch ? `SUPER!` : `SPACE!`) : `SUPER ${o}%`));
      }
      (this.updateSticks(),
        this.bannerT > 0 &&
          ((this.bannerT -= e),
          this.bannerT <= 0 && $(`banner`).classList.remove(`show`)),
        (this.hurt = Math.max(0, this.hurt - e * 2.2)),
        ($(`hurt`).style.opacity = this.hurt.toFixed(2)));
      let s = a && a.alive && t.gas.active && t.gas.depthAt(a.x, a.z) > 0.35;
      if (
        (($(`gas-warn`).style.opacity = s ? `1` : `0`),
        this.frames++,
        (this.statsT += e),
        this.statsT >= 0.5 &&
          ((this.fps = Math.round(this.frames / this.statsT)),
          (this.frames = 0),
          (this.statsT = 0),
          $(`settings`).classList.contains(`open`)))
      ) {
        let e = { render: t.frameStats },
          n = t.lighting,
          r = n.lampSlots.filter((e) => e.intensity > 0.01).length,
          i = n.lampSlots.filter(
            (e) => e.castShadow && e.shadow.autoUpdate,
          ).length;
        $(`stats`).textContent =
          `${this.fps} fps   ${e.render.calls} draws   ${(e.render.triangles / 1e3).toFixed(0)}k tris\nsun shadow ${n.mapSize}px over ${(n.shadowRadius * 2).toFixed(0)}m  (${t.pipeline.usingPCSS ? `PCSS` : `PCF`})\nlamps lit ${r}  casting ${i}   pool lights ${n.pool.filter((e) => e.intensity > 0).length}/${n.pool.length}\n` +
          (t.userPickedQuality
            ? `quality: your choice`
            : `quality: auto  (night frame ${t.perf.benchMs ? t.perf.benchMs.toFixed(1) : `?`} ms at startup)`);
      }
    }
  },
  GameAudio = class {
    constructor() {
      ((this.ctx = null),
        (this.master = null),
        (this.muted = !1),
        (this.listener = { x: 0, z: 0 }),
        (this.noiseBuffer = null),
        (this.lastPlayed = {}),
        (this.timeOffset = 0));
    }
    unlock() {
      if (this.ctx) {
        this.ctx.state === `suspended` && this.ctx.resume();
        return;
      }
      let e = window.AudioContext || window.webkitAudioContext;
      e && this.attach(new e());
    }
    attach(e) {
      ((this.ctx = e),
        (this.master = this.ctx.createGain()),
        (this.master.gain.value = this.muted ? 0 : 0.34));
      let t = this.ctx.createDynamicsCompressor();
      (this.master.connect(t), t.connect(this.ctx.destination));
      let n = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, n, n);
      let r = this.noiseBuffer.getChannelData(0);
      for (let e = 0; e < n; e++) r[e] = Math.random() * 2 - 1;
    }
    setMuted(e) {
      ((this.muted = e),
        this.master && (this.master.gain.value = e ? 0 : 0.34));
    }
    tone(e, t, n, r, i, a = 0) {
      let o = this.ctx,
        s = o.currentTime + this.timeOffset + a,
        c = o.createOscillator(),
        l = o.createGain();
      ((c.type = e),
        c.frequency.setValueAtTime(t, s),
        c.frequency.exponentialRampToValueAtTime(Math.max(20, n), s + r),
        l.gain.setValueAtTime(i, s),
        l.gain.exponentialRampToValueAtTime(8e-4, s + r),
        c.connect(l),
        l.connect(this.master),
        c.start(s),
        c.stop(s + r + 0.02));
    }
    noise(e, t, n, r, i, a = 1, o = 0) {
      let s = this.ctx,
        c = s.currentTime + this.timeOffset + o,
        l = s.createBufferSource();
      ((l.buffer = this.noiseBuffer),
        (l.playbackRate.value = 0.8 + Math.random() * 0.4));
      let u = s.createBiquadFilter();
      ((u.type = e),
        (u.Q.value = a),
        u.frequency.setValueAtTime(t, c),
        u.frequency.exponentialRampToValueAtTime(Math.max(30, n), c + r));
      let d = s.createGain();
      (d.gain.setValueAtTime(i, c),
        d.gain.exponentialRampToValueAtTime(8e-4, c + r),
        l.connect(u),
        u.connect(d),
        d.connect(this.master),
        l.start(c, Math.random() * 0.5),
        l.stop(c + r + 0.02));
    }
    loudness(e, t) {
      if (e === void 0) return 1;
      let n = Math.hypot(e - this.listener.x, t - this.listener.z),
        r = Math.max(0, 1 - n / 22);
      return r * r;
    }
    play(e, t, n) {
      this.ctx && !this.muted && this.emit(e, this.loudness(t, n));
    }
    emit(e, t) {
      if (t < 0.02) return;
      let n = this.ctx.currentTime + this.timeOffset;
      if (!(n - (this.lastPlayed[e] ?? -1) < 0.035))
        switch (((this.lastPlayed[e] = n), e)) {
          case `shot`:
            (this.noise(`bandpass`, 2600, 700, 0.09, 0.5 * t, 0.8),
              this.tone(`square`, 760, 170, 0.08, 0.12 * t));
            break;
          case `shotBig`:
            (this.noise(`bandpass`, 2e3, 400, 0.13, 0.6 * t, 0.7),
              this.tone(`sawtooth`, 520, 110, 0.12, 0.16 * t));
            break;
          case `blast`:
            (this.noise(`lowpass`, 3200, 240, 0.2, 0.85 * t),
              this.tone(`sine`, 170, 50, 0.16, 0.4 * t));
            break;
          case `blastBig`:
            (this.noise(`lowpass`, 3600, 160, 0.34, 1 * t),
              this.tone(`sine`, 150, 38, 0.3, 0.6 * t));
            break;
          case `lob`:
            (this.tone(`sine`, 330, 120, 0.16, 0.35 * t),
              this.noise(`bandpass`, 900, 500, 0.08, 0.2 * t));
            break;
          case `punch`:
            (this.noise(`lowpass`, 900, 120, 0.09, 0.7 * t),
              this.tone(`sine`, 140, 60, 0.08, 0.35 * t));
            break;
          case `boom`:
            (this.noise(`lowpass`, 1800, 70, 0.5, 1 * t),
              this.tone(`sine`, 110, 34, 0.45, 0.7 * t));
            break;
          case `boomBig`:
            (this.noise(`lowpass`, 2400, 50, 0.85, 1.2 * t),
              this.tone(`sine`, 95, 28, 0.8, 0.9 * t),
              this.noise(`bandpass`, 500, 200, 0.5, 0.4 * t, 0.6, 0.05));
            break;
          case `hit`:
            this.tone(`triangle`, 720, 260, 0.06, 0.3 * t);
            break;
          case `crate`:
            (this.noise(`bandpass`, 1300, 380, 0.2, 0.75 * t, 1.2),
              this.tone(`square`, 210, 80, 0.1, 0.12 * t));
            break;
          case `pickup`:
            [660, 880, 1320].forEach((e, n) =>
              this.tone(`triangle`, e, e * 1.01, 0.13, 0.26 * t, n * 0.065),
            );
            break;
          case `ready`:
            [784, 1046, 1568].forEach((e, t) =>
              this.tone(`sine`, e, e, 0.22, 0.24, t * 0.08),
            );
            break;
          case `super`:
            (this.noise(`bandpass`, 300, 3200, 0.3, 0.5 * t, 1.5),
              this.tone(`sawtooth`, 180, 720, 0.28, 0.13 * t));
            break;
          case `leap`:
            (this.tone(`sine`, 200, 620, 0.35, 0.3 * t),
              this.noise(`highpass`, 800, 3e3, 0.3, 0.2 * t));
            break;
          case `gas`:
            this.noise(`highpass`, 3e3, 1500, 0.22, 0.22);
            break;
          case `down`:
            (this.tone(`sawtooth`, 420, 60, 0.5, 0.25 * t),
              this.noise(`lowpass`, 1200, 100, 0.4, 0.4 * t));
            break;
          case `count`:
            this.tone(`square`, 520, 520, 0.12, 0.2);
            break;
          case `go`:
            (this.tone(`square`, 880, 1320, 0.3, 0.24),
              this.tone(`sine`, 440, 660, 0.3, 0.2));
            break;
          case `win`:
            [523, 659, 784, 1046, 1318].forEach((e, t) =>
              this.tone(`triangle`, e, e, 0.3, 0.3, t * 0.11),
            );
            break;
          case `lose`:
            [392, 330, 262, 196].forEach((e, t) =>
              this.tone(`sawtooth`, e, e * 0.97, 0.32, 0.18, t * 0.16),
            );
            break;
          case `click`:
            this.tone(`triangle`, 900, 600, 0.05, 0.2);
        }
    }
  },
  FOV = 32,
  CAMERA_PITCH = (56 * Math.PI) / 180,
  $u = 23,
  TIME_PRESETS = [null, 12.5, 17.6, 18.6, 19.4, 21.5],
  SETTINGS_KEY = `sundown-showdown-settings`,
  nd = new Hi(),
  rd = new V(),
  id = new _n(new H(0, 1, 0), -0.5),
  ad = new H(),
  od = new J(16761402),
  sd = new J(16767392);

export {
  $,
  $u,
  Au,
  Bot,
  Brawler,
  Bu,
  CAMERA_PITCH,
  Combat,
  Cu,
  Du,
  Effects,
  Eu,
  FOV,
  Fu,
  GameAudio,
  GasRing,
  HUD,
  Hu,
  Input,
  Iu,
  Ju,
  Mu,
  Ou,
  Pu,
  Ru,
  SETTINGS_KEY,
  TIME_PRESETS,
  Tu,
  Uu,
  Wu,
  _u,
  ad,
  brawlerId,
  bu,
  gu,
  hu,
  id,
  ju,
  ku,
  mu,
  nd,
  od,
  projectedPosition,
  pu,
  qu,
  rd,
  sd,
  uu,
  vu,
  wu,
  xu,
  yu,
  zu,
};
