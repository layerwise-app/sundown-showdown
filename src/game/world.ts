// @ts-nocheck
import {
  $c,
  AO_TILE_SIZE,
  CARDINAL_DIRECTIONS,
  J,
  LAMP_CONFIG,
  Ln,
  Ne,
  Nr,
  Qc,
  RoundedBoxGeometry,
  Sr,
  TILE_SIZE,
  TerrainStyle,
  TileType,
  V,
  Yn,
  _,
  a,
  addHeightColors,
  al,
  b,
  br,
  c,
  cr,
  createBarrelTexture,
  createCrateTexture,
  createNormalTexture,
  d,
  e,
  en,
  f,
  fr,
  g,
  gr,
  h,
  hr,
  i,
  instanceColor,
  instanceEuler,
  instanceMatrix,
  instancePosition,
  instanceQuaternion,
  instanceScale,
  isInBounds,
  k,
  l,
  m,
  mergeGeometries,
  mr,
  n,
  o,
  p,
  pn,
  pr,
  r,
  s,
  t,
  tileIndex,
  u,
  ut,
  v,
  vr,
  x,
  xr,
  y,
  yr,
  z,
  zeroInstanceMatrix,
} from "./shared.js";

var World = class {
    constructor(e, t, n = 8) {
      ((this.scene = e),
        (this.anisotropy = n),
        (this.group = new ut()),
        e.add(this.group),
        (this.tiles = new Uint8Array(1936)),
        (this.styles = new Uint8Array(1936)),
        (this.blockers = new Uint8Array(1936)),
        (this.instanceOf = new Int32Array(1936).fill(-1)),
        (this.bushRange = new Int32Array(3872).fill(-1)),
        (this.spawns = []),
        (this.boxSpots = []),
        (this.lampTiles = []),
        (this.lanterns = []),
        (this.meshes = {}),
        (this.disposables = []),
        (this.aoDirty = !1),
        (this.aoTimer = 0),
        (this._g = new Float32Array(1936)),
        (this._from = new Int32Array(1936)),
        (this._stamp = new Uint32Array(1936)),
        (this._closed = new Uint32Array(1936)),
        (this._tick = 0),
        (this.grassUniforms = {
          uTime: { value: 0 },
          uPushers: {
            value: Array.from({ length: 8 }, () => new Ne(0, 0, 1, 0)),
          },
          uReveal: { value: new Ne(0, 0, 0, 0) },
        }),
        this.generate(t),
        this.buildGround(),
        this.buildWalls(),
        this.buildBushes(),
        this.buildWater(),
        this.buildLamps(),
        this.buildOutskirts());
    }
    toTile(e) {
      return Math.floor(e + 22);
    }
    center(e) {
      return e + 0.5 - 22;
    }
    tileAt(e, t) {
      let n = this.toTile(e),
        r = this.toTile(t);
      return isInBounds(n, r) ? this.tiles[tileIndex(n, r)] : TileType.WALL;
    }
    isBushAt(e, t) {
      return this.tileAt(e, t) === TileType.BUSH;
    }
    isSolidTile(e, t) {
      if (!isInBounds(e, t)) return !0;
      let n = tileIndex(e, t),
        r = this.tiles[n];
      return (
        r === TileType.WALL || r === TileType.WATER || this.blockers[n] === 1
      );
    }
    blocksShots(e, t) {
      if (!isInBounds(e, t)) return !0;
      let n = tileIndex(e, t);
      return this.tiles[n] === TileType.WALL || this.blockers[n] === 1;
    }
    isWalkable(e, t) {
      return !this.isSolidTile(e, t);
    }
    isBreakable(e, t) {
      if (!isInBounds(e, t)) return !1;
      let n = tileIndex(e, t);
      return (
        this.tiles[n] === TileType.BUSH ||
        (this.tiles[n] === TileType.WALL &&
          this.styles[n] !== TerrainStyle.ROCK &&
          this.styles[n] !== TerrainStyle.LAMP)
      );
    }
    generate(e) {
      for (let t = 0; t < 60; t++) {
        let n = (e + t * 7919) | 0;
        if (this.tryGenerate(Qc(n))) {
          this.seed = n;
          return;
        }
      }
      console.warn(`[world] map validation kept failing; using last attempt`);
    }
    tryGenerate(e) {
      let { tiles: t, styles: n } = this;
      (t.fill(TileType.EMPTY), n.fill(0));
      let r = new Uint8Array(1936),
        i = (t, n) => t + Math.floor(e() * (n - t + 1)),
        a = (e, t) => [
          [e, t],
          [43 - e, t],
          [e, 43 - t],
          [43 - e, 43 - t],
        ];
      for (let e = 0; e < 44; e++)
        for (let r = 0; r < 44; r++)
          (r < 2 || e < 2 || r >= 42 || e >= 42) &&
            ((t[tileIndex(r, e)] = TileType.WALL),
            (n[tileIndex(r, e)] = TerrainStyle.ROCK));
      this.spawns = [
        [6, 6],
        [37, 6],
        [6, 37],
        [37, 37],
        [21, 5],
        [38, 21],
        [22, 38],
        [5, 22],
      ];
      for (let [e, t] of this.spawns)
        for (let [n, i] of a(e, t))
          for (let e = -2; e <= 2; e++)
            for (let t = -2; t <= 2; t++)
              isInBounds(n + t, i + e) && (r[tileIndex(n + t, i + e)] = 1);
      let o = (e, t) =>
          Math.max(Math.abs(e + 0.5 - 22), Math.abs(t + 0.5 - 22)),
        s = (e, i, s, c = 0) => {
          if (
            e < 2 ||
            i < 2 ||
            e > 21 ||
            i > 21 ||
            (s !== TileType.BUSH && o(e, i) < 3.6)
          )
            return !1;
          let l = !1;
          for (let [o, u] of a(e, i)) {
            let e = tileIndex(o, u);
            r[e] ||
              t[e] !== TileType.EMPTY ||
              ((t[e] = s), (n[e] = c), (l = !0));
          }
          return l;
        },
        c = i(13, 16);
      for (let t = 0; t < c; t++) {
        let t = i(3, 21),
          n = i(3, 21),
          r = e() < 0.5,
          a = i(2, 5),
          o = e(),
          c =
            o < 0.6
              ? TerrainStyle.STONE
              : o < 0.86
                ? TerrainStyle.CRATE
                : TerrainStyle.BARREL;
        for (let e = 0; e < a; e++)
          s(t + (r ? e : 0), n + (r ? 0 : e), TileType.WALL, c);
        if (e() < 0.42) {
          let o = t + (r ? a - 1 : 0),
            l = n + (r ? 0 : a - 1),
            u = e() < 0.5 ? -1 : 1,
            d = i(2, 3);
          for (let e = 1; e <= d; e++)
            s(o + (r ? 0 : e * u), l + (r ? e * u : 0), TileType.WALL, c);
        }
      }
      let l = (t, n, r, i) => {
        let a = [[r, i]];
        s(r, i, t);
        for (let r = 0; r < n * 3 && a.length < n; r++) {
          let [n, r] = a[Math.floor(e() * a.length)],
            i = CARDINAL_DIRECTIONS[Math.floor(e() * 4)],
            o = n + i[0],
            c = r + i[1];
          a.some((e) => e[0] === o && e[1] === c) ||
            (s(o, c, t) && a.push([o, c]));
        }
      };
      for (let e = 0, t = i(6, 7); e < t; e++)
        l(TileType.BUSH, i(5, 12), i(3, 21), i(3, 21));
      l(TileType.BUSH, 7, 20, 20);
      for (let e = 0, t = i(1, 2); e < t; e++)
        l(TileType.WATER, i(4, 8), i(8, 18), i(8, 18));
      for (let e = 0; e < 4; e++)
        s(i(3, 21), i(3, 21), TileType.WALL, TerrainStyle.CACTUS);
      this.lampTiles = [];
      let u = (e, i) => {
        for (let [o, s] of a(e, i)) {
          let e = tileIndex(o, s);
          r[e] ||
            ((t[e] = TileType.WALL),
            (n[e] = TerrainStyle.LAMP),
            this.lampTiles.push([o, s]));
        }
      };
      (u(17, 17),
        u(i(8, 10), i(14, 16)),
        u(i(14, 16), i(7, 9)),
        (this.boxSpots = []));
      let d = [];
      for (let e = 0; e < 300 && d.length < 4; e++) {
        let e = i(3, 20),
          n = i(3, 20),
          a = tileIndex(e, n);
        t[a] !== TileType.EMPTY ||
          r[a] ||
          Math.hypot(e - 6, n - 6) < 6 ||
          d.some((t) => Math.hypot(t[0] - e, t[1] - n) < 5) ||
          d.push([e, n]);
      }
      for (let [e, t] of d) for (let n of a(e, t)) this.boxSpots.push(n);
      let f = new Uint8Array(1936),
        p = [tileIndex(this.spawns[0][0], this.spawns[0][1])];
      f[p[0]] = 1;
      let m = 0;
      for (; p.length;) {
        let e = p.pop();
        m++;
        let n = e % 44,
          r = (e / 44) | 0;
        for (let [e, i] of CARDINAL_DIRECTIONS) {
          let a = tileIndex(n + e, r + i);
          isInBounds(n + e, r + i) &&
            !f[a] &&
            t[a] !== TileType.WALL &&
            t[a] !== TileType.WATER &&
            ((f[a] = 1), p.push(a));
        }
      }
      let h = 0;
      for (let e = 0; e < t.length; e++)
        (t[e] === TileType.EMPTY || t[e] === TileType.BUSH) && h++;
      return m < h * 0.93 ||
        !this.spawns.every(([e, t]) => f[tileIndex(e, t)]) ||
        !f[tileIndex(22, 22)]
        ? !1
        : ((this.boxSpots = this.boxSpots.filter(
            ([e, t]) => f[tileIndex(e, t)],
          )),
          this.boxSpots.length >= 10);
    }
    paintBase() {
      let e = 44 * TILE_SIZE,
        t = al(e, e),
        n = t.getContext(`2d`),
        r = Qc(this.seed ^ 20973);
      for (let e = 0; e < 44; e++)
        for (let t = 0; t < 44; t++) {
          let i = t < 2 || e < 2 || t >= 42 || e >= 42,
            a = (r() - 0.5) * 3;
          ((n.fillStyle = i
            ? `hsl(33, 38%, ${52 + a}%)`
            : (t + e) % 2
              ? `hsl(37, 60%, ${66 + a}%)`
              : `hsl(36, 57%, ${62 + a}%)`),
            n.fillRect(t * TILE_SIZE, e * TILE_SIZE, TILE_SIZE, TILE_SIZE));
        }
      for (let t = 0; t < 9e3; t++) {
        let t = r() * e,
          i = r() * e,
          a = 0.6 + r() * 1.6;
        ((n.fillStyle =
          r() < 0.5 ? `rgba(120,80,30,0.16)` : `rgba(255,240,200,0.16)`),
          n.beginPath(),
          n.arc(t, i, a, 0, 7),
          n.fill());
      }
      let i = al(e, e),
        a = i.getContext(`2d`);
      ((a.fillStyle = `#fff`), a.fillRect(0, 0, e, e));
      for (let e = 0; e < 44; e++)
        for (let t = 0; t < 44; t++) {
          let n = this.tiles[tileIndex(t, e)];
          if (n === TileType.WATER) a.fillStyle = `#8f7a5a`;
          else if (n === TileType.BUSH) a.fillStyle = `#9fae6e`;
          else continue;
          a.fillRect(t * TILE_SIZE - 3, e * TILE_SIZE - 3, 38, 38);
        }
      return (
        n.save(),
        (n.globalCompositeOperation = `multiply`),
        (n.filter = `blur(7px)`),
        n.drawImage(i, 0, 0),
        n.restore(),
        t
      );
    }
    paintAO() {
      let e = 44 * AO_TILE_SIZE,
        t = al(e, e),
        n = t.getContext(`2d`);
      ((n.fillStyle = `#fff`), n.fillRect(0, 0, e, e));
      for (let e = 0; e < 44; e++)
        for (let t = 0; t < 44; t++) {
          let r = tileIndex(t, e),
            i = this.tiles[r];
          if (i === TileType.WALL || this.blockers[r]) n.fillStyle = `#000`;
          else if (i === TileType.BUSH) n.fillStyle = `#6a6a6a`;
          else continue;
          let a =
            i === TileType.WALL && this.styles[r] === TerrainStyle.LAMP ? 3 : 0;
          n.fillRect(
            t * AO_TILE_SIZE + a,
            e * AO_TILE_SIZE + a,
            AO_TILE_SIZE - a * 2,
            AO_TILE_SIZE - a * 2,
          );
        }
      this.aoCanvas ||= al(e, e);
      let r = this.aoCanvas.getContext(`2d`);
      return (
        (r.fillStyle = `#fff`),
        r.fillRect(0, 0, e, e),
        (r.filter = `blur(6px)`),
        r.drawImage(t, 0, 0),
        (r.filter = `none`),
        this.aoCanvas
      );
    }
    composeGround() {
      let e = 44 * TILE_SIZE;
      this.groundCanvas ||= al(e, e);
      let t = this.groundCanvas.getContext(`2d`);
      ((t.globalCompositeOperation = `source-over`),
        (t.globalAlpha = 1),
        t.drawImage(this.baseCanvas, 0, 0),
        (t.globalCompositeOperation = `multiply`),
        (t.globalAlpha = 0.34),
        t.drawImage(this.aoCanvas, 0, 0, e, e),
        (t.globalAlpha = 1),
        (t.globalCompositeOperation = `source-over`));
    }
    buildGround() {
      ((this.baseCanvas = this.paintBase()),
        this.paintAO(),
        this.composeGround());
      let e = new cr(this.groundCanvas);
      ((e.colorSpace = k), (e.anisotropy = this.anisotropy));
      let t = new cr(this.aoCanvas);
      ((t.anisotropy = 4), (this.groundMap = e), (this.groundAO = t));
      let n = [],
        r = [],
        i = [],
        a = [],
        o = (e, t, o, s, c, l) => {
          let u = n.length / 3;
          for (let r of [e, t, o, s]) n.push(r[0], r[1], r[2]);
          for (let e = 0; e < 4; e++) i.push(c[0], c[1], c[2]);
          for (let e of l) r.push(e[0], e[1]);
          a.push(u, u + 1, u + 2, u, u + 2, u + 3);
        },
        s = (e) => e / 44,
        c = (e) => 1 - e / 44,
        l = -0.4;
      for (let e = 0; e < 44; e++)
        for (let t = 0; t < 44; t++) {
          let n = t - 22,
            r = e - 22,
            i = n + 1,
            a = r + 1;
          if (this.tiles[tileIndex(t, e)] !== TileType.WATER) {
            o(
              [n, 0, r],
              [n, 0, a],
              [i, 0, a],
              [i, 0, r],
              [0, 1, 0],
              [
                [s(t), c(e)],
                [s(t), c(e + 1)],
                [s(t + 1), c(e + 1)],
                [s(t + 1), c(e)],
              ],
            );
            continue;
          }
          let u = 0.12 / 44,
            d = (n, r) =>
              isInBounds(t + n, e + r) &&
              this.tiles[tileIndex(t + n, e + r)] !== TileType.WATER;
          (d(0, -1) &&
            o(
              [n, 0, r],
              [i, 0, r],
              [i, l, r],
              [n, l, r],
              [0, 0, 1],
              [
                [s(t), c(e) + u],
                [s(t + 1), c(e) + u],
                [s(t + 1), c(e) + u],
                [s(t), c(e) + u],
              ],
            ),
            d(0, 1) &&
              o(
                [i, 0, a],
                [n, 0, a],
                [n, l, a],
                [i, l, a],
                [0, 0, -1],
                [
                  [s(t + 1), c(e + 1) - u],
                  [s(t), c(e + 1) - u],
                  [s(t), c(e + 1) - u],
                  [s(t + 1), c(e + 1) - u],
                ],
              ),
            d(-1, 0) &&
              o(
                [n, 0, a],
                [n, 0, r],
                [n, l, r],
                [n, l, a],
                [1, 0, 0],
                [
                  [s(t) - u, c(e + 1)],
                  [s(t) - u, c(e)],
                  [s(t) - u, c(e)],
                  [s(t) - u, c(e + 1)],
                ],
              ),
            d(1, 0) &&
              o(
                [i, 0, r],
                [i, 0, a],
                [i, l, a],
                [i, l, r],
                [-1, 0, 0],
                [
                  [s(t + 1) + u, c(e)],
                  [s(t + 1) + u, c(e + 1)],
                  [s(t + 1) + u, c(e + 1)],
                  [s(t + 1) + u, c(e)],
                ],
              ));
        }
      let u = new pn();
      (u.setAttribute(`position`, new en(n, 3)),
        u.setAttribute(`normal`, new en(i, 3)),
        u.setAttribute(`uv`, new en(r, 2)),
        u.setIndex(a));
      let d = new Nr({
          map: e,
          aoMap: t,
          aoMapIntensity: 1,
          roughness: 0.96,
          metalness: 0,
        }),
        f = new Ln(u, d);
      ((f.receiveShadow = !0),
        (f.name = `ground`),
        this.group.add(f),
        this.disposables.push(u, d, e, t));
    }
    rebakeGround() {
      (this.paintAO(),
        this.composeGround(),
        (this.groundMap.needsUpdate = !0),
        (this.groundAO.needsUpdate = !0));
    }
    addInstanced(e, t, n, r, i = !0) {
      let a = new Yn(t, n, Math.max(1, r));
      return (
        (a.count = r),
        (a.castShadow = i),
        (a.receiveShadow = !0),
        (a.name = e),
        this.group.add(a),
        (this.meshes[e] = a),
        this.disposables.push(t, n),
        a
      );
    }
    buildWalls() {
      let e = Qc(this.seed ^ 2577),
        t = {
          [TerrainStyle.STONE]: [],
          [TerrainStyle.CRATE]: [],
          [TerrainStyle.BARREL]: [],
          [TerrainStyle.CACTUS]: [],
          [TerrainStyle.ROCK]: [],
        };
      for (let e = 0; e < 44; e++)
        for (let n = 0; n < 44; n++) {
          let r = tileIndex(n, e);
          this.tiles[r] === TileType.WALL &&
            t[this.styles[r]] &&
            t[this.styles[r]].push([n, e]);
        }
      let n = (e, t, n, r, i, a, o, s, c, l, u, d, f = 0, p = 0) => {
        (instanceEuler.set(f, s, p),
          instanceQuaternion.setFromEuler(instanceEuler),
          instanceMatrix.compose(
            instancePosition.set(i, a, o),
            instanceQuaternion,
            instanceScale.set(c, l, u),
          ),
          e.setMatrixAt(t, instanceMatrix),
          e.setColorAt(t, d),
          n >= 0 && (this.instanceOf[tileIndex(n, r)] = t));
      };
      {
        let r = addHeightColors(
            new RoundedBoxGeometry(1, 1, 1, 3, 0.085),
            0.62,
            0.8,
          ),
          i = new Nr({
            color: 16777215,
            roughness: 0.88,
            metalness: 0,
            vertexColors: !0,
          }),
          a = this.addInstanced(`stone`, r, i, t[TerrainStyle.STONE].length);
        t[TerrainStyle.STONE].forEach(([t, r], i) => {
          let o = e() < 0.13 ? 1.75 + e() * 0.2 : 1.02 + e() * 0.28;
          (instanceColor.setHSL(
            0.61 + e() * 0.03,
            0.12 + e() * 0.06,
            0.58 + e() * 0.1,
          ),
            n(
              a,
              i,
              t,
              r,
              this.center(t),
              o / 2 - 0.07,
              this.center(r),
              0,
              1,
              o,
              1,
              instanceColor,
            ));
        });
      }
      {
        let r = addHeightColors(new fr(0.94, 0.94, 0.94), 0.7),
          i = new Nr({
            map: createCrateTexture(),
            roughness: 0.82,
            vertexColors: !0,
          }),
          a = this.addInstanced(`crate`, r, i, t[TerrainStyle.CRATE].length);
        t[TerrainStyle.CRATE].forEach(([t, r], i) => {
          let o = 0.97 + e() * 0.06;
          (instanceColor.setHSL(0.08, 0.1, 0.86 + e() * 0.14),
            n(
              a,
              i,
              t,
              r,
              this.center(t),
              0.47 * o - 0.01,
              this.center(r),
              (e() < 0.5 ? 0 : Math.PI / 2) + (e() - 0.5) * 0.12,
              o,
              o,
              o,
              instanceColor,
            ));
        });
      }
      {
        let r = addHeightColors(new hr(0.41, 0.37, 1.04, 16), 0.68),
          i = new Nr({
            map: createBarrelTexture(),
            roughness: 0.7,
            vertexColors: !0,
          }),
          a = this.addInstanced(`barrel`, r, i, t[TerrainStyle.BARREL].length);
        t[TerrainStyle.BARREL].forEach(([t, r], i) => {
          (instanceColor.setHSL(0.07, 0.1, 0.85 + e() * 0.15),
            n(
              a,
              i,
              t,
              r,
              this.center(t),
              0.51,
              this.center(r),
              e() * 6.28,
              1,
              1,
              1,
              instanceColor,
            ));
        });
      }
      {
        let e = [new pr(0.2, 0.85, 5, 12).translate(0, 0.62, 0)],
          n = new pr(0.105, 0.26, 4, 10);
        (e.push(
          n
            .clone()
            .rotateZ(Math.PI / 2)
            .translate(0.3, 0.72, 0),
          n.clone().translate(0.46, 0.92, 0),
        ),
          e.push(
            n
              .clone()
              .rotateZ(Math.PI / 2)
              .translate(-0.28, 0.5, 0),
            n.clone().translate(-0.43, 0.68, 0),
          ),
          (this.cactusGeo = addHeightColors(mergeGeometries(e), 0.6)),
          (this.cactusMat = new Nr({
            color: 16777215,
            roughness: 0.7,
            vertexColors: !0,
          })),
          (this.cactusList = t[TerrainStyle.CACTUS]));
      }
      ((this.rockList = t[TerrainStyle.ROCK]),
        (this._place = n),
        (this._rng = e));
    }
    buildOutskirts() {
      let e = this._rng,
        t = this._place,
        n = [],
        r = [];
      for (let t = 0; t < 150; t++) {
        let t = (e() - 0.5) * 70,
          i = (e() - 0.5) * 66 - 4;
        (Math.abs(t) < 22.8 && Math.abs(i) < 22.8) ||
          (e() < 0.62 ? n : r).push([t, i]);
      }
      let i = new vr(0.78, 0),
        a = new Nr({ color: 16777215, roughness: 0.93, metalness: 0 }),
        o = this.addInstanced(`rock`, i, a, this.rockList.length + n.length);
      (this.rockList.forEach(([n, r], i) => {
        let a =
            r >= 42
              ? 0.95 + e() * 0.4
              : (n === 0 || r === 0 || n === 43 || r === 43 ? 1.9 : 1.35) +
                e() * 0.9,
          s = 1.05 + e() * 0.32;
        (instanceColor.setHSL(
          0.05 + e() * 0.025,
          0.36 + e() * 0.1,
          0.41 + e() * 0.1,
        ),
          t(
            o,
            i,
            -1,
            -1,
            this.center(n) + (e() - 0.5) * 0.25,
            a * 0.3,
            this.center(r) + (e() - 0.5) * 0.25,
            e() * 6.28,
            s,
            a,
            s,
            instanceColor,
            (e() - 0.5) * 0.4,
            (e() - 0.5) * 0.4,
          ));
      }),
        n.forEach(([n, r], i) => {
          let a = 0.5 + e() * 1.3;
          (instanceColor.setHSL(
            0.07 + e() * 0.025,
            0.22 + e() * 0.1,
            0.4 + e() * 0.12,
          ),
            t(
              o,
              this.rockList.length + i,
              -1,
              -1,
              n,
              a * 0.28,
              r,
              e() * 6.28,
              a,
              a * (0.7 + e() * 0.8),
              a,
              instanceColor,
              (e() - 0.5) * 0.5,
              (e() - 0.5) * 0.5,
            ));
        }),
        (o.instanceMatrix.needsUpdate = !0));
      let s = this.addInstanced(
        `cactus`,
        this.cactusGeo,
        this.cactusMat,
        this.cactusList.length + r.length,
      );
      (this.cactusList.forEach(([n, r], i) => {
        let a = 1 + e() * 0.3;
        (instanceColor.setHSL(0.3 + e() * 0.04, 0.42, 0.42 + e() * 0.08),
          t(
            s,
            i,
            n,
            r,
            this.center(n),
            -0.04,
            this.center(r),
            e() * 6.28,
            a,
            a,
            a,
            instanceColor,
          ));
      }),
        r.forEach(([n, r], i) => {
          let a = 0.8 + e() * 0.7;
          (instanceColor.setHSL(0.3 + e() * 0.04, 0.38, 0.38 + e() * 0.08),
            t(
              s,
              this.cactusList.length + i,
              -1,
              -1,
              n,
              -0.04,
              r,
              e() * 6.28,
              a,
              a,
              a,
              instanceColor,
            ));
        }));
      let c = new Nr({
        color: new J().setHSL(33 / 360, 0.38, 0.5),
        roughness: 1,
      });
      for (let [e, t, n, r] of [
        [0, -67, 224, 90],
        [0, 67, 224, 90],
        [-67, 0, 90, 44],
        [67, 0, 90, 44],
      ]) {
        let i = new yr(n, r).rotateX(-Math.PI / 2),
          a = new Ln(i, c);
        (a.position.set(e, 0, t),
          (a.receiveShadow = !0),
          this.group.add(a),
          this.disposables.push(i));
      }
      this.disposables.push(c);
    }
    buildBushes() {
      let e = Qc(this.seed ^ 2821),
        t = [];
      for (let e = 0; e < 44; e++)
        for (let n = 0; n < 44; n++)
          this.tiles[tileIndex(n, e)] === TileType.BUSH && t.push([n, e]);
      let n = new gr(0.2, 1, 5, 3);
      n.translate(0, 0.5, 0);
      let r = n.attributes.position;
      for (let e = 0; e < r.count; e++) {
        let t = r.getY(e);
        (r.setX(e, r.getX(e) + t * t * 0.2), r.setZ(e, r.getZ(e) * 0.5));
      }
      n.computeVertexNormals();
      let i = new Nr({ color: 16777215, roughness: 0.78, metalness: 0 }),
        a = this.grassUniforms;
      i.onBeforeCompile = (e) => {
        (Object.assign(e.uniforms, a),
          (e.vertexShader = e.vertexShader
            .replace(
              `#include <common>`,
              `#include <common>
uniform float uTime;
uniform vec4 uPushers[ 8 ];
varying float vBladeH;
varying vec3 vBladeWorld;`,
            )
            .replace(
              `#include <project_vertex>`,
              `
          vec4 mvPosition = vec4( transformed, 1.0 );
          #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
            vec3 rootW = ( instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 ) ).xyz;
          #else
            vec3 rootW = vec3( 0.0 );
          #endif
          float bladeH = clamp( position.y, 0.0, 1.0 );
          float bend = bladeH * bladeH;
          float w1 = sin( uTime * 1.7 + rootW.x * 0.9 + rootW.z * 0.6 );
          float w2 = sin( uTime * 2.9 + rootW.x * 1.7 - rootW.z * 1.3 );
          vec2 sway = vec2( w1 * 0.07 + w2 * 0.03, w2 * 0.045 );
          for ( int i = 0; i < 8; i ++ ) {
            vec4 pusher = uPushers[ i ];
            vec2 away = rootW.xz - pusher.xy;
            float dist = length( away );
            float f = ( 1.0 - smoothstep( 0.0, pusher.z, dist ) ) * pusher.w;
            sway += ( away / max( dist, 0.001 ) ) * f * 0.5;
          }
          mvPosition.xz += sway * bend;
          mvPosition.y -= length( sway ) * bend * 0.4;
          vBladeH = bladeH;
          vBladeWorld = mvPosition.xyz;
          mvPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * mvPosition;`,
            )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              `#include <common>`,
              `#include <common>
uniform vec4 uReveal;
varying float vBladeH;
varying vec3 vBladeWorld;`,
            )
            .replace(
              `#include <color_fragment>`,
              `#include <color_fragment>
          // dark roots, bright tips: fake occlusion + translucency
          diffuseColor.rgb *= mix( 0.4, 1.3, vBladeH );
          if ( uReveal.w > 0.5 ) {
            // screen-door fade so you can see your own brawler while hiding
            float fade = smoothstep( 0.55, 1.55, distance( vBladeWorld.xz, uReveal.xy ) );
            float n = fract( 52.9829189 * fract( dot( gl_FragCoord.xy, vec2( 0.06711056, 0.00583715 ) ) ) );
            if ( n > mix( 0.3, 1.01, fade ) ) discard;
          }`,
            )));
      };
      let o = this.addInstanced(`bush`, n, i, t.length * 13),
        s = 0;
      for (let [n, r] of t) {
        ((this.bushRange[tileIndex(n, r) * 2] = s),
          (this.bushRange[tileIndex(n, r) * 2 + 1] = 13));
        for (let t = 0; t < 13; t++) {
          let i = t < 9 ? (t % 3) / 3 + 1 / 6 : e(),
            a = t < 9 ? Math.floor(t / 3) / 3 + 1 / 6 : e(),
            c = n - 22 + i + (e() - 0.5) * 0.22,
            l = r - 22 + a + (e() - 0.5) * 0.22,
            u = 0.85 + e() * 0.5;
          (instanceEuler.set((e() - 0.5) * 0.3, e() * 6.28, (e() - 0.5) * 0.3),
            instanceQuaternion.setFromEuler(instanceEuler),
            instanceMatrix.compose(
              instancePosition.set(c, -0.03, l),
              instanceQuaternion,
              instanceScale.set(u * 1.15, u * (0.95 + e() * 0.35), u * 1.15),
            ),
            o.setMatrixAt(s, instanceMatrix),
            instanceColor.setHSL(
              0.27 + e() * 0.06,
              0.55 + e() * 0.15,
              0.36 + e() * 0.1,
            ),
            o.setColorAt(s, instanceColor),
            s++);
        }
      }
      o.frustumCulled = !1;
    }
    buildWater() {
      let e = !1;
      for (let t = 0; t < this.tiles.length; t++)
        this.tiles[t] === TileType.WATER && (e = !0);
      if (!e) return;
      let t = createNormalTexture(),
        n = new Nr({
          color: 2072516,
          roughness: 0.07,
          metalness: 0.05,
          normalMap: t,
          normalScale: new V(0.55, 0.55),
          envMapIntensity: 1.6,
          emissive: 407631,
          emissiveIntensity: 0.35,
        }),
        r = new yr(44, 44).rotateX(-Math.PI / 2),
        i = new Ln(r, n);
      ((i.position.y = -0.17),
        (i.receiveShadow = !0),
        (i.name = `water`),
        this.group.add(i),
        (this.water = i),
        (this.waterNormal = t),
        this.disposables.push(r, n, t));
    }
    buildLamps() {
      let e = this.lampTiles.length,
        t = mergeGeometries([
          new hr(0.3, 0.4, 0.5, 10).translate(0, 0.25, 0),
          new hr(0.05, 0.075, LAMP_CONFIG.height, 8).translate(
            0,
            LAMP_CONFIG.height / 2,
            0,
          ),
          new fr(LAMP_CONFIG.arm + 0.12, 0.07, 0.07).translate(
            LAMP_CONFIG.arm / 2,
            LAMP_CONFIG.height,
            0,
          ),
          new hr(0.07, 0.15, 0.07, 8).translate(
            LAMP_CONFIG.arm,
            LAMP_CONFIG.height - 0.02,
            0,
          ),
          new hr(0.1, 0.06, 0.05, 8).translate(
            LAMP_CONFIG.arm,
            LAMP_CONFIG.height - 0.42,
            0,
          ),
        ]),
        n = new Nr({ color: 4869984, roughness: 0.55, metalness: 0.25 }),
        r = this.addInstanced(`lampPost`, t, n, e),
        i = new hr(0.135, 0.105, 0.34, 10).translate(0, -0.05, 0);
      this.lampGlass = new Nr({
        color: 3811860,
        emissive: 16757850,
        emissiveIntensity: 0.15,
        roughness: 0.3,
      });
      let a = this.addInstanced(`lampGlass`, i, this.lampGlass, e, !1);
      ((a.receiveShadow = !1),
        (this.lanterns = []),
        this.lampTiles.forEach(([e, t], n) => {
          let i = this.center(e),
            o = this.center(t),
            s = Math.hypot(i, o) || 1,
            c = -i / s,
            l = -o / s;
          (instanceEuler.set(0, Math.atan2(-l, c), 0),
            instanceQuaternion.setFromEuler(instanceEuler),
            instanceMatrix.compose(
              instancePosition.set(i, -0.03, o),
              instanceQuaternion,
              instanceScale.set(1, 1, 1),
            ),
            r.setMatrixAt(n, instanceMatrix));
          let u = i + c * LAMP_CONFIG.arm,
            d = o + l * LAMP_CONFIG.arm;
          (instanceMatrix.makeTranslation(u, LAMP_CONFIG.height - 0.17, d),
            a.setMatrixAt(n, instanceMatrix),
            this.lanterns.push({ x: u, z: d }));
        }));
    }
    destroyTile(e, t) {
      if (!this.isBreakable(e, t)) return null;
      let n = tileIndex(e, t),
        r = {
          type: this.tiles[n],
          style: this.styles[n],
          x: this.center(e),
          z: this.center(t),
        };
      if (this.tiles[n] === TileType.BUSH) {
        let e = this.bushRange[n * 2],
          t = this.bushRange[n * 2 + 1],
          r = this.meshes.bush;
        for (let n = 0; n < t; n++) r.setMatrixAt(e + n, zeroInstanceMatrix);
        r.instanceMatrix.needsUpdate = !0;
      } else {
        let e = [`stone`, `crate`, `barrel`, `cactus`][this.styles[n]],
          t = this.meshes[e],
          r = this.instanceOf[n];
        t &&
          r >= 0 &&
          (t.setMatrixAt(r, zeroInstanceMatrix),
          (t.instanceMatrix.needsUpdate = !0));
      }
      return ((this.tiles[n] = TileType.EMPTY), (this.aoDirty = !0), r);
    }
    setBlocker(e, t, n) {
      ((this.blockers[tileIndex(e, t)] = +!!n), (this.aoDirty = !0));
    }
    resolveCircle(e, t) {
      for (let n = 0; n < 2; n++) {
        let n = this.toTile(e.x),
          r = this.toTile(e.z);
        for (let i = -1; i <= 1; i++)
          for (let a = -1; a <= 1; a++) {
            let o = n + a,
              s = r + i;
            if (!this.isSolidTile(o, s)) continue;
            let c = o - 22,
              l = s - 22,
              u = $c(e.x, c, c + 1),
              d = $c(e.z, l, l + 1),
              f = e.x - u,
              p = e.z - d,
              m = f * f + p * p;
            if (!(m >= t * t)) {
              if (m > 1e-8) {
                let n = Math.sqrt(m);
                ((e.x = u + (f / n) * t), (e.z = d + (p / n) * t));
              } else {
                let n = e.x - c,
                  r = c + 1 - e.x,
                  i = e.z - l,
                  a = l + 1 - e.z,
                  o = Math.min(n, r, i, a);
                o === n
                  ? (e.x = c - t)
                  : o === r
                    ? (e.x = c + 1 + t)
                    : (e.z = o === i ? l - t : l + 1 + t);
              }
            }
          }
      }
    }
    raycast(e, t, n, r, i = {}) {
      let a = this.toTile(e),
        o = this.toTile(t),
        s = n - e,
        c = r - t,
        l = Math.hypot(s, c);
      if (l < 1e-6) return null;
      let u = s / l,
        d = c / l,
        f = u > 0 ? 1 : -1,
        p = d > 0 ? 1 : -1,
        m = u === 0 ? 1 / 0 : Math.abs(1 / u),
        h = d === 0 ? 1 / 0 : Math.abs(1 / d),
        g = e + 22 - a,
        _ = t + 22 - o,
        v = u === 0 ? 1 / 0 : (u > 0 ? 1 - g : g) * m,
        y = d === 0 ? 1 / 0 : (d > 0 ? 1 - _ : _) * h,
        b = 0;
      for (let n = 0; n < 160; n++) {
        if (
          (v < y
            ? ((b = v), (v += m), (a += f))
            : ((b = y), (y += h), (o += p)),
          b > l)
        )
          return null;
        if (this.blocksShots(a, o))
          return (
            (i.tx = a),
            (i.ty = o),
            (i.dist = b),
            (i.x = e + u * b),
            (i.z = t + d * b),
            i
          );
      }
      return null;
    }
    hasLineOfSight(e, t, n, r) {
      return this.raycast(e, t, n, r) === null;
    }
    findPath(e, t, n, r, i) {
      if (!isInBounds(e, t) || !isInBounds(n, r)) return null;
      let a = ++this._tick,
        { _g: o, _from: s, _stamp: c, _closed: l } = this,
        u = tileIndex(e, t),
        d = tileIndex(n, r),
        f = [],
        p = (e, t) => {
          f.push([t, e]);
          let n = f.length - 1;
          for (; n > 0;) {
            let e = (n - 1) >> 1;
            if (f[e][0] <= f[n][0]) break;
            (([f[e], f[n]] = [f[n], f[e]]), (n = e));
          }
        },
        m = () => {
          let e = f[0],
            t = f.pop();
          if (f.length) {
            f[0] = t;
            let e = 0;
            for (;;) {
              let t = e * 2 + 1,
                n = t + 1,
                r = e;
              if (
                (t < f.length && f[t][0] < f[r][0] && (r = t),
                n < f.length && f[n][0] < f[r][0] && (r = n),
                r === e)
              )
                break;
              (([f[r], f[e]] = [f[e], f[r]]), (e = r));
            }
          }
          return e[1];
        },
        h = (e, t) => {
          let i = Math.abs(e - n),
            a = Math.abs(t - r);
          return Math.max(i, a) + 0.4142 * Math.min(i, a);
        };
      ((o[u] = 0), (c[u] = a), (s[u] = -1), p(u, h(e, t)));
      let g = 0;
      for (; f.length && g++ < 4e3;) {
        let e = m();
        if (e === d) {
          let t = [],
            n = e;
          for (; n !== u && n >= 0;)
            (t.push([n % 44, (n / 44) | 0]), (n = s[n]));
          return t.reverse();
        }
        if (l[e] === a) continue;
        l[e] = a;
        let t = e % 44,
          n = (e / 44) | 0;
        for (let r = -1; r <= 1; r++)
          for (let l = -1; l <= 1; l++) {
            if (!l && !r) continue;
            let u = t + l,
              f = n + r;
            if (!isInBounds(u, f)) continue;
            let m = tileIndex(u, f);
            if (
              (m !== d && !this.isWalkable(u, f)) ||
              (l &&
                r &&
                (!this.isWalkable(t + l, n) || !this.isWalkable(t, n + r)))
            )
              continue;
            let g = o[e] + (l && r ? 1.4142 : 1) + (i ? i(u, f) : 0);
            (c[m] === a && g >= o[m]) ||
              ((o[m] = g), (c[m] = a), (s[m] = e), p(m, g + h(u, f)));
          }
      }
      return null;
    }
    nearestOpen(e, t) {
      let n = this.toTile(e),
        r = this.toTile(t),
        i = null,
        a = 1 / 0;
      for (let o = 0; o <= 4 && !i; o++)
        for (let s = -o; s <= o; s++)
          for (let c = -o; c <= o; c++) {
            if (
              Math.max(Math.abs(c), Math.abs(s)) !== o ||
              !this.isWalkable(n + c, r + s)
            )
              continue;
            let l = this.center(n + c),
              u = this.center(r + s),
              d = (l - e) * (l - e) + (u - t) * (u - t);
            d < a &&
              ((a = d), (i = { x: o === 0 ? e : l, z: o === 0 ? t : u }));
          }
      return i || { x: e, z: t };
    }
    update(e, t) {
      ((this.grassUniforms.uTime.value = t),
        this.waterNormal && this.waterNormal.offset.set(t * 0.021, t * 0.013),
        this.aoDirty
          ? ((this.aoTimer -= e),
            this.aoTimer <= 0 &&
              (this.rebakeGround(), (this.aoDirty = !1), (this.aoTimer = 0.3)))
          : (this.aoTimer = Math.max(0, this.aoTimer - e)));
    }
    dispose() {
      this.scene.remove(this.group);
      for (let e of this.disposables) e.dispose && e.dispose();
      for (let e of Object.values(this.meshes)) e.dispose && e.dispose();
    }
  },
  Ql = {},
  $l = (e, t) => Ql[e] || (Ql[e] = t()),
  eu = (e, t = 18, n = 14) => $l(`s${e}_${t}_${n}`, () => new xr(e, t, n)),
  tu = (e, t) => $l(`c${e}_${t}`, () => new pr(e, t, 5, 12)),
  nu = (e, t, n, r = 16) =>
    $l(`y${e}_${t}_${n}_${r}`, () => new hr(e, t, n, r)),
  ru = (e, t, n) => $l(`b${e}_${t}_${n}`, () => new fr(e, t, n)),
  iu = (e, t) =>
    $l(`d${e}_${t}`, () => new xr(e, 20, 12, 0, Math.PI * 2, 0, Math.PI * t)),
  au = (e, t) => $l(`t${e}_${t}`, () => new Sr(e, t, 8, 24)),
  ou = new br(0.5, 0.64, 44).rotateX(-Math.PI / 2),
  su = new mr(0.5, 36).rotateX(-Math.PI / 2),
  cu = new br(0.7, 0.8, 44).rotateX(-Math.PI / 2),
  lu = (e, t = {}) => new Nr({ color: e, roughness: 0.62, metalness: 0, ...t });

export { $l, Ql, World, au, cu, eu, iu, lu, nu, ou, ru, su, tu };
