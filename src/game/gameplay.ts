// @ts-nocheck
import {
  clamp,
  BRAWLER_DEFS,
  COLLISION_RADIUS,
  DIFFICULTIES,
  GAME_CONFIG,
  Vector3,
  Raycaster,
  Color,
  Euler,
  Mesh,
  DynamicDrawUsage,
  MeshStandardMaterial,
  randomRange,
  QUALITY_PRESETS,
  Matrix4,
  T,
  TileType,
  MeshBasicMaterial,
  Vector2,
  InstancedMesh,
  BufferAttribute,
  _,
  Quaternion,
  Plane,
  createCanvas,
  ao,
  Points,
  b,
  RingGeometry,
  c,
  CanvasTexture,
  d,
  e,
  lerp,
  f,
  BoxGeometry,
  g,
  h,
  i,
  dampAngle,
  instanceColor,
  instanceMatrix,
  ShaderMaterial,
  SRGBColorSpace,
  l,
  m,
  CircleGeometry,
  n,
  damp,
  o,
  on,
  p,
  BufferGeometry,
  q,
  r,
  s,
  distance,
  smoothstep,
  u,
  Group,
  v,
  w,
  x,
  SphereGeometry,
  y,
  PlaneGeometry,
  z,
} from "./shared.js";
import { torusGeometry, superRingGeometry, sphereGeometry, partialSphereGeometry, standardMaterial, cylinderGeometry, brawlerRingGeometry, boxGeometry, playerDiscGeometry, capsuleGeometry } from "./world.js";

function createBrawlerModel(brawlerDefinition, hueShift = 0) {
  const palette = brawlerDefinition.palette;
  const materials = {
      body: standardMaterial(palette.body),
      accent: standardMaterial(palette.accent),
      skin: standardMaterial(palette.skin, { roughness: 0.72 }),
      dark: standardMaterial(palette.dark, { roughness: 0.8 }),
      metal: standardMaterial(10133938, { metalness: 0.75, roughness: 0.3 }),
      wood: standardMaterial(8014370, { roughness: 0.75 }),
      white: standardMaterial(16777215, { roughness: 0.35 }),
      black: standardMaterial(1381659, { roughness: 0.4 }),
  };
  if (hueShift) {
    materials.body.color.offsetHSL(hueShift, 0, 0);
    materials.accent.color.offsetHSL(hueShift * 0.6, 0, 0);
  }
  const muzzleMaterial = standardMaterial(3351040, { emissive: 16765562, emissiveIntensity: 3 });
  const root = new Group();
  const bodyGroup = new Group();
  root.add(bodyGroup);
  const addMesh = (parent, geometry, material, x = 0, y = 0, z = 0, scaleX = 1, scaleY = 1, scaleZ = 1) => {
      const mesh = new Mesh(geometry, material);
      return (
        mesh.position.set(x, y, z),
        mesh.scale.set(scaleX, scaleY, scaleZ),
        (mesh.castShadow = !0),
        (mesh.receiveShadow = !0),
        parent.add(mesh),
        mesh
      );
    },
    legs = [-1, 1].map((side) => {
      const leg = new Group();
      return (
        leg.position.set(side * 0.13, 0.37, 0),
        addMesh(leg, capsuleGeometry(0.09, 0.12), materials.dark, 0, -0.13, 0),
        addMesh(leg, sphereGeometry(0.11), materials.black, 0, -0.3, 0.05, 1, 0.62, 1.5),
        root.add(leg),
        leg
      );
    }),
    isTitan = brawlerDefinition.id === `titan`,
    torso = addMesh(
      bodyGroup,
      capsuleGeometry(0.235, 0.2),
      materials.body,
      0,
      0.6,
      0,
      isTitan ? 1.32 : 1,
      isTitan ? 1.08 : 1,
      isTitan ? 1.12 : 0.86,
    );
  const e = brawlerDefinition;
  const r = materials;
  const i = muzzleMaterial;
  const a = root;
  const o = bodyGroup;
  const s = addMesh;
  const c = legs;
  const l = isTitan;
  const u = torso;
  s(
    bodyGroup,
    cylinderGeometry(0.245, 0.245, 0.075),
    r.dark,
    0,
    0.42,
    0,
    l ? 1.28 : 1,
    1,
    l ? 1.1 : 0.88,
  );
  let d = new Group();
  (d.position.set(0, 1.07, 0), o.add(d));
  let f = s(d, sphereGeometry(0.3, 24, 18), l ? r.body : r.skin, 0, 0, 0, 1, 0.94, 0.97);
  for (let e of [-1, 1]) {
    (s(d, sphereGeometry(0.075), r.white, e * 0.115, 0.03, 0.252, 1, 1.2, 0.55),
      s(d, sphereGeometry(0.04), r.black, e * 0.112, 0.03, 0.29, 1, 1.2, 0.5));
    let t = s(d, boxGeometry(0.14, 0.036, 0.04), r.dark, e * 0.115, 0.14, 0.268);
    t.rotation.z = -e * 0.32;
  }
  let p = l ? 0.38 : 0.31,
    m = [-1, 1].map((e) => {
      let t = new Group();
      (t.position.set(e * p, 0.8, 0),
        s(t, capsuleGeometry(0.075, 0.15), l ? r.skin : r.body, 0, -0.12, 0));
      let n = s(
        t,
        sphereGeometry(l ? 0.165 : 0.095),
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
    h = new Group();
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
    (s(d, partialSphereGeometry(0.325, 0.56), r.accent, 0, 0.02, -0.025),
      s(d, sphereGeometry(0.13), r.accent, 0, 0.03, -0.34),
      s(d, sphereGeometry(0.09), r.accent, 0, -0.1, -0.42));
    let e = s(d, torusGeometry(0.295, 0.034), r.body, 0, 0.1, 0);
    ((e.rotation.x = Math.PI / 2), h.position.set(0.02, 0.63, 0.24));
    for (let e of [-1, 1])
      s(
        h,
        cylinderGeometry(0.045, 0.045, 0.62, 10),
        r.metal,
        e * 0.046,
        0.02,
        0.36,
      ).rotation.x = Math.PI / 2;
    (s(h, boxGeometry(0.1, 0.13, 0.34), r.wood, 0, -0.02, -0.06),
      s(h, boxGeometry(0.15, 0.085, 0.2), r.wood, 0, -0.04, 0.3),
      g.push(new Vector3(0.02, 0.65, 0.95)),
      (_.armBase = [
        [-1.35, 0.55],
        [-1.2, -0.4],
      ]));
  } else if (e.id === `ace`) {
    (s(d, cylinderGeometry(0.2, 0.235, 0.21), r.accent, 0, 0.29, 0),
      s(d, cylinderGeometry(0.47, 0.47, 0.036, 28), r.accent, 0, 0.19, 0, 1, 1, 0.92),
      s(d, cylinderGeometry(0.24, 0.24, 0.055), r.dark, 0, 0.215, 0));
    let e = s(o, torusGeometry(0.19, 0.06), r.accent, 0, 0.87, 0.02);
    ((e.rotation.x = Math.PI / 2), h.position.set(0, 0.67, 0.34));
    for (let e of [-1, 1])
      ((s(
        h,
        cylinderGeometry(0.035, 0.035, 0.32, 8),
        r.metal,
        e * 0.27,
        0.025,
        0.18,
      ).rotation.x = Math.PI / 2),
        (s(
          h,
          cylinderGeometry(0.058, 0.058, 0.09, 10),
          r.metal,
          e * 0.27,
          0.025,
          0.03,
        ).rotation.x = Math.PI / 2),
        s(h, boxGeometry(0.06, 0.14, 0.075), r.dark, e * 0.27, -0.055, -0.02),
        g.push(new Vector3(e * 0.27, 0.7, 0.72)));
    _.armBase = [
      [-1.45, 0.08],
      [-1.45, -0.08],
    ];
  } else if (e.id === `fuse`) {
    (s(d, partialSphereGeometry(0.335, 0.5), r.accent, 0, 0.04, 0),
      s(d, cylinderGeometry(0.365, 0.365, 0.035, 24), r.accent, 0, 0.06, 0.02),
      (s(d, cylinderGeometry(0.078, 0.078, 0.07, 12), r.metal, 0, 0.2, 0.3).rotation.x =
        Math.PI / 2));
    let e = s(d, sphereGeometry(0.062), i, 0, 0.2, 0.34, 1, 1, 0.4);
    ((e.castShadow = !1),
      s(d, sphereGeometry(0.2), r.white, 0, -0.17, 0.14, 1.12, 0.8, 0.72),
      h.position.set(0.31, 0.66, 0.36),
      s(h, sphereGeometry(0.15), r.black),
      s(h, cylinderGeometry(0.035, 0.035, 0.07, 8), r.metal, 0, 0.16, 0));
    let t = s(
      h,
      sphereGeometry(0.045),
      standardMaterial(3347456, { emissive: 16747050, emissiveIntensity: 4 }),
      0.01,
      0.23,
      0,
    );
    ((t.castShadow = !1),
      g.push(new Vector3(0.31, 0.8, 0.4)),
      (_.armBase = [
        [0, 0.12],
        [-1.3, -0.05],
      ]),
      (_.swingLeft = !0));
  } else {
    (s(d, sphereGeometry(0.2), r.skin, 0, -0.085, 0.2, 1, 0.78, 0.5),
      s(d, boxGeometry(0.065, 0.2, 0.44), r.accent, 0, 0.27, -0.02));
    for (let e of [-1, 1]) s(o, sphereGeometry(0.14), r.accent, e * 0.37, 0.88, 0);
    (f.scale.set(1, 0.96, 1),
      g.push(new Vector3(-0.3, 0.72, 0.55), new Vector3(0.3, 0.72, 0.55)),
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
let nextBrawlerId = 1;
class Brawler {
    constructor(e, t, n) {
      ((this.game = e),
        (this.def = t),
        (this.id = nextBrawlerId++),
        (this.isPlayer = !!n.isPlayer),
        (this.name = n.name),
        (this.model = createBrawlerModel(t, n.hueShift || 0)),
        (this.root = this.model.root),
        this.root.position.set(n.x, 0, n.z),
        e.scene.add(this.root));
      let r = this.isPlayer ? 4063114 : 16730682;
      if (
        ((this.ring = new Mesh(
          brawlerRingGeometry,
          new MeshBasicMaterial({ color: r, transparent: !0, opacity: 0.92, depthWrite: !1 }),
        )),
        (this.ring.position.y = 0.04),
        (this.ring.renderOrder = 2),
        (this.ring.userData.noAO = !0),
        this.root.add(this.ring),
        this.isPlayer)
      ) {
        let e = new Mesh(
          playerDiscGeometry,
          new MeshBasicMaterial({ color: r, transparent: !0, opacity: 0.16, depthWrite: !1 }),
        );
        ((e.position.y = 0.035),
          (e.renderOrder = 2),
          (e.userData.noAO = !0),
          this.root.add(e),
          (this.disc = e));
      }
      ((this.superRing = new Mesh(
        superRingGeometry,
        new MeshBasicMaterial({
          color: new Color(3.2, 2.3, 0.4),
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
        (this.vel = new Vector2()),
        (this.knock = new Vector2()),
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
        (this.lightColor = new Color(t.attack.color)),
        (this.superColor = new Color(t.super.color)));
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
    muzzleWorld(target) {
      const muzzles = this.model.muzzles;
      const muzzle = muzzles[this.muzzleIndex % muzzles.length];
      const cosAim = Math.cos(this.aimAngle);
      const sinAim = Math.sin(this.aimAngle);
      target.set(
        this.x + muzzle.x * cosAim + muzzle.z * sinAim,
        muzzle.y,
        this.z - muzzle.x * sinAim + muzzle.z * cosAim,
      );
      return target;
    }
    canAct() {
      return this.alive && !this.leap && this.game.state !== `countdown`;
    }
    attack(directionX, directionZ, targetX, targetZ) {
      if (!this.canAct() || this.ammo < 1 || this.fireCooldown > 0 || this.burst) return false;
      this.ammo--;
      this.startVolley(this.def.attack, directionX, directionZ, targetX, targetZ, false);
      return true;
    }
    useSuper(directionX, directionZ, targetX, targetZ) {
      if (!this.canAct() || !this.superReady || this.burst) return false;
      this.superCharge = 0;
      this.startVolley(this.def.super, directionX, directionZ, targetX, targetZ, true);
      this.game.audio.play(`super`);
      return true;
    }
    startVolley(ability, directionX, directionZ, targetX, targetZ, isSuper) {
      const directionLength = Math.hypot(directionX, directionZ) || 1;
      directionX /= directionLength;
      directionZ /= directionLength;
      (
        (this.aimAngle = Math.atan2(directionX, directionZ)),
        (this.aimHold = 0.55),
        (this.lastCombat = this.game.elapsed),
        (this.revealT = Math.max(this.revealT, 0.9)),
        (this.fireCooldown = 0.22));
      const combat = this.game.combat;
      if (ability.kind === `spread`) {
        this.recoil = 1;
        const muzzlePosition = this.muzzleWorld(new Vector3());
        for (let pelletIndex = 0; pelletIndex < ability.pellets; pelletIndex++) {
          const spreadOffset = ability.pellets === 1 ? 0 : pelletIndex / (ability.pellets - 1) - 0.5;
          const pelletAngle = this.aimAngle + spreadOffset * ability.spread + (Math.random() - 0.5) * 0.04;
          combat.spawnBullet(
            this,
            muzzlePosition.x,
            muzzlePosition.z,
            Math.sin(pelletAngle),
            Math.cos(pelletAngle),
            ability,
            isSuper,
            ability.speed * (0.94 + Math.random() * 0.12),
          );
        }
        (this.game.effects.muzzle(
          muzzlePosition.x,
          muzzlePosition.y,
          muzzlePosition.z,
          directionX,
          directionZ,
          this.bulletColor(isSuper),
          isSuper ? 1.6 : 1.1,
        ),
          this.game.audio.play(isSuper ? `blastBig` : `blast`, this.x, this.z),
          isSuper && this.knock.set(-directionX * 3, -directionZ * 3));
      } else if (ability.kind === `burst` || ability.kind === `melee`)
        ((this.burst = {
          a: ability,
          left: ability.count,
          timer: 0,
          dirX: directionX,
          dirZ: directionZ,
          isSuper,
        }),
          (this.fireCooldown = ability.count * ability.interval + 0.12));
      else if (ability.kind === `lob`) {
        this.recoil = 1;
        const travelDistance = Math.min(ability.range, Math.hypot(targetX - this.x, targetZ - this.z));
        const muzzlePosition = this.muzzleWorld(new Vector3());
        (combat.spawnBomb(this, muzzlePosition.x, muzzlePosition.y, muzzlePosition.z, this.x + directionX * travelDistance, this.z + directionZ * travelDistance, ability, isSuper),
          this.game.audio.play(`lob`, this.x, this.z),
          (this.fireCooldown = 0.3));
      } else if (ability.kind === `leap`) {
        const leapDistance = clamp(Math.hypot(targetX - this.x, targetZ - this.z), 2, ability.range);
        const landingPosition = this.game.world.nearestOpen(this.x + directionX * leapDistance, this.z + directionZ * leapDistance);
        ((this.leap = { a: ability, t: 0, sx: this.x, sz: this.z, tx: landingPosition.x, tz: landingPosition.z }),
          this.game.effects.dust(this.x, this.z, 10, 2.4),
          this.game.audio.play(`leap`, this.x, this.z));
      }
    }
    bulletColor(isSuper) {
      return isSuper ? this.superColor : this.lightColor;
    }
    fireBurstShot() {
      const burst = this.burst;
      if (!burst) return;
      const ability = burst.a;
      this.muzzleIndex++;
      this.recoil = 1;
      const muzzlePosition = this.muzzleWorld(new Vector3());
      const shotAngle = Math.atan2(burst.dirX, burst.dirZ) + (Math.random() - 0.5) * 2 * (ability.jitter || 0);
      const directionX = Math.sin(shotAngle);
      const directionZ = Math.cos(shotAngle);
      this.game.combat.spawnBullet(
        this,
        muzzlePosition.x, muzzlePosition.z, directionX, directionZ,
        ability, burst.isSuper, ability.speed,
      );
      if (ability.kind === `melee`) {
        this.punch[this.muzzleIndex % 2] = 1;
        this.game.audio.play(`punch`, this.x, this.z);
        return;
      }
      this.game.effects.muzzle(
        muzzlePosition.x, muzzlePosition.y, muzzlePosition.z,
        directionX, directionZ, this.bulletColor(burst.isSuper),
        burst.isSuper ? 1.1 : 0.75,
      );
      this.game.audio.play(burst.isSuper ? `shotBig` : `shot`, this.x, this.z);
    }
    addCharge(chargeAmount) {
      if (!this.alive) return;
      const wasReady = this.superReady;
      this.superCharge = Math.min(1, this.superCharge + chargeAmount / this.def.superCharge);
      if (!wasReady && this.superReady && this.isPlayer) this.game.audio.play(`ready`);
    }
    takeDamage(rawDamage, attacker, isGasDamage = false) {
      if (!this.alive || this.airborne || this.spawnT > 0) return 0;
      let damage = rawDamage;
      if (attacker && !attacker.isPlayer) damage *= this.isPlayer ? this.game.difficulty.damage : 0.34;
      if (attacker) {
        this.lastAttacker = attacker;
        this.lastHitTime = this.game.elapsed;
      }
      damage = Math.round(damage);
      const absorbedDamage = Math.min(this.hp, damage);
      this.hp -= damage;
      this.lastCombat = this.game.elapsed;
      this.regenT = 0;
      this.flash = 1;
      this.squash = 1;
      this.revealT = Math.max(this.revealT, 0.9);
      if (this.def.id === `titan`) this.addCharge(damage * 0.35);
      if (!this.hidden || this.isPlayer) this.game.hud.floatText(this.x, 1.7, this.z, `${damage}`, this.isPlayer ? `dmg-self` : `dmg`);
      if (attacker && attacker !== this) {
        attacker.addCharge(absorbedDamage);
        attacker.lastCombat = this.game.elapsed;
      }
      if (!isGasDamage) this.game.audio.play(`hit`, this.x, this.z);
      if (this.isPlayer) this.game.onPlayerHurt(damage);
      if (this.hp <= 0) this.die(attacker);
      return absorbedDamage;
    }
    heal(healAmount) {
      if (!this.alive || this.hp >= this.maxHp) return;
      const previousHp = this.hp;
      this.hp = Math.min(this.maxHp, this.hp + healAmount);
      const restoredHp = Math.round(this.hp - previousHp);
      if (restoredHp > 0 && (!this.hidden || this.isPlayer)) {
        this.game.hud.floatText(this.x, 1.7, this.z, `+${restoredHp}`, `heal`);
        this.game.effects.healPuff(this.x, this.z);
      }
    }
    addCube() {
      this.cubes++;
      const healthRatio = this.hp / this.maxHp;
      this.maxHp += GAME_CONFIG.cubeHp;
      this.hp = Math.min(this.maxHp, Math.round(this.maxHp * healthRatio) + GAME_CONFIG.cubeHp * 0.5);
      this.squash = -1;
    }
    die(killer) {
      if (!this.alive) return;
      this.alive = false;
      this.hp = 0;
      this.deadT = 0;
      this.burst = null;
      this.leap = null;
      if (killer && killer !== this) killer.kills++;
      this.game.onBrawlerDown(this, killer);
    }
    update(e) {
      let t = this.game,
        n = this.model;
      if (!this.alive) {
        this.deadT += e;
        let t = clamp(1 - this.deadT / 0.32, 0, 1);
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
        (this.recoil = damp(this.recoil, 0, 14, e)),
        (this.punch[0] = damp(this.punch[0], 0, 16, e)),
        (this.punch[1] = damp(this.punch[1], 0, 16, e)),
        (this.squash = damp(this.squash, 0, 12, e)),
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
        let a = clamp(i.t / i.a.flight, 0, 1);
        ((r.x = lerp(i.sx, i.tx, a)),
          (r.z = lerp(i.sz, i.tz, a)),
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
      ((this.facing = dampAngle(this.facing, a, this.aimHold > 0 ? 26 : 13, e)),
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
      ((n.legs[0].rotation.x = damp(n.legs[0].rotation.x, a, 20, e)),
        (n.legs[1].rotation.x = damp(n.legs[1].rotation.x, -a, 20, e)));
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
      ((f.opacity = damp(f.opacity, d ? 0.55 + Math.sin(r * 6) * 0.25 : 0, 8, e)),
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
  }
const pu = new Matrix4(),
  mu = new Quaternion(),
  hu = new Vector3(),
  gu = new Vector3(),
  _u = new Euler(),
  vu = new Color(),
  yu = 0.64,
  bu = 360;
function createLightningTexture() {
  let e = (e) => {
    let t = createCanvas(128, 128),
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
    let r = new CanvasTexture(t);
    return ((r.colorSpace = SRGBColorSpace), r);
  };
  return { map: e(!1), emissiveMap: e(!0) };
}
class Combat {
    constructor(game) {
      this.game = game;
      this.bullets = [];
      this.bombs = [];
      this.boxes = [];
      this.cubes = [];
      const bulletGeometry = new SphereGeometry(1, 10, 8);
      this.bulletMesh = new InstancedMesh(bulletGeometry, new MeshBasicMaterial({ color: 16777215 }), bu);
      this.bulletMesh.count = 0;
      this.bulletMesh.frustumCulled = false;
      this.bulletMesh.userData.noAO = true;
      this.bulletMesh.setColorAt(0, vu.set(1, 1, 1));
      game.scene.add(this.bulletMesh);
      this.bombPool = [];
      const bombGeometry = new SphereGeometry(0.2, 16, 12);
      const bombMaterial = new MeshStandardMaterial({ color: 1776418, roughness: 0.35, metalness: 0.3 });
      const sparkGeometry = new SphereGeometry(0.07, 8, 6);
      for (let index = 0; index < 14; index++) {
        const bombGroup = new Group();
        const bombMesh = new Mesh(bombGeometry, bombMaterial);
        bombMesh.castShadow = true;
        const sparkMesh = new Mesh(sparkGeometry, new MeshBasicMaterial({ color: new Color(6, 2.4, 0.5) }));
        sparkMesh.position.set(0, 0.24, 0);
        sparkMesh.userData.noAO = true;
        bombGroup.add(bombMesh, sparkMesh);
        bombGroup.visible = false;
        game.scene.add(bombGroup);
        const warningRing = new Mesh(
            new RingGeometry(0.93, 1, 56).rotateX(-Math.PI / 2),
            new MeshBasicMaterial({
              color: 16728112,
              transparent: !0,
              opacity: 0,
              depthWrite: !1,
            }),
          );
        const warningFill = new Mesh(
            new CircleGeometry(0.93, 48).rotateX(-Math.PI / 2),
            new MeshBasicMaterial({
              color: 16728112,
              transparent: !0,
              opacity: 0,
              depthWrite: !1,
            }),
          );
        warningRing.add(warningFill);
        warningRing.position.y = 0.05;
        warningRing.visible = false;
        warningRing.userData.noAO = true;
        warningRing.renderOrder = 2;
        game.scene.add(warningRing);
        this.bombPool.push({
            group: bombGroup,
            ring: warningRing,
            fillDisc: warningFill,
            spark: sparkMesh,
            busy: false,
        });
      }
      const lightningTextures = createLightningTexture();
      this.boxGeo = new BoxGeometry(0.92, 0.92, 0.92);
      this.boxTex = lightningTextures;
      this.cubeGeo = new BoxGeometry(0.34, 0.34, 0.34);
      this.cubeMat = new MeshStandardMaterial({
          color: 1870410,
          emissive: 3211136,
          emissiveIntensity: 2.4,
          roughness: 0.25,
          metalness: 0.2,
      });
      this.cubeLight = new Color(4259722);
      this.orange = new Color(16747066);
    }
    addBox(tileX, tileZ) {
      const world = this.game.world;
      const material = new MeshStandardMaterial({
          map: this.boxTex.map,
          emissiveMap: this.boxTex.emissiveMap,
          emissive: 16777215,
          emissiveIntensity: 1.4,
          roughness: 0.7,
        });
      const mesh = new Mesh(this.boxGeo, material);
      mesh.position.set(world.center(tileX), 0.46, world.center(tileZ));
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.game.scene.add(mesh);
      world.setBlocker(tileX, tileZ, true);
      const box = {
        tx: tileX,
        ty: tileZ,
        x: mesh.position.x,
        z: mesh.position.z,
        hp: GAME_CONFIG.boxHp,
        maxHp: GAME_CONFIG.boxHp,
        mesh,
        mat: material,
        shake: 0,
        alive: !0,
        isBox: !0,
      };
      this.boxes.push(box);
      return box;
    }
    boxAt(tileX, tileZ) {
      for (const box of this.boxes) {
        if (box.alive && box.tx === tileX && box.ty === tileZ) return box;
      }
      return null;
    }
    damageBox(box, damage, attacker) {
      if (!box.alive) return;
      box.hp -= damage;
      box.shake = 1;
      this.game.hud.floatText(box.x, 1.2, box.z, `${Math.round(damage)}`, `dmg`);
      if (attacker) attacker.lastCombat = this.game.elapsed;
      if (box.hp > 0) return;
      box.alive = false;
      this.game.scene.remove(box.mesh);
      box.mat.dispose();
      this.game.world.setBlocker(box.tx, box.ty, false);
      this.game.effects.debris(box.x, 0.5, box.z, 6968470, 9);
      this.game.effects.burst(box.x, 0.6, box.z, this.cubeLight, 16, 4.5);
      this.game.effects.flash(box.x, 0.8, box.z, this.cubeLight, 9, 6, 0.3);
      this.game.audio.play(`crate`, box.x, box.z);
      this.spawnCube(box.x, box.z, box.x, box.z);
    }
    spawnCube(startX, startZ, targetX, targetZ) {
      const mesh = new Mesh(this.cubeGeo, this.cubeMat);
      mesh.castShadow = true;
      mesh.position.set(startX, 0.5, startZ);
      this.game.scene.add(mesh);
      this.cubes.push({
          mesh,
          sx: startX,
          sz: startZ,
          x: targetX,
          z: targetZ,
          t: 0,
          alive: !0,
          phase: Math.random() * 6,
        });
    }
    dropCubes(originX, originZ, count) {
      const world = this.game.world;
      for (let index = 0; index < count; index++) {
        const angle = (index / count) * Math.PI * 2 + Math.random();
        const distance = count === 1 ? 0 : 0.7 + Math.random() * 0.5;
        const target = world.nearestOpen(originX + Math.cos(angle) * distance, originZ + Math.sin(angle) * distance);
        this.spawnCube(originX, originZ, target.x, target.z);
      }
    }
    spawnBullet(owner, x, z, directionX, directionZ, ability, isSuper, speed) {
      if (this.bullets.length >= bu) return;
      const color = owner.bulletColor(isSuper).clone();
      this.bullets.push({
        owner,
        x,
        z,
        dx: directionX,
        dz: directionZ,
        a: ability,
        isSuper,
        speed,
        travel: 0,
        range: ability.range,
        radius: ability.radius,
        damage: ability.damage * owner.damageMul,
        color,
        alive: !0,
        trail: 0,
        melee: ability.kind === `melee`,
      });
    }
    spawnBomb(owner, startX, startY, startZ, targetX, targetZ, ability, isSuper) {
      const bombSlot = this.bombPool.find((slot) => !slot.busy);
      if (!bombSlot) return;
      bombSlot.busy = true;
      bombSlot.group.visible = true;
      bombSlot.group.position.set(startX, startY, startZ);
      bombSlot.group.scale.setScalar(ability.big ? 1.75 : 1);
      bombSlot.ring.visible = true;
      bombSlot.ring.position.set(targetX, 0.05, targetZ);
      bombSlot.ring.scale.setScalar(ability.blast);
      const warningColor = isSuper ? 16761402 : 16728112;
      bombSlot.ring.material.color.set(warningColor);
      bombSlot.fillDisc.material.color.set(warningColor);
      this.bombs.push({
        owner,
        slot: bombSlot,
        sx: startX,
        sy: startY,
        sz: startZ,
        tx: targetX,
        tz: targetZ,
        a: ability,
        isSuper,
        t: 0,
        fuse: ability.fuse,
        landed: false,
        damage: ability.damage * owner.damageMul,
        color: owner.bulletColor(isSuper).clone(),
      });
    }
    breakTile(tileX, tileZ) {
      const game = this.game;
      const destroyedTile = game.world.destroyTile(tileX, tileZ);
      if (!destroyedTile) return;
      if (destroyedTile.type === TileType.BUSH) {
        game.effects.leaves(destroyedTile.x, destroyedTile.z, 14);
        return;
      }
      game.effects.debris(
              destroyedTile.x,
              0.6,
              destroyedTile.z,
              [12166540, 11565628, 10116910, 5216842][destroyedTile.style] ?? 12166540,
              10,
            );
      game.effects.dust(destroyedTile.x, destroyedTile.z, 8, 2.2);
      game.audio.play(`crate`, destroyedTile.x, destroyedTile.z);
    }
    explode(centerX, centerZ, ability, owner, isSlam, isSuper = false) {
      const game = this.game;
      const world = game.world;
      const blastRadius = ability.blast;
      const damage = ability.damage * owner.damageMul;
      for (const target of game.brawlers) {
        if (!target.alive || target === owner || target.airborne) continue;
        const distanceToTarget = Math.hypot(target.x - centerX, target.z - centerZ);
        if (distanceToTarget > blastRadius + 0.24) continue;
        target.takeDamage(damage, owner);
        if (ability.knockback) {
          const knockbackStrength = ability.knockback * (1 - (distanceToTarget / (blastRadius + 0.5)) * 0.5);
          const knockDirectionX = distanceToTarget > 0.01 ? (target.x - centerX) / distanceToTarget : 1;
          const knockDirectionZ = distanceToTarget > 0.01 ? (target.z - centerZ) / distanceToTarget : 0;
          target.knock.set(knockDirectionX * knockbackStrength, knockDirectionZ * knockbackStrength);
        }
      }
      for (const box of this.boxes) {
        if (box.alive && Math.hypot(box.x - centerX, box.z - centerZ) < blastRadius + 0.4) {
          this.damageBox(box, damage, owner);
        }
      }
      if (ability.breaksWalls) {
        const tileRadius = Math.ceil(blastRadius);
        const centerTileX = world.toTile(centerX);
        const centerTileZ = world.toTile(centerZ);
        for (let offsetZ = -tileRadius; offsetZ <= tileRadius; offsetZ++) {
          for (let offsetX = -tileRadius; offsetX <= tileRadius; offsetX++) {
            const tileCenterX = world.center(centerTileX + offsetX);
            const tileCenterZ = world.center(centerTileZ + offsetZ);
            if (Math.hypot(tileCenterX - centerX, tileCenterZ - centerZ) < blastRadius - 0.25) {
              this.breakTile(centerTileX + offsetX, centerTileZ + offsetZ);
            }
          }
        }
      }
      if (isSlam) game.effects.slam(centerX, centerZ, blastRadius, owner.superColor);
      else game.effects.explosion(centerX, centerZ, blastRadius, ability.big ? owner.superColor : this.orange, Boolean(ability.big));
      game.shake(ability.big || isSlam ? 0.55 : 0.24, centerX, centerZ);
      game.audio.play(ability.big || isSlam ? `boomBig` : `boom`, centerX, centerZ);
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
        let l = clamp((s.range - s.travel) / 0.8, 0.35, 1),
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
          let t = clamp(n.t / o.flight, 0, 1),
            r = o.big ? 4.4 : 3.3,
            s = lerp(n.sy, 0.2, t) + Math.sin(t * Math.PI) * r;
          (a.group.position.set(lerp(n.sx, n.tx, t), s, lerp(n.sz, n.tz, t)),
            (a.group.rotation.x += e * 9),
            (a.group.rotation.z += e * 5),
            t >= 1 && ((n.landed = !0), i.dust(n.tx, n.tz, 4, 1.4)));
        }
        let s = n.landed ? 1 - clamp(n.fuse / o.fuse, 0, 1) : 0,
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
        let a = clamp(n.t / 0.45, 0, 1),
          o = lerp(n.sx, n.x, a),
          s = lerp(n.sz, n.z, a),
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
  }
const Cu = new Matrix4(),
  wu = new Quaternion(),
  Tu = new Vector3(),
  Eu = new Vector3(),
  Du = new Euler(),
  Ou = new Color(),
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
  }`;
class ParticlePool {
    constructor(scene, capacity, additive) {
      this.cap = capacity;
      this.cursor = 0;
      this.additive = additive;
      this.pos = new Float32Array(capacity * 3);
      this.col = new Float32Array(capacity * 4);
      this.size = new Float32Array(capacity);
      this.vel = new Float32Array(capacity * 3);
      this.life = new Float32Array(capacity);
      this.maxLife = new Float32Array(capacity);
      this.size0 = new Float32Array(capacity);
      this.size1 = new Float32Array(capacity);
      this.alpha = new Float32Array(capacity);
      this.drag = new Float32Array(capacity);
      this.grav = new Float32Array(capacity);
      const geometry = new BufferGeometry();
      geometry.setAttribute(`position`, new BufferAttribute(this.pos, 3).setUsage(DynamicDrawUsage));
      geometry.setAttribute(`aColor`, new BufferAttribute(this.col, 4).setUsage(DynamicDrawUsage));
      geometry.setAttribute(`aSize`, new BufferAttribute(this.size, 1).setUsage(DynamicDrawUsage));
      this.material = new ShaderMaterial({
          uniforms: { uScale: { value: 600 }, uDim: { value: 1 } },
          vertexShader: ku,
          fragmentShader: Au,
          transparent: !0,
          depthWrite: !1,
          blending: additive ? 2 : 1,
      });
      this.points = new Points(geometry, this.material);
      this.points.frustumCulled = false;
      this.points.renderOrder = additive ? 8 : 7;
      scene.add(this.points);
    }
    emit(x, y, z, velocityX, velocityY, velocityZ, lifetime, startSize, endSize, red, green, blue, alpha = 1, drag = 1.5, gravity = 0) {
      const index = this.cursor;
      this.cursor = (index + 1) % this.cap;
      this.pos[index * 3] = x;
      this.pos[index * 3 + 1] = y;
      this.pos[index * 3 + 2] = z;
      this.vel[index * 3] = velocityX;
      this.vel[index * 3 + 1] = velocityY;
      this.vel[index * 3 + 2] = velocityZ;
      this.life[index] = lifetime;
      this.maxLife[index] = lifetime;
      this.size0[index] = startSize;
      this.size1[index] = endSize;
      this.col[index * 4] = red;
      this.col[index * 4 + 1] = green;
      this.col[index * 4 + 2] = blue;
      this.alpha[index] = alpha;
      this.drag[index] = drag;
      this.grav[index] = gravity;
    }
    update(deltaTime) {
      let {
        pos, vel, life, maxLife, size, size0, size1, col, alpha, drag, grav,
      } = this;
      for (let index = 0; index < this.cap; index++) {
        if (life[index] <= 0) {
          size[index] = 0;
          continue;
        }
        life[index] -= deltaTime;
        const progress = 1 - Math.max(0, life[index]) / maxLife[index];
        const dragFactor = Math.exp(-drag[index] * deltaTime);
        vel[index * 3] *= dragFactor;
        vel[index * 3 + 1] = vel[index * 3 + 1] * dragFactor - grav[index] * deltaTime;
        vel[index * 3 + 2] *= dragFactor;
        pos[index * 3] += vel[index * 3] * deltaTime;
        pos[index * 3 + 1] += vel[index * 3 + 1] * deltaTime;
        pos[index * 3 + 2] += vel[index * 3 + 2] * deltaTime;
        if (pos[index * 3 + 1] < 0.03 && grav[index] > 0) {
          pos[index * 3 + 1] = 0.03;
          vel[index * 3 + 1] *= -0.35;
        }
        size[index] = life[index] <= 0 ? 0 : size0[index] + (size1[index] - size0[index]) * progress;
        col[index * 4 + 3] = alpha[index] * (1 - progress * progress);
      }
      const particleGeometry = this.points.geometry;
      particleGeometry.attributes.position.needsUpdate = true;
      particleGeometry.attributes.aColor.needsUpdate = true;
      particleGeometry.attributes.aSize.needsUpdate = true;
    }
  };
function createSmokeTexture() {
  const canvas = createCanvas(128, 128);
  const context = canvas.getContext(`2d`);
  const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 62);
  gradient.addColorStop(0, `rgba(10,6,4,0.85)`);
  gradient.addColorStop(0.45, `rgba(14,9,6,0.6)`);
  gradient.addColorStop(0.8, `rgba(20,12,8,0.18)`);
  gradient.addColorStop(1, `rgba(20,12,8,0)`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  for (let speckIndex = 0; speckIndex < 26; speckIndex++) {
    const angle = Math.random() * 6.28;
    const distanceFromCenter = 20 + Math.random() * 38;
    context.fillStyle = `rgba(8,5,3,0.35)`;
    context.beginPath();
    context.arc(
        64 + Math.cos(angle) * distanceFromCenter,
        64 + Math.sin(angle) * distanceFromCenter,
        2 + Math.random() * 5,
        0,
        7,
      );
    context.fill();
  }
  return new CanvasTexture(canvas);
}
class Effects {
    constructor(game) {
      this.game = game;
      const scene = game.scene;
      this.glow = new ParticlePool(scene, 1800, true);
      this.smoke = new ParticlePool(scene, 900, false);
      this.flashes = [];
      this.debrisCap = 140;
      this.debrisMesh = new InstancedMesh(
          new BoxGeometry(1, 1, 1),
          new MeshStandardMaterial({ color: 16777215, roughness: 0.85 }),
          this.debrisCap,
        );
      this.debrisMesh.castShadow = true;
      this.debrisMesh.receiveShadow = true;
      this.debrisMesh.frustumCulled = false;
      this.debrisData = [];
      for (let debrisIndex = 0; debrisIndex < this.debrisCap; debrisIndex++) {
        this.debrisData.push({
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
        });
        this.debrisMesh.setMatrixAt(debrisIndex, Cu.makeScale(0, 0, 0));
        this.debrisMesh.setColorAt(debrisIndex, Ou.set(16777215));
      }
      this.debrisCursor = 0;
      scene.add(this.debrisMesh);
      this.decals = [];
      const smokeTexture = createSmokeTexture();
      const decalGeometry = new PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
      for (let decalIndex = 0; decalIndex < 18; decalIndex++) {
        const decalMesh = new Mesh(
          decalGeometry,
          new MeshBasicMaterial({
            map: smokeTexture,
            transparent: !0,
            opacity: 0,
            depthWrite: !1,
            color: 0,
          }),
        );
        decalMesh.visible = false;
        decalMesh.renderOrder = 1;
        decalMesh.userData.noAO = true;
        scene.add(decalMesh);
        this.decals.push({ mesh: decalMesh, life: 0 });
      }
      this.decalCursor = 0;
      this.rings = [];
      const ringGeometry = new RingGeometry(0.82, 1, 64).rotateX(-Math.PI / 2);
      for (let ringIndex = 0; ringIndex < 10; ringIndex++) {
        const ringMesh = new Mesh(
          ringGeometry,
          new MeshBasicMaterial({
            color: 16777215,
            transparent: !0,
            opacity: 0,
            depthWrite: !1,
            blending: 2,
          }),
        );
        ringMesh.visible = false;
        ringMesh.renderOrder = 6;
        ringMesh.userData.noAO = true;
        scene.add(ringMesh);
        this.rings.push({ mesh: ringMesh, t: 0, T: 0, r: 1 });
      }
      this.ringCursor = 0;
      this.buildFireflies();
    }
    buildFireflies() {
      let e = this.game.world,
        t = [],
        n = e.meshes.bush,
        r = new Float32Array(270),
        i = new Float32Array(90),
        a = new Matrix4();
      for (let e = 0; e < 90; e++)
        (n && n.count > 0
          ? (n.getMatrixAt(Math.floor(Math.random() * n.count), a),
            Tu.setFromMatrixPosition(a))
          : Tu.set(randomRange(-18, 18), 0, randomRange(-18, 18)),
          (r[e * 3] = Tu.x + randomRange(-1.4, 1.4)),
          (r[e * 3 + 1] = randomRange(0.5, 1.9)),
          (r[e * 3 + 2] = Tu.z + randomRange(-1.4, 1.4)),
          (i[e] = Math.random() * 100),
          t.push(e));
      let o = new BufferGeometry();
      (o.setAttribute(`position`, new BufferAttribute(r, 3)),
        o.setAttribute(`aPhase`, new BufferAttribute(i, 1)),
        (this.fireflyMat = new ShaderMaterial({
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
        (this.fireflies = new Points(o, this.fireflyMat)),
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
    spark(x, y, z, color) {
      this.glow.emit(
        x,
        y,
        z,
        randomRange(-1.4, 1.4),
        randomRange(0.6, 2.6),
        randomRange(-1.4, 1.4),
        randomRange(0.18, 0.4),
        0.14,
        0.02,
        color.r * 5,
        color.g * 5,
        color.b * 5,
        1,
        2,
        7,
      );
    }
    trail(x, y, z, color, radius) {
      this.glow.emit(
        x + randomRange(-0.04, 0.04),
        y + randomRange(-0.04, 0.04),
        z + randomRange(-0.04, 0.04),
        0,
        0,
        0,
        0.15,
        radius * 1.35,
        0.02,
        color.r * 1.15,
        color.g * 1.15,
        color.b * 1.15,
        0.5,
        0,
        0,
      );
    }
    impact(x, y, z, color, particleCount) {
      for (let particleIndex = 0; particleIndex < particleCount; particleIndex++) {
        const angle = Math.random() * 6.28;
        const speed = randomRange(1.5, 5);
        this.glow.emit(
          x,
          y,
          z,
          Math.cos(angle) * speed,
          randomRange(0.5, 3.5),
          Math.sin(angle) * speed,
          randomRange(0.15, 0.35),
          0.15,
          0.02,
          color.r * 3.2,
          color.g * 3.2,
          color.b * 3.2,
          1,
          3,
          9,
        );
      }
      this.glow.emit(
        x,
        y,
        z,
        0,
        0,
        0,
        0.1,
        0.7,
        0.2,
        color.r * 1.6,
        color.g * 1.6,
        color.b * 1.6,
        0.8,
        0,
        0,
      );
    }
    burst(x, y, z, color, particleCount, spread) {
      for (let particleIndex = 0; particleIndex < particleCount; particleIndex++) {
        const angle = Math.random() * 6.28;
        const speed = randomRange(0.4, 1) * spread;
        this.glow.emit(
          x,
          y,
          z,
          Math.cos(angle) * speed,
          randomRange(1, 4.5),
          Math.sin(angle) * speed,
          randomRange(0.35, 0.7),
          0.2,
          0.03,
          color.r * 4,
          color.g * 4,
          color.b * 4,
          1,
          2.2,
          8,
        );
      }
    }
    muzzle(x, y, z, directionX, directionZ, color, scale) {
      (this.flash(x + directionX * 0.2, y + 0.1, z + directionZ * 0.2, color, 6.5 * scale, 5.5, 0.09),
        this.glow.emit(
          x + directionX * 0.1,
          y,
          z + directionZ * 0.1,
          directionX * 1.5,
          0,
          directionZ * 1.5,
          0.07,
          0.95 * scale,
          0.3,
          color.r * 3,
          color.g * 3,
          color.b * 3,
          1,
          0,
          0,
        ));
      for (let flashParticleIndex = 0; flashParticleIndex < 5; flashParticleIndex++) {
        const spreadLimit = 0.5;
        const velocityX = directionX * randomRange(4, 9) + randomRange(-0.5, spreadLimit) * 3;
        const velocityZ = directionZ * randomRange(4, 9) + randomRange(-0.5, spreadLimit) * 3;
        this.glow.emit(
          x,
          y,
          z,
          velocityX,
          randomRange(-0.5, 1.5),
          velocityZ,
          randomRange(0.08, 0.2),
          0.13,
          0.02,
          color.r * 5,
          color.g * 5,
          color.b * 5,
          1,
          4,
          3,
        );
      }
      this.smoke.emit(
        x + directionX * 0.15,
        y + 0.05,
        z + directionZ * 0.15,
        directionX * 0.9,
        0.5,
        directionZ * 0.9,
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
    dust(x, z, particleCount, spread) {
      for (let particleIndex = 0; particleIndex < particleCount; particleIndex++) {
        const angle = Math.random() * 6.28;
        const speed = randomRange(0.4, 1) * spread;
        this.smoke.emit(
          x + Math.cos(angle) * 0.2,
          0.12,
          z + Math.sin(angle) * 0.2,
          Math.cos(angle) * speed,
          randomRange(0.2, 0.9),
          Math.sin(angle) * speed,
          randomRange(0.5, 0.95),
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
    footDust(x, z) {
      this.smoke.emit(
        x + randomRange(-0.1, 0.1),
        0.06,
        z + randomRange(-0.1, 0.1),
        randomRange(-0.2, 0.2),
        0.35,
        randomRange(-0.2, 0.2),
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
    leaves(x, z, particleCount) {
      for (let particleIndex = 0; particleIndex < particleCount; particleIndex++) {
        const angle = Math.random() * 6.28;
        this.smoke.emit(
          x + randomRange(-0.3, 0.3),
          randomRange(0.3, 0.9),
          z + randomRange(-0.3, 0.3),
          Math.cos(angle) * randomRange(0.6, 2.2),
          randomRange(1.2, 3),
          Math.sin(angle) * randomRange(0.6, 2.2),
          randomRange(0.5, 0.9),
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
    healPuff(x, z) {
      for (let particleIndex = 0; particleIndex < 5; particleIndex++)
        this.glow.emit(
          x + randomRange(-0.4, 0.4),
          randomRange(0.4, 1.2),
          z + randomRange(-0.4, 0.4),
          0,
          randomRange(0.8, 1.6),
          0,
          randomRange(0.4, 0.7),
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
    debris(x, y, z, color, pieceCount) {
      for (let pieceIndex = 0; pieceIndex < pieceCount; pieceIndex++) {
        const debrisIndex = this.debrisCursor;
        this.debrisCursor = (debrisIndex + 1) % this.debrisCap;
        const piece = this.debrisData[debrisIndex];
        const angle = Math.random() * 6.28;
        const speed = randomRange(1.2, 4.2);
        piece.life = randomRange(1.6, 2.6);
        piece.x = x + randomRange(-0.3, 0.3);
        piece.y = y + randomRange(-0.2, 0.4);
        piece.z = z + randomRange(-0.3, 0.3);
        piece.vx = Math.cos(angle) * speed;
        piece.vy = randomRange(3, 7);
        piece.vz = Math.sin(angle) * speed;
        piece.rx = randomRange(0, 6);
        piece.ry = randomRange(0, 6);
        piece.rz = randomRange(0, 6);
        piece.wx = randomRange(-9, 9);
        piece.wy = randomRange(-9, 9);
        piece.wz = randomRange(-9, 9);
        piece.s = randomRange(0.12, 0.27);
        Ou.set(color).offsetHSL(0, 0, randomRange(-0.06, 0.06));
        this.debrisMesh.setColorAt(debrisIndex, Ou);
      }
      this.debrisMesh.instanceColor.needsUpdate = !0;
    }
    ring(x, z, radius, color, duration = 0.4, brightness = 3) {
      const ring = this.rings[this.ringCursor];
      this.ringCursor = (this.ringCursor + 1) % this.rings.length;
      ring.t = 0;
      ring.T = duration;
      ring.r = radius;
      ring.mesh.visible = true;
      ring.mesh.position.set(x, 0.09, z);
      ring.mesh.material.color.copy(color).multiplyScalar(brightness);
    }
    decal(x, z, radius) {
      const decal = this.decals[this.decalCursor];
      this.decalCursor = (this.decalCursor + 1) % this.decals.length;
      decal.life = 14;
      decal.mesh.visible = true;
      decal.mesh.position.set(x, 0.022 + this.decalCursor * 8e-4, z);
      decal.mesh.rotation.y = Math.random() * 6.28;
      decal.mesh.scale.setScalar(radius * 1.9);
    }
    explosion(x, z, radius, color, isLarge) {
      const glowParticleCount = isLarge ? 46 : 24;
      this.flash(x, 1.1, z, color, isLarge ? 95 : 48, isLarge ? 15 : 10, isLarge ? 0.5 : 0.34);
      this.ring(x, z, radius * 1.15, color, isLarge ? 0.5 : 0.36);
      this.decal(x, z, radius * 0.85);
      this.glow.emit(x, 0.6, z, 0, 0.5, 0, 0.22, radius * 3.2, radius * 0.8, color.r * 6, color.g * 5, color.b * 4, 1, 0, 0);
      for (let particleIndex = 0; particleIndex < glowParticleCount; particleIndex++) {
        const angle = Math.random() * 6.28;
        const speed = randomRange(0.3, 1) * radius * 4.2;
        const colorVariation = Math.random();
        this.glow.emit(x, 0.4, z, Math.cos(angle) * speed, randomRange(1, 6), Math.sin(angle) * speed, randomRange(0.3, 0.75), randomRange(0.25, 0.6), 0.04, (1 + colorVariation) * 3.2, (0.4 + colorVariation * 0.6) * 3, 0.75, 1, 2.6, 6);
      }
      const smokeParticleCount = isLarge ? 16 : 9;
      for (let particleIndex = 0; particleIndex < smokeParticleCount; particleIndex++) {
        const angle = Math.random() * 6.28;
        const speed = randomRange(0.2, 1) * radius * 1.6;
        this.smoke.emit(x + Math.cos(angle) * 0.3, randomRange(0.3, 0.9), z + Math.sin(angle) * 0.3, Math.cos(angle) * speed, randomRange(0.8, 2.6), Math.sin(angle) * speed, randomRange(0.9, 1.7), radius * 0.7, radius * 1.9, 0.22, 0.2, 0.2, 0.55, 1.6, -0.5);
      }
      this.dust(x, z, isLarge ? 14 : 8, radius * 2.2);
    }
    slam(x, z, radius, color) {
      this.flash(x, 0.9, z, color, 40, 10, 0.32);
      this.ring(x, z, radius * 1.2, color, 0.42, 2.4);
      this.decal(x, z, radius * 0.6);
      this.dust(x, z, 22, radius * 3.2);
      for (let particleIndex = 0; particleIndex < 18; particleIndex++) {
        const angle = Math.random() * 6.28;
        const speed = randomRange(2, 7);
        this.glow.emit(x, 0.2, z, Math.cos(angle) * speed, randomRange(1, 4), Math.sin(angle) * speed, randomRange(0.25, 0.5), 0.2, 0.03, color.r * 4, color.g * 4, color.b * 4, 1, 2.5, 8);
      }
    }
    defeat(x, z, color) {
      this.flash(x, 1, z, color, 26, 8, 0.4);
      this.ring(x, z, 1.6, color, 0.45, 2.2);
      this.burst(x, 0.8, z, color, 26, 5);
      for (let particleIndex = 0; particleIndex < 8; particleIndex++) {
        this.smoke.emit(x + randomRange(-0.3, 0.3), randomRange(0.3, 1.2), z + randomRange(-0.3, 0.3), randomRange(-0.6, 0.6), randomRange(0.8, 2), randomRange(-0.6, 0.6), randomRange(0.7, 1.2), 0.5, 1.4, 0.85, 0.85, 0.9, 0.5, 1.4, -0.3);
      }
    }
    update(deltaTime) {
      const game = this.game;
      const lighting = game.lighting;
      const renderScale = game.pipeline.renderer.getDrawingBufferSize(new Vector2()).y / (2 * Math.tan((game.camera.fov * Math.PI) / 360));
      const glowUniforms = this.glow.material?.uniforms;
      const smokeUniforms = this.smoke.material?.uniforms;
      const fireflyUniforms = this.fireflyMat?.uniforms;
      if (glowUniforms?.uScale) glowUniforms.uScale.value = renderScale;
      if (smokeUniforms?.uScale) smokeUniforms.uScale.value = renderScale;
      if (smokeUniforms?.uDim) smokeUniforms.uDim.value = lighting.ambientLevel;
      if (fireflyUniforms?.uScale) fireflyUniforms.uScale.value = renderScale;
      if (fireflyUniforms?.uTime) fireflyUniforms.uTime.value = game.elapsed;
      if (fireflyUniforms?.uNight) fireflyUniforms.uNight.value = lighting.night;
      this.fireflies.visible = lighting.night > 0.01;
      this.glow.update(deltaTime);
      this.smoke.update(deltaTime);
      for (const flash of this.flashes) {
        flash.t += deltaTime;
        const remainingIntensity = 1 - clamp(flash.t / flash.T, 0, 1);
        lighting.addLight(flash.x, flash.y, flash.z, flash.color, flash.intensity * remainingIntensity * remainingIntensity, flash.distance);
      }
      this.flashes = this.flashes.filter((flash) => flash.t < flash.T);
      let hasActiveDebris = false;
      for (let debrisIndex = 0; debrisIndex < this.debrisCap; debrisIndex++) {
        const debris = this.debrisData[debrisIndex];
        if (debris.life <= 0) continue;
        hasActiveDebris = true;
        debris.life -= deltaTime;
        debris.vy -= 19 * deltaTime;
        debris.x += debris.vx * deltaTime;
        debris.y += debris.vy * deltaTime;
        debris.z += debris.vz * deltaTime;
        const halfSize = debris.s * 0.5;
        if (debris.y < halfSize) {
          debris.y = halfSize;
          debris.vy *= -0.38;
          debris.vx *= 0.6;
          debris.vz *= 0.6;
          debris.wx *= 0.5;
          debris.wy *= 0.5;
          debris.wz *= 0.5;
        }
        debris.rx += debris.wx * deltaTime;
        debris.ry += debris.wy * deltaTime;
        debris.rz += debris.wz * deltaTime;
        const debrisScale = debris.life <= 0 ? 0 : debris.s * clamp(debris.life / 0.4, 0, 1);
        Du.set(debris.rx, debris.ry, debris.rz);
        wu.setFromEuler(Du);
        Cu.compose(Tu.set(debris.x, debris.y, debris.z), wu, Eu.set(debrisScale, debrisScale, debrisScale));
        this.debrisMesh.setMatrixAt(debrisIndex, Cu);
      }
      if (hasActiveDebris) this.debrisMesh.instanceMatrix.needsUpdate = true;
      for (const decal of this.decals) {
        if (decal.life <= 0) continue;
        decal.life -= deltaTime;
        decal.mesh.material.opacity = clamp(decal.life / 4, 0, 1) * 0.55;
        if (decal.life <= 0) decal.mesh.visible = false;
      }
      for (const ring of this.rings) {
        if (!ring.mesh.visible) continue;
        ring.t += deltaTime;
        const progress = clamp(ring.t / ring.T, 0, 1);
        const easedProgress = 1 - (1 - progress) * (1 - progress);
        ring.mesh.scale.setScalar(0.2 + easedProgress * ring.r);
        ring.mesh.material.opacity = (1 - progress) * 0.9;
        if (progress >= 1) ring.mesh.visible = false;
      }
    }
  }
const Pu = `
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
  Iu = [0.34, 0.3, 0.26];
class GasRing {
    constructor(e) {
      ((this.game = e),
        (this.half = GAME_CONFIG.gasStartHalf),
        (this.round = 5),
        (this.layers = []),
        (this.tickT = 0),
        (this.ticks = 0));
      let t = new PlaneGeometry(104, 104).rotateX(-Math.PI / 2);
      ([0.3, 0.72, 1.12].forEach((n, r) => {
        let i = new ShaderMaterial({
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
          a = new Mesh(t, i);
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
      this.half = GAME_CONFIG.gasStartHalf;
      this.tickT = 0;
      this.ticks = 0;
      this.active = false;
      for (const layer of this.layers) layer.visible = false;
    }
    depthAt(worldX, worldZ) {
      const horizontalDistance = Math.abs(worldX) - (this.half - this.round);
      const verticalDistance = Math.abs(worldZ) - (this.half - this.round);
      return (
        Math.hypot(Math.max(horizontalDistance, 0), Math.max(verticalDistance, 0)) +
        Math.min(Math.max(horizontalDistance, verticalDistance), 0) -
        this.round
      );
    }
    update(deltaTime, matchTime) {
      const game = this.game;
      const progress = clamp((matchTime - GAME_CONFIG.gasDelay) / GAME_CONFIG.gasDuration, 0, 1);
      this.active = matchTime > GAME_CONFIG.gasDelay - 6;
      this.half = lerp(GAME_CONFIG.gasStartHalf, GAME_CONFIG.gasEndHalf, progress);
      this.round = lerp(5, 2.2, progress);
      const warningProgress = smoothstep(GAME_CONFIG.gasDelay - 6, GAME_CONFIG.gasDelay, matchTime);
      this.layers.forEach((layer, layerIndex) => {
          layer.visible = this.active;
          const uniforms = layer.material?.uniforms;
          if (!uniforms) return;
          if (uniforms.uTime) uniforms.uTime.value = game.elapsed;
          if (uniforms.uHalf) uniforms.uHalf.value = this.half;
          if (uniforms.uRound) uniforms.uRound.value = this.round;
          const ambientProgress = clamp((game.lighting.ambientLevel - 0.36) / 0.64, 0, 1);
          if (uniforms.uAmbient) uniforms.uAmbient.value = lerp(0.2, 1, ambientProgress);
          if (uniforms.uGlow) uniforms.uGlow.value = (0.55 + game.lighting.night * 0.3) * warningProgress;
          if (uniforms.uAlpha) uniforms.uAlpha.value = Iu[layerIndex] * warningProgress;
      });
      if (matchTime < GAME_CONFIG.gasDelay) return;
      this.tickT += deltaTime;
      if (this.tickT < 1) return;
      this.tickT -= 1;
      this.ticks++;
      const gasDamage = 600 + Math.min(this.ticks, 60) * 25;
      for (const brawler of game.brawlers) {
        if (brawler.alive && !brawler.airborne && this.depthAt(brawler.x, brawler.z) > 0.35) {
          brawler.takeDamage(gasDamage, null, true);
          if (brawler.isPlayer) game.audio.play(`gas`);
        }
      }
    }
  }
const Ru = 9,
  zu = 4.5,
  Bu = 2.4;
class Bot {
    constructor(game, brawler) {
      this.game = game;
      this.b = brawler;
      this.thinkT = randomRange(0, 0.35);
      this.state = `loot`;
      this.target = null;
      this.box = null;
      this.goal = null;
      this.path = null;
      this.pathI = 0;
      this.repathT = 0;
      this.strafeDir = Math.random() < 0.5 ? 1 : -1;
      this.strafeT = randomRange(0.6, 1.6);
      this.reactT = 0;
      this.shootT = randomRange(0.4, 1);
      this.stuckT = 0;
      this.lastX = brawler.x;
      this.lastZ = brawler.z;
      this.jitterT = 0;
      this.jx = 0;
      this.jz = 0;
      this.wanderT = 0;
      const [minimumSkill, maximumSkill] = game.difficulty.skill;
      this.skill = randomRange(minimumSkill, maximumSkill);
      this.thrower = brawler.def.attack.kind === `lob`;
    }
    canSee(target, distanceToTarget) {
      if (distanceToTarget > Ru || (target.inBush && distanceToTarget > Bu && target.revealT <= 0)) return false;
      if (this.thrower && distanceToTarget < 8) return true;
      return distanceToTarget < 2.5 || this.game.world.hasLineOfSight(this.b.x, this.b.z, target.x, target.z);
    }
    seesBox(box) {
      const hit = this.game.world.raycast(this.b.x, this.b.z, box.x, box.z);
      return !hit || (hit.tx === box.tx && hit.ty === box.ty);
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
        let r = distance(e.x, e.z, n.x, n.z),
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
        (this.reactT = randomRange(0.22, 0.5) * (2 - this.skill) * t.difficulty.react),
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
          ((s = clamp(s, -d, d)), (u = clamp(u, -d, d)), (c = n.nearestOpen(s, u)));
        } else l = `fight`;
      } else {
        let i = null,
          a = 9;
        for (let n of t.combat.cubes) {
          let t = distance(e.x, e.z, n.x, n.z);
          t < a && r.depthAt(n.x, n.z) < -0.5 && ((i = n), (a = t));
        }
        if (i) ((l = `cube`), (c = { x: i.x, z: i.z }));
        else {
          let i = null,
            a = 26;
          for (let n of t.combat.boxes) {
            if (!n.alive || n.skipBy === e.id) continue;
            let t = distance(e.x, e.z, n.x, n.z);
            t < a && r.depthAt(n.x, n.z) < -2 && ((i = n), (a = t));
          }
          if (((this.box = i), i)) ((l = `box`), (c = { x: i.x, z: i.z }));
          else {
            if (
              ((l = `wander`),
              (this.wanderT -= 0.3),
              !this.goal ||
                this.wanderT <= 0 ||
                distance(e.x, e.z, this.goal.x, this.goal.z) < 1.2)
            ) {
              let e = Math.max(2, Math.min(r.half - 4, 17));
              ((this.wanderGoal = n.nearestOpen(randomRange(-e, e), randomRange(-e, e))),
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
              distance(c.x, c.z, this.goal.x, this.goal.z) > 1.4 ||
              this.repathT <= 0 ||
              !this.path) &&
            this.planTo(c)
          : ((this.goal = null), (this.path = null)));
    }
    planTo(goal) {
      const brawler = this.b;
      const world = this.game.world;
      const gas = this.game.gas;
      this.goal = goal;
      this.repathT = 1.3;
      const gasPenalty = gas.active
        ? (tileX, tileZ) => (gas.depthAt(world.center(tileX), world.center(tileZ)) > -0.5 ? 6 : 0)
        : null;
      this.path = world.findPath(world.toTile(brawler.x), world.toTile(brawler.z), world.toTile(goal.x), world.toTile(goal.z), gasPenalty);
      this.pathI = 0;
      if (!this.path && this.box) {
        this.box.skipBy = brawler.id;
        this.box = null;
      }
    }
    followPath() {
      const brawler = this.b;
      if (!this.path || this.pathI >= this.path.length) return [0, 0];
      const world = this.game.world;
      let [tileX, tileZ] = this.path[this.pathI];
      let targetX = world.center(tileX);
      let targetZ = world.center(tileZ);
      if (distance(brawler.x, brawler.z, targetX, targetZ) < 0.36) {
        if ((this.pathI++, this.pathI >= this.path.length)) return [0, 0];
        [tileX, tileZ] = this.path[this.pathI];
        targetX = world.center(tileX);
        targetZ = world.center(tileZ);
      }
      const distanceToWaypoint = distance(brawler.x, brawler.z, targetX, targetZ) || 1;
      return [(targetX - brawler.x) / distanceToWaypoint, (targetZ - brawler.z) / distanceToWaypoint];
    }
    aimAt(targetX, targetZ, targetVelocityX, targetVelocityZ, ability) {
      const brawler = this.b;
      const distanceToTarget = distance(brawler.x, brawler.z, targetX, targetZ);
      const leadTime = ability.kind === `lob` ? ability.flight + ability.fuse * 0.7 : distanceToTarget / (ability.speed || 14);
      const predictionScale = 0.8 * this.skill;
      const predictedX = targetX + targetVelocityX * leadTime * predictionScale;
      const predictedZ = targetZ + targetVelocityZ * leadTime * predictionScale;
      const aimJitter = (Math.random() - 0.5) * 2 * (0.05 + (1 - this.skill) * 0.3);
      const aimAngle = Math.atan2(predictedX - brawler.x, predictedZ - brawler.z) + aimJitter;
      const aimDistance = distance(brawler.x, brawler.z, predictedX, predictedZ);
      return {
        dx: Math.sin(aimAngle),
        dz: Math.cos(aimAngle),
        x: brawler.x + Math.sin(aimAngle) * aimDistance,
        z: brawler.z + Math.cos(aimAngle) * aimDistance,
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
        let n = distance(t.x, t.z, s.x, s.z) || 0.001;
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
              ((this.strafeT = randomRange(0.5, 1.5)), (this.strafeDir *= -1)));
          let u = c < 2.5 ? 0.25 : 0.85;
          ((a = r * l + -i * this.strafeDir * u),
            (o = i * l + r * this.strafeDir * u));
        }
      } else
        this.state === `box` && this.box && this.box.alive
          ? (distance(t.x, t.z, this.box.x, this.box.z) >
              Math.min(i.range * 0.7, 5) ||
              !this.seesBox(this.box)) &&
            ([a, o] = this.followPath())
          : ([a, o] = this.followPath());
      if (((this.stuckT += e), this.stuckT > 0.6)) {
        let e = distance(t.x, t.z, this.lastX, this.lastZ);
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
        let e = distance(t.x, t.z, s.x, s.z),
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
            t.useSuper(e.dx, e.dz, e.x, e.z) && (this.shootT = randomRange(0.4, 0.8));
          }
        }
        if (a && e < i.range * 0.95 && this.shootT <= 0 && t.ammo >= 1) {
          let e = this.aimAt(s.x, s.z, s.vel.x, s.vel.y, i);
          t.attack(e.dx, e.dz, e.x, e.z) &&
            (this.shootT =
              (randomRange(0.45, 1) + (t.ammo < 1 ? 0.4 : 0)) *
              (s.isPlayer ? n.difficulty.cadence : 1));
        }
      } else if (
        this.state === `box` &&
        this.box &&
        this.box.alive &&
        this.shootT <= 0 &&
        t.ammo >= 1
      ) {
        let e = distance(t.x, t.z, this.box.x, this.box.z);
        if (e < i.range * 0.85 && (this.thrower || this.seesBox(this.box))) {
          let n = (this.box.x - t.x) / (e || 1),
            r = (this.box.z - t.z) / (e || 1);
          t.attack(n, r, this.box.x, this.box.z) &&
            (this.shootT = randomRange(0.35, 0.7));
        }
      }
    }
  }
const Hu = {
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
  getKeyCode = (e) => e.code || Hu[(e.key || ``).toLowerCase()] || ``,
  createStickState = () => ({ id: null, ox: 0, oy: 0, x: 0, y: 0, mag: 0, moved: !1 });
class Input {
    constructor(e, t) {
      ((this.keys = new Set()),
        (this.listeners = new AbortController()),
        (this.ndcX = 0),
        (this.ndcY = 0),
        (this.canvas = e),
        (this.fire = !1),
        (this.superHeld = !1),
        (this.superReleased = !1),
        (this.enabled = !0),
        (this.touchMode = !1),
        (this.onTouchMode = null),
        (this.lastTouch = -1e9),
        (this.sticks = { move: createStickState(), aim: createStickState(), super: createStickState() }),
        (this.shots = []));
      let n = new Set([`Space`, `KeyE`]);
      (window.addEventListener(`keydown`, (e) => {
        if (
          e.repeat ||
          (e.target &&
            (e.target.tagName === `INPUT` || e.target.tagName === `SELECT`))
        )
          return;
        let t = getKeyCode(e);
        (this.keys.add(t),
          n.has(t) && ((this.superHeld = !0), e.preventDefault()),
          t.startsWith(`Arrow`) && e.preventDefault());
      }, { signal: this.listeners.signal }),
        window.addEventListener(`keyup`, (e) => {
          let t = getKeyCode(e);
          (this.keys.delete(t),
            n.has(t) &&
              this.superHeld &&
              ((this.superHeld = !1), (this.superReleased = !0)));
        }, { signal: this.listeners.signal }),
        window.addEventListener(`blur`, () => {
          (this.keys.clear(), (this.fire = !1), (this.superHeld = !1));
          for (let e of Object.values(this.sticks)) this.resetStick(e);
        }, { signal: this.listeners.signal }));
      let r = () => performance.now() - this.lastTouch < 900,
        i = (e) => {
          ((this.ndcX = (e.clientX / window.innerWidth) * 2 - 1),
            (this.ndcY = -(e.clientY / window.innerHeight) * 2 + 1));
        };
      (window.addEventListener(`mousemove`, (e) => {
        if (this.canvas.ownerDocument.pointerLockElement === this.canvas) {
          this.ndcX += (e.movementX * 2) / window.innerWidth;
          this.ndcY -= (e.movementY * 2) / window.innerHeight;
        } else r() || i(e);
      }, { signal: this.listeners.signal }),
        e.addEventListener(`mousedown`, (e) => {
          r() ||
            (this.touchMode && this.setTouchMode(!1),
            this.canvas.ownerDocument.pointerLockElement !== this.canvas && i(e),
            e.button === 0 && (this.fire = !0),
            e.button === 2 && (this.superHeld = !0));
        }, { signal: this.listeners.signal }),
        window.addEventListener(`mouseup`, (e) => {
          (e.button === 0 && (this.fire = !1),
            e.button === 2 &&
              this.superHeld &&
              ((this.superHeld = !1), (this.superReleased = !0)));
        }, { signal: this.listeners.signal }),
        e.addEventListener(`contextmenu`, (e) => e.preventDefault(), { signal: this.listeners.signal }));
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
      (e.addEventListener(`pointerdown`, (e) => a(e, `field`), { signal: this.listeners.signal }),
        t &&
          (t.addEventListener(`pointerdown`, (e) => a(e, `super`), { signal: this.listeners.signal }),
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
          }, { signal: this.listeners.signal })),
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
        }, { signal: this.listeners.signal }));
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
      (window.addEventListener(`pointerup`, s, { signal: this.listeners.signal }),
        window.addEventListener(`pointercancel`, s, { signal: this.listeners.signal }));
    }
    dispose() {
      this.listeners.abort();
      this.onTouchMode = null;
      if (this.canvas.ownerDocument.pointerLockElement === this.canvas) {
        this.canvas.ownerDocument.exitPointerLock();
      }
    }
    lockPointer() {
      if (this.touchMode || !this.canvas.requestPointerLock) return;
      this.ndcX = 0;
      this.ndcY = 0;
      const request = this.canvas.requestPointerLock();
      request?.catch?.(() => {});
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
  }
const projectedPosition = new Vector3(),
  $ = (e) => document.getElementById(e),
  formatGameTime = (e) => {
    let t = Math.floor(e) % 24,
      n = Math.floor((e - Math.floor(e)) * 60);
    return `${String(t).padStart(2, `0`)}:${String(n).padStart(2, `0`)}`;
  },
  formatClock = (e) =>
    e >= 19.4 || e < 5.6 ? `🌙` : e >= 17.2 || e < 7.2 ? `🌇` : `☀️`;
class HUD {
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
          this.floaters.push({ lerp: e, life: 0, x: 0, y: 0, z: 0, drift: 0 }));
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
    select(brawlerId) {
      this.selected = brawlerId;
      document.querySelectorAll(`#cards .card`).forEach((card) => {
        const isSelected = card.dataset.id === brawlerId;
        card.classList.toggle(`on`, isSelected);
        card.setAttribute(`aria-pressed`, String(isSelected));
      });
    }
    showMenu(isVisible) {
      $(`menu`).classList.toggle(`open`, isVisible);
      if (isVisible) $(`result`).classList.remove(`open`);
      this.root.classList.toggle(`hidden`, isVisible);
    }
    showResult(won, rank, totalBrawlers, kills, cubes) {
      const resultTitle = $(`result-title`);
      resultTitle.textContent = won ? `VICTORY!` : rank <= 3 ? `SO CLOSE!` : `DEFEATED`;
      resultTitle.classList.toggle(`lose`, !won);
      $(`result-rank`).textContent = `RANK #${rank} of ${totalBrawlers}`;
      $(`result-stats`).textContent = `${kills} takedown${kills === 1 ? `` : `s`}  ·  ${cubes} power cube${cubes === 1 ? `` : `s`}`;
      $(`result`).classList.add(`open`);
    }
    hideResult() {
      $(`result`).classList.remove(`open`);
    }
    buildSettings() {
      const game = this.game;
      const settingsPanel = $(`settings`);
      $(`gear`).addEventListener(`click`, () => settingsPanel.classList.toggle(`open`));
      const qualitySegment = $(`quality-seg`);
      for (const [qualityId, qualityPreset] of Object.entries(QUALITY_PRESETS)) {
        const qualityButton = document.createElement(`button`);
        qualityButton.textContent = qualityPreset.label;
        qualityButton.dataset.q = qualityId;
        qualityButton.addEventListener(`click`, () => game.setQuality(qualityId, true));
        qualitySegment.appendChild(qualityButton);
      }
      const difficultySegment = $(`difficulty-seg`);
      for (const [difficultyId, difficulty] of Object.entries(DIFFICULTIES)) {
        const difficultyButton = document.createElement(`button`);
        difficultyButton.textContent = difficulty.label;
        difficultyButton.dataset.d = difficultyId;
        difficultyButton.addEventListener(`click`, () => game.setDifficulty(difficultyId));
        difficultySegment.appendChild(difficultyButton);
      }
      $(`auto-time`).addEventListener(`change`, (event) => game.setAutoTime(event.target.checked));
      $(`time-slider`).addEventListener(`input`, (event) => {
        game.setAutoTime(false);
        game.lighting.setTime(Number.parseFloat(event.target.value));
      });
      $(`tog-ao`).addEventListener(`change`, (event) => game.setToggle(`ao`, event.target.checked));
      $(`tog-bloom`).addEventListener(`change`, (event) => game.setToggle(`bloom`, event.target.checked));
      $(`tog-mute`).addEventListener(`change`, (event) => game.setMuted(event.target.checked));
    }
    syncSettings() {
      const game = this.game;
      document.querySelectorAll(`#quality-seg button`).forEach((button) => {
        button.classList.toggle(`on`, button.dataset.q === game.pipeline.qualityName);
      });
      document.querySelectorAll(`#difficulty-seg button`).forEach((button) => {
        button.classList.toggle(`on`, button.dataset.d === game.difficultyName);
      });
      $(`auto-time`).checked = game.autoTime;
      $(`tog-ao`).checked = game.pipeline.toggles.ao;
      $(`tog-ao`).disabled = !game.pipeline.quality.ao;
      $(`tog-bloom`).checked = game.pipeline.toggles.bloom;
      $(`tog-mute`).checked = game.audio.muted;
    }
    toast(message) {
      const toastElement = $(`toast`);
      toastElement.textContent = message;
      toastElement.classList.add(`show`);
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => toastElement.classList.remove(`show`), 3200);
    }
    reset() {
      for (const overhead of this.overheads.values()) overhead.root.remove();
      this.overheads.clear();
      for (const boxBar of this.boxBars.values()) boxBar.root.remove();
      this.boxBars.clear();
      for (const floater of this.floaters) {
        floater.life = 0;
        floater.lerp.hidden = true;
      }
      $(`feed`).innerHTML = ``;
      this.lastLeft = -1;
      this.hideResult();
    }
    addBrawler(brawler) {
      const overhead = document.createElement(`div`);
      overhead.className = `oh` + (brawler.isPlayer ? ` me` : ``);
      overhead.innerHTML = `<div class="oh-name"><span class="n"></span><span class="oh-cubes"></span></div>
      <div class="oh-bar"><div class="oh-fill"></div><span class="oh-hp"></span></div>
      ${brawler.isPlayer ? `<div class="oh-ammo"><i><b></b></i><i><b></b></i><i><b></b></i></div>` : ``}`;
      overhead.querySelector(`.n`).textContent = brawler.name;
      this.overheadLayer.appendChild(overhead);
      this.overheads.set(brawler.id, {
          root: overhead,
          fill: overhead.querySelector(`.oh-fill`),
          hp: overhead.querySelector(`.oh-hp`),
          cubes: overhead.querySelector(`.oh-cubes`),
          ammo: [...overhead.querySelectorAll(`.oh-ammo b`)],
          lastHp: -1,
          lastMax: -1,
          lastCubes: -1,
          lastAmmo: [-1, -1, -1],
          shown: !0,
        });
    }
    floatText(worldX, worldY, worldZ, text, style) {
      const floater = this.floaters[this.floaterCursor];
      this.floaterCursor = (this.floaterCursor + 1) % this.floaters.length;
      floater.life = 0.85;
      floater.x = worldX + (Math.random() - 0.5) * 0.5;
      floater.y = worldY;
      floater.z = worldZ;
      floater.drift = (Math.random() - 0.5) * 30;
      floater.lerp.textContent = text;
      floater.lerp.className = `floater ${style}`;
      floater.lerp.hidden = false;
    }
    feed(messageHtml) {
      const feedElement = $(`feed`);
      const feedItem = document.createElement(`div`);
      feedItem.innerHTML = messageHtml;
      feedElement.appendChild(feedItem);
      while (feedElement.children.length > 4) feedElement.firstChild.remove();
      setTimeout(() => feedItem.remove(), 6e3);
    }
    banner(message, duration = 1, isSmall = false) {
      const bannerElement = $(`banner`);
      bannerElement.textContent = message;
      bannerElement.classList.toggle(`small`, isSmall);
      bannerElement.classList.add(`show`);
      this.bannerT = duration;
    }
    flashHurt(damage) {
      this.hurt = clamp(this.hurt + damage / 1400, 0.35, 1);
    }
    project(worldX, worldY, worldZ, projectedPoint) {
      projectedPosition.set(worldX, worldY, worldZ).project(this.game.camera);
      projectedPoint.x = (projectedPosition.x * 0.5 + 0.5) * window.innerWidth;
      projectedPoint.y = (-projectedPosition.y * 0.5 + 0.5) * window.innerHeight;
      projectedPoint.on =
          projectedPosition.z < 1 &&
          Math.abs(projectedPosition.x) < 1.15 &&
          Math.abs(projectedPosition.y) < 1.2;
      return projectedPoint;
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
            (t.fill.style.transform = `scaleX(${clamp(o / e.maxHp, 0, 1).toFixed(3)})`),
            (t.hp.textContent = o)),
          e.cubes !== t.lastCubes &&
            ((t.lastCubes = e.cubes),
            (t.cubes.textContent = e.cubes > 0 ? `⚡${e.cubes}` : ``)),
          e.isPlayer)
        )
          for (let n = 0; n < 3; n++) {
            let r = clamp(
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
          (t.fill.style.transform = `scaleX(${clamp(i / e.maxHp, 0, 1).toFixed(3)})`),
          (t.hp.textContent = i));
      }
      for (let t of this.floaters) {
        if (t.life <= 0) continue;
        if (((t.life -= e), t.life <= 0)) {
          t.lerp.hidden = !0;
          continue;
        }
        let r = 1 - t.life / 0.85,
          i = this.project(t.x, t.y + r * 0.9, t.z, n),
          a =
            r < 0.15
              ? 0.6 + (r / 0.15) * 0.6
              : 1.2 - Math.min(1, (r - 0.15) * 1.5) * 0.2;
        ((t.lerp.style.transform = `translate3d(${(i.x + t.drift * r).toFixed(1)}px, ${i.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${a.toFixed(2)})`),
          (t.lerp.style.opacity = r > 0.7 ? ((1 - r) / 0.3).toFixed(2) : `1`));
      }
      let r = t.brawlers.reduce((e, t) => e + +!!t.alive, 0);
      r !== this.lastLeft &&
        ((this.lastLeft = r),
        ($(`left-count`).innerHTML = `BRAWLERS LEFT <b>${r}</b>`));
      let i = `${formatClock(t.lighting.time)} ${formatGameTime(t.lighting.time)}`;
      i !== this.lastClock &&
        ((this.lastClock = i),
        ($(`clock`).textContent = i),
        ($(`time-label`).textContent = formatGameTime(t.lighting.time)),
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
          `${this.fps} fps   ${e.render.calls} draws   ${(e.render.triangles / 1e3).toFixed(0)}SRGBColorSpace tris\nsun shadow ${n.mapSize}px over ${(n.shadowRadius * 2).toFixed(0)}m  (${t.pipeline.usingPCSS ? `PCSS` : `PCF`})\nlamps lit ${r}  casting ${i}   pool lights ${n.pool.filter((e) => e.intensity > 0).length}/${n.pool.length}\n` +
          (t.userPickedQuality
            ? `quality: your choice`
            : `quality: auto  (night frame ${t.perf.benchMs ? t.perf.benchMs.toFixed(1) : `?`} ms at startup)`);
      }
    }
  }
class GameAudio {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.muted = false;
      this.listener = { x: 0, z: 0 };
      this.noiseBuffer = null;
      this.lastPlayed = {};
      this.timeOffset = 0;
    }
    unlock() {
      if (this.ctx) {
        if (this.ctx.state === `suspended`) this.ctx.resume();
        return;
      }
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (AudioContextConstructor) this.attach(new AudioContextConstructor());
    }
    attach(audioContext) {
      this.ctx = audioContext;
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.34;
      const compressor = this.ctx.createDynamicsCompressor();
      this.master.connect(compressor);
      compressor.connect(this.ctx.destination);
      const sampleCount = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, sampleCount, sampleCount);
      const noiseSamples = this.noiseBuffer.getChannelData(0);
      for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex++) {
        noiseSamples[sampleIndex] = Math.random() * 2 - 1;
      }
    }
    setMuted(isMuted) {
      this.muted = isMuted;
      if (this.master) this.master.gain.value = isMuted ? 0 : 0.34;
    }
    tone(waveform, startFrequency, endFrequency, duration, volume, delay = 0) {
      const audioContext = this.ctx;
      const startTime = audioContext.currentTime + this.timeOffset + delay;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = waveform;
      oscillator.frequency.setValueAtTime(startFrequency, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), startTime + duration);
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(8e-4, startTime + duration);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration + 0.02);
    }
    noise(filterType, startFrequency, endFrequency, duration, volume, quality = 1, delay = 0) {
      const audioContext = this.ctx;
      const startTime = audioContext.currentTime + this.timeOffset + delay;
      const source = audioContext.createBufferSource();
      source.buffer = this.noiseBuffer;
      source.playbackRate.value = 0.8 + Math.random() * 0.4;
      const filter = audioContext.createBiquadFilter();
      filter.type = filterType;
      filter.Q.value = quality;
      filter.frequency.setValueAtTime(startFrequency, startTime);
      filter.frequency.exponentialRampToValueAtTime(Math.max(30, endFrequency), startTime + duration);
      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(8e-4, startTime + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      source.start(startTime, Math.random() * 0.5);
      source.stop(startTime + duration + 0.02);
    }
    loudness(worldX, worldZ) {
      if (worldX === undefined) return 1;
      const distanceToListener = Math.hypot(worldX - this.listener.x, worldZ - this.listener.z);
      const normalizedVolume = Math.max(0, 1 - distanceToListener / 22);
      return normalizedVolume * normalizedVolume;
    }
    play(soundName, worldX, worldZ) {
      if (this.ctx && !this.muted) this.emit(soundName, this.loudness(worldX, worldZ));
    }
    emit(soundName, volume) {
      if (volume < 0.02) return;
      const now = this.ctx.currentTime + this.timeOffset;
      if (now - (this.lastPlayed[soundName] ?? -1) < 0.035) return;
      this.lastPlayed[soundName] = now;
      switch (soundName) {
          case `shot`:
            (this.noise(`bandpass`, 2600, 700, 0.09, 0.5 * volume, 0.8),
              this.tone(`square`, 760, 170, 0.08, 0.12 * volume));
            break;
          case `shotBig`:
            (this.noise(`bandpass`, 2e3, 400, 0.13, 0.6 * volume, 0.7),
              this.tone(`sawtooth`, 520, 110, 0.12, 0.16 * volume));
            break;
          case `blast`:
            (this.noise(`lowpass`, 3200, 240, 0.2, 0.85 * volume),
              this.tone(`sine`, 170, 50, 0.16, 0.4 * volume));
            break;
          case `blastBig`:
            (this.noise(`lowpass`, 3600, 160, 0.34, 1 * volume),
              this.tone(`sine`, 150, 38, 0.3, 0.6 * volume));
            break;
          case `lob`:
            (this.tone(`sine`, 330, 120, 0.16, 0.35 * volume),
              this.noise(`bandpass`, 900, 500, 0.08, 0.2 * volume));
            break;
          case `punch`:
            (this.noise(`lowpass`, 900, 120, 0.09, 0.7 * volume),
              this.tone(`sine`, 140, 60, 0.08, 0.35 * volume));
            break;
          case `boom`:
            (this.noise(`lowpass`, 1800, 70, 0.5, 1 * volume),
              this.tone(`sine`, 110, 34, 0.45, 0.7 * volume));
            break;
          case `boomBig`:
            (this.noise(`lowpass`, 2400, 50, 0.85, 1.2 * volume),
              this.tone(`sine`, 95, 28, 0.8, 0.9 * volume),
              this.noise(`bandpass`, 500, 200, 0.5, 0.4 * volume, 0.6, 0.05));
            break;
          case `hit`:
            this.tone(`triangle`, 720, 260, 0.06, 0.3 * volume);
            break;
          case `crate`:
            (this.noise(`bandpass`, 1300, 380, 0.2, 0.75 * volume, 1.2),
              this.tone(`square`, 210, 80, 0.1, 0.12 * volume));
            break;
          case `pickup`:
            [660, 880, 1320].forEach((frequency, delayIndex) =>
              this.tone(`triangle`, frequency, frequency * 1.01, 0.13, 0.26 * volume, delayIndex * 0.065),
            );
            break;
          case `ready`:
            [784, 1046, 1568].forEach((frequency, delayIndex) =>
              this.tone(`sine`, frequency, frequency, 0.22, 0.24, delayIndex * 0.08),
            );
            break;
          case `super`:
            (this.noise(`bandpass`, 300, 3200, 0.3, 0.5 * volume, 1.5),
              this.tone(`sawtooth`, 180, 720, 0.28, 0.13 * volume));
            break;
          case `leap`:
            (this.tone(`sine`, 200, 620, 0.35, 0.3 * volume),
              this.noise(`highpass`, 800, 3e3, 0.3, 0.2 * volume));
            break;
          case `gas`:
            this.noise(`highpass`, 3e3, 1500, 0.22, 0.22);
            break;
          case `down`:
            (this.tone(`sawtooth`, 420, 60, 0.5, 0.25 * volume),
              this.noise(`lowpass`, 1200, 100, 0.4, 0.4 * volume));
            break;
          case `count`:
            this.tone(`square`, 520, 520, 0.12, 0.2);
            break;
          case `go`:
            (this.tone(`square`, 880, 1320, 0.3, 0.24),
              this.tone(`sine`, 440, 660, 0.3, 0.2));
            break;
          case `win`:
            [523, 659, 784, 1046, 1318].forEach((frequency, delayIndex) =>
              this.tone(`triangle`, frequency, frequency, 0.3, 0.3, delayIndex * 0.11),
            );
            break;
          case `lose`:
            [392, 330, 262, 196].forEach((frequency, delayIndex) =>
              this.tone(`sawtooth`, frequency, frequency * 0.97, 0.32, 0.18, delayIndex * 0.16),
            );
            break;
          case `click`:
            this.tone(`triangle`, 900, 600, 0.05, 0.2);
        }
    }
  }
const FOV = 32,
  CAMERA_PITCH = (56 * Math.PI) / 180,
  $u = 23,
  TIME_PRESETS = [null, 12.5, 17.6, 18.6, 19.4, 21.5],
  SETTINGS_KEY = `sundown-showdown-settings`,
  nd = new Raycaster(),
  rd = new Vector2(),
  id = new Plane(new Vector3(0, 1, 0), -0.5),
  ad = new Vector3(),
  od = new Color(16761402),
  sd = new Color(16767392);

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
  formatClock,
  createSmokeTexture,
  Ou,
  Pu,
  Ru,
  SETTINGS_KEY,
  TIME_PRESETS,
  Tu,
  getKeyCode,
  createStickState,
  _u,
  ad,
  nextBrawlerId,
  bu,
  gu,
  hu,
  id,
  ParticlePool,
  ku,
  mu,
  nd,
  od,
  projectedPosition,
  pu,
  formatGameTime,
  rd,
  sd,
  createBrawlerModel,
  vu,
  wu,
  createLightningTexture,
  yu,
  zu,
};
