// @ts-nocheck
import * as THREE from "three";
import { EffectComposer as EffectComposerAddon } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass as RenderPassAddon } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass as ShaderPassAddon } from "three/addons/postprocessing/ShaderPass.js";
import { GTAOPass as GTAOPassAddon } from "three/addons/postprocessing/GTAOPass.js";
import { UnrealBloomPass as UnrealBloomPassAddon } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass as OutputPassAddon } from "three/addons/postprocessing/OutputPass.js";

// Keep the compact aliases used by the original game bundle, but source the
// actual implementations from the pinned Three.js CDN entry point.
const {
  RepeatWrapping: e,
  ClampToEdgeWrapping: t,
  MirroredRepeatWrapping: n,
  NearestFilter: r,
  LinearFilter: i,
  LinearMipmapLinearFilter: a,
  UnsignedByteType: o,
  UnsignedShortType: s,
  UnsignedIntType: c,
  FloatType: l,
  HalfFloatType: u,
  UnsignedShort4444Type: d,
  UnsignedShort5551Type: f,
  UnsignedInt248Type: p,
  RGBAFormat: m,
  DepthFormat: h,
  DepthStencilFormat: g,
  RedFormat: _,
  RedIntegerFormat: v,
  RGFormat: y,
  RGIntegerFormat: b,
  RGBAIntegerFormat: x,
  InterpolateSmooth: w,
  InterpolateBezier: T,
  SRGBColorSpace: k,
  DynamicDrawUsage: N,
  Vector2: V,
  Quaternion: _e,
  Vector3: H,
  Vector4: Ne,
  WebGLRenderTarget: Fe,
  Matrix4: Re,
  Euler: Ke,
  Group: ut,
  Color: J,
  Scene: vt,
  BufferAttribute: Zt,
  Float32BufferAttribute: en,
  BufferGeometry: pn,
  Plane: _n,
  MeshBasicMaterial: Tn,
  Mesh: Ln,
  InstancedMesh: Yn,
  Points: ar,
  CanvasTexture: cr,
  BoxGeometry: fr,
  CapsuleGeometry: pr,
  CircleGeometry: mr,
  CylinderGeometry: hr,
  ConeGeometry: gr,
  DodecahedronGeometry: vr,
  PlaneGeometry: yr,
  RingGeometry: br,
  SphereGeometry: xr,
  TorusGeometry: Sr,
  ShaderMaterial: jr,
  MeshStandardMaterial: Nr,
  HemisphereLight: ri,
  PerspectiveCamera: hi,
  SpotLight: _i,
  PointLight: yi,
  DirectionalLight: Si,
  Raycaster: Hi,
  ShaderChunk: Y,
  PMREMGenerator: ga,
  WebGLRenderer: uc,
} = THREE;

const yc = EffectComposerAddon;
const bc = RenderPassAddon;
const gc = ShaderPassAddon;
const Ac = GTAOPassAddon;
const Mc = UnrealBloomPassAddon;
const Pc = OutputPassAddon;

const q = new H(0, 0, 0);
const on = 0;
const ao = false;
const z = 180 / Math.PI;

var TileType = { EMPTY: 0, WALL: 1, BUSH: 2, WATER: 3 },
  TerrainStyle = { STONE: 0, CRATE: 1, BARREL: 2, CACTUS: 3, ROCK: 4, LAMP: 5 },
  COLLISION_RADIUS = 0.4,
  GAME_CONFIG = {
    bots: 7,
    gasDelay: 26,
    gasDuration: 140,
    gasStartHalf: 25,
    gasEndHalf: 4,
    startHour: 15.4,
    endHour: 21.2,
    dayLength: 205,
    boxHp: 4200,
    cubeHp: 400,
    cubeDamage: 0.1,
  },
  LAMP_CONFIG = {
    height: 3.05,
    arm: 0.62,
    near: 0.4,
    far: 10.5,
    angle: 1,
    size: 0.55,
    nearClamp: 2.3,
  },
  identity = (e) => e,
  BRAWLER_DEFS = {
    dusty: {
      id: `dusty`,
      name: `DUSTY`,
      role: `Shotgunner`,
      blurb: `Wide buckshot cone. Deadly up close.`,
      hp: 3900,
      speed: 3.15,
      reload: 1.35,
      preferred: 3.6,
      palette: {
        body: identity(15906354),
        accent: identity(9064408),
        skin: identity(15844506),
        dark: identity(3811914),
      },
      superCharge: 3e3,
      attack: {
        kind: `spread`,
        pellets: 5,
        spread: 0.5,
        range: 7,
        speed: 15,
        damage: 330,
        radius: 0.15,
        color: identity(16753978),
      },
      super: {
        kind: `spread`,
        pellets: 9,
        spread: 0.85,
        range: 8,
        speed: 16,
        damage: 340,
        radius: 0.2,
        color: identity(16769354),
        knockback: 9,
        breaksWalls: !0,
      },
    },
    ace: {
      id: `ace`,
      name: `ACE`,
      role: `Sharpshooter`,
      blurb: `Long range six-shot burst.`,
      hp: 3e3,
      speed: 3.25,
      reload: 1.5,
      preferred: 6.8,
      palette: {
        body: identity(3108822),
        accent: identity(12728874),
        skin: identity(15250570),
        dark: identity(2042436),
      },
      superCharge: 3600,
      attack: {
        kind: `burst`,
        count: 6,
        interval: 0.08,
        range: 9.5,
        speed: 19,
        damage: 330,
        radius: 0.13,
        color: identity(7328511),
        jitter: 0.035,
      },
      super: {
        kind: `burst`,
        count: 12,
        interval: 0.06,
        range: 11.5,
        speed: 21,
        damage: 340,
        radius: 0.2,
        color: identity(16773242),
        jitter: 0.05,
        pierce: !0,
        breaksWalls: !0,
      },
    },
    fuse: {
      id: `fuse`,
      name: `FUSE`,
      role: `Thrower`,
      blurb: `Lobs bombs over walls.`,
      hp: 2900,
      speed: 3,
      reload: 1.55,
      preferred: 5.8,
      palette: {
        body: identity(14836266),
        accent: identity(16175674),
        skin: identity(15318422),
        dark: identity(3878953),
      },
      superCharge: 3e3,
      attack: {
        kind: `lob`,
        range: 7.5,
        flight: 0.72,
        fuse: 0.38,
        blast: 1.55,
        damage: 920,
        color: identity(16742954),
      },
      super: {
        kind: `lob`,
        range: 8.5,
        flight: 0.95,
        fuse: 0.7,
        blast: 2.8,
        damage: 2400,
        color: identity(16765498),
        knockback: 10,
        breaksWalls: !0,
        big: !0,
      },
    },
    titan: {
      id: `titan`,
      name: `TITAN`,
      role: `Heavyweight`,
      blurb: `Huge health. Punches and leaps.`,
      hp: 6200,
      speed: 3.45,
      reload: 0.85,
      preferred: 1.6,
      palette: {
        body: identity(2772920),
        accent: identity(14826042),
        skin: identity(14262906),
        dark: identity(1712184),
      },
      superCharge: 3200,
      attack: {
        kind: `melee`,
        count: 4,
        interval: 0.09,
        range: 2.7,
        speed: 13,
        damage: 390,
        radius: 0.48,
        color: identity(16734794),
        jitter: 0.12,
      },
      super: {
        kind: `leap`,
        range: 8,
        flight: 0.75,
        blast: 2.3,
        damage: 1e3,
        color: identity(16765498),
        knockback: 11,
        breaksWalls: !0,
      },
    },
  },
  BOT_NAMES = [
    `Rusty`,
    `Nova`,
    `Pixel`,
    `Bolt`,
    `Maple`,
    `Onyx`,
    `Ziggy`,
    `Comet`,
    `Pepper`,
    `Havoc`,
    `Mango`,
    `Sprocket`,
    `Biscuit`,
    `Turbo`,
  ],
  DIFFICULTIES = {
    easy: {
      label: `Easy`,
      damage: 0.5,
      skill: [0.3, 0.6],
      react: 1.9,
      cadence: 1.6,
      hunters: 1,
      engage: 5.5,
    },
    normal: {
      label: `Normal`,
      damage: 0.68,
      skill: [0.45, 0.78],
      react: 1.4,
      cadence: 1.3,
      hunters: 2,
      engage: 6.5,
    },
    hard: {
      label: `Hard`,
      damage: 0.85,
      skill: [0.62, 0.95],
      react: 1,
      cadence: 1,
      hunters: 3,
      engage: 9,
    },
  },
  QUALITY_PRESETS = {
    low: {
      label: `Low`,
      dpr: 1,
      msaa: 0,
      shadowMap: 1024,
      pcss: !1,
      tier: 0,
      ao: !1,
      bloom: !0,
      lampShadows: !1,
      lampMap: 512,
      poolLights: 4,
    },
    medium: {
      label: `Medium`,
      dpr: 1,
      msaa: 2,
      shadowMap: 2048,
      pcss: !0,
      tier: 1,
      ao: !1,
      bloom: !0,
      lampShadows: !0,
      lampMap: 512,
      poolLights: 6,
    },
    high: {
      label: `High`,
      dpr: 1.25,
      msaa: 4,
      shadowMap: 4096,
      pcss: !0,
      tier: 2,
      ao: !0,
      bloom: !0,
      lampShadows: !0,
      lampMap: 1024,
      poolLights: 10,
    },
    ultra: {
      label: `Ultra`,
      dpr: 2,
      msaa: 4,
      shadowMap: 4096,
      pcss: !0,
      tier: 3,
      ao: !0,
      bloom: !0,
      lampShadows: !0,
      lampMap: 2048,
      poolLights: 12,
    },
  },
  PCSS_SHADOW_CHUNK = `

		#define PCSS_SUN_DEPTH_SOFTNESS ${(120 * 0.085 * 0.5).toFixed(4)}
		#define PCSS_SUN_MAX_WORLD ${(0.2).toFixed(4)}
		#define PCSS_LAMP_NEAR ${LAMP_CONFIG.near.toFixed(4)}
		#define PCSS_LAMP_FAR ${LAMP_CONFIG.far.toFixed(4)}
		#define PCSS_LAMP_MAX_UV ${(0.022).toFixed(4)}
		#define PCSS_NOISE_PERIOD ${(64).toFixed(1)}

		float pcssNoise( vec2 p ) {

			return fract( 52.9829189 * fract( dot( p, vec2( 0.06711056, 0.00583715 ) ) ) );

		}

		vec2 pcssDisk( int i, float n, float phi ) {

			float r = sqrt( ( float( i ) + 0.5 ) / n );
			float theta = float( i ) * 2.399963229728653 + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;

		}

		float pcssLinearDepth( float z ) {

			return PCSS_LAMP_NEAR * PCSS_LAMP_FAR / ( PCSS_LAMP_FAR - z * ( PCSS_LAMP_FAR - PCSS_LAMP_NEAR ) );

		}

		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {

			float shadow = 1.0;

			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;

			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;

			if ( frustumTest ) {

				float packed = abs( shadowRadius );
				float tier = floor( packed );
				float param = packed - tier;
				bool persp = shadowRadius < 0.0;

				int nSearch = 8 + int( tier ) * 4;
				int nFilter = 10 + int( tier ) * 8;
				float fSearch = float( nSearch );
				float fFilter = float( nFilter );

				float zR = shadowCoord.z;
				float texel = 1.0 / shadowMapSize.x;
				float maxRadius = persp ? PCSS_LAMP_MAX_UV : PCSS_SUN_MAX_WORLD * param * 0.1;
				// Rotate the sample disk per shadow-map texel, not per screen pixel. A
				// screen-space pattern slides over the world whenever the camera pans, and
				// every penumbra shimmers. The pattern repeats every PCSS_NOISE_PERIOD
				// texels and the shadow frustum only ever moves in whole periods (see
				// Lighting.fitShadow), so the grain stays glued to the ground.
				vec2 grainCell = mod( floor( shadowCoord.xy * shadowMapSize ), PCSS_NOISE_PERIOD );
				float phi = pcssNoise( grainCell ) * 6.28318530718;

				// 1. blocker search: average depth of whatever sits between us and the light

				float blockerSum = 0.0;
				float blockers = 0.0;

				for ( int i = 0; i < 20; i ++ ) {

					if ( i >= nSearch ) break;
					float d = textureLod( shadowMap, shadowCoord.xy + pcssDisk( i, fSearch, phi ) * maxRadius, 0.0 ).r;
					if ( d < zR ) { blockerSum += d; blockers += 1.0; }

				}

				if ( blockers >= fSearch ) {

					shadow = 0.0; // deep umbra, skip the filter

				} else if ( blockers > 0.5 ) {

					// 2. penumbra width grows with the blocker -> receiver distance

					float zB = blockerSum / blockers;
					float radius;

					if ( persp ) {

						float lR = pcssLinearDepth( zR );
						float lB = pcssLinearDepth( zB );
						radius = ( lR - lB ) / ( lB * lR ) * param;

					} else {

						radius = ( zR - zB ) * PCSS_SUN_DEPTH_SOFTNESS * param * 0.1;

					}

					radius = clamp( radius, texel * 1.25, maxRadius );

					// 3. variable-width percentage-closer filter

					float lit = 0.0;

					for ( int i = 0; i < 34; i ++ ) {

						if ( i >= nFilter ) break;
						lit += step( zR, textureLod( shadowMap, shadowCoord.xy + pcssDisk( i, fFilter, phi + 1.7 ) * radius, 0.0 ).r );

					}

					shadow = lit / fFilter;

				}

			}

			return mix( 1.0, shadow, shadowIntensity );

		}

`,
  pcssPatchState = null;
function findVsmShadowBlock(e) {
  let t = e.indexOf(`#elif defined( SHADOWMAP_TYPE_VSM )`);
  if (t < 0) return null;
  let n = /#[ \t]*(ifdef|ifndef|if|elif|else|endif)\b/g;
  n.lastIndex = t + 5;
  let r = 0,
    i = -1,
    a;
  for (; (a = n.exec(e));) {
    let t = a[1];
    if (t === `if` || t === `ifdef` || t === `ifndef`) r++;
    else if (t === `endif`) {
      if (r === 0)
        return i < 0
          ? null
          : e.slice(i, a.index).includes(`float getShadow( sampler2D shadowMap`)
            ? { start: i, end: a.index }
            : null;
      r--;
    } else if (t === `else` && r === 0 && i < 0) {
      let t = e.indexOf(
        `
`,
        a.index,
      );
      i = t < 0 ? a.index + a[0].length : t;
    }
  }
  return null;
}
function patchSpotAttenuation() {
  let e = `getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay )`,
    t = `getDistanceAttenuation( max( lightDistance, ${LAMP_CONFIG.nearClamp.toFixed(2)} ), spotLight.distance, spotLight.decay )`,
    n = Y.lights_pars_begin;
  n.includes(e)
    ? (Y.lights_pars_begin = n.replace(e, t))
    : console.warn(
        `[pipeline] spot light chunk changed - lamps keep plain inverse-square falloff`,
      );
}
function installPcssShadowPatch() {
  if (pcssPatchState !== null) return pcssPatchState;
  patchSpotAttenuation();
  let e = Y.shadowmap_pars_fragment,
    t = findVsmShadowBlock(e);
  return t
    ? ((Y.shadowmap_pars_fragment =
        e.slice(0, t.start) +
        `
` +
        PCSS_SHADOW_CHUNK +
        `
	` +
        e.slice(t.end)),
      (pcssPatchState = !0),
      !0)
    : (console.warn(
        `[pipeline] shadow chunk layout changed - falling back to hardware PCF shadows`,
      ),
      (pcssPatchState = !1),
      !1);
}
var SANITIZE_SHADER = {
    name: `SanitizeShader`,
    uniforms: { tDiffuse: { value: null } },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D( tDiffuse, vUv );
      bvec3 bad = bvec3( isnan( c.r ) || isinf( c.r ), isnan( c.g ) || isinf( c.g ), isnan( c.b ) || isinf( c.b ) );
      c.rgb = mix( c.rgb, vec3( 0.0 ), vec3( bad ) );
      gl_FragColor = vec4( clamp( c.rgb, 0.0, 120.0 ), 1.0 );
    }`,
  },
  GRADE_SHADER = {
    name: `GradeShader`,
    uniforms: {
      tDiffuse: { value: null },
      uVignette: { value: 0.32 },
      uSaturation: { value: 1.1 },
      uTint: { value: new J(1, 1, 1) },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uVignette;
    uniform float uSaturation;
    uniform vec3 uTint;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D( tDiffuse, vUv );
      vec2 d = ( vUv - 0.5 ) * vec2( 1.0, 1.12 );
      float v = smoothstep( 0.9, 0.3, length( d ) );
      c.rgb *= mix( 1.0 - uVignette, 1.0, v );
      float l = dot( c.rgb, vec3( 0.2126, 0.7152, 0.0722 ) );
      // split-tone: uTint colours the dark end only, so lamp-lit areas keep their warmth
      vec3 tint = mix( uTint, vec3( 1.0 ), smoothstep( 0.04, 0.75, l ) );
      c.rgb = max( mix( vec3( l ), c.rgb, uSaturation ), 0.0 ) * tint;
      gl_FragColor = c;
    }`,
  },
  RenderPipeline = class {
    constructor(e, t, n) {
      ((this.scene = t),
        (this.camera = n),
        (this.pcssAvailable = installPcssShadowPatch()));
      let r = new uc({
        canvas: e,
        antialias: !1,
        powerPreference: `high-performance`,
        stencil: !1,
      });
      ((this.renderer = r),
        (r.outputColorSpace = k),
        (r.toneMapping = 4),
        (r.toneMappingExposure = 1),
        (r.shadowMap.enabled = !0),
        (r.shadowMap.type = +!this.pcssAvailable),
        (r.shadowMap.autoUpdate = !1),
        r.setClearColor(724506, 1),
        (this.qualityName = `high`),
        (this.quality = QUALITY_PRESETS.high),
        (this.toggles = { ao: !0, bloom: !0 }),
        (this.superSample = 0),
        (this.composer = null),
        (this.width = 1),
        (this.height = 1));
    }
    get usingPCSS() {
      return this.pcssAvailable && this.quality.pcss;
    }
    setQuality(e) {
      if (!QUALITY_PRESETS[e]) return;
      ((this.qualityName = e), (this.quality = QUALITY_PRESETS[e]));
      let t = +!this.usingPCSS;
      (this.renderer.shadowMap.type !== t && (this.renderer.shadowMap.type = t),
        this.build());
    }
    build() {
      let e = this.quality,
        t = this.renderer,
        n = Math.max(2, window.innerWidth),
        r = Math.max(2, window.innerHeight),
        i = this.superSample || Math.min(window.devicePixelRatio || 1, e.dpr);
      (t.setPixelRatio(i),
        t.setSize(n, r, !1),
        (this.width = n),
        (this.height = r),
        this.composer &&
          (this.composer.passes.forEach((e) => e.dispose && e.dispose()),
          this.composer.renderTarget1.dispose(),
          this.composer.renderTarget2.dispose()));
      let a = t.getDrawingBufferSize(new V()),
        o = new yc(t, new Fe(a.x, a.y, { type: u, samples: e.msaa }));
      if (
        (o.setPixelRatio(i),
        o.setSize(n, r),
        (this.composer = o),
        o.addPass(new bc(this.scene, this.camera)),
        o.addPass(new gc(SANITIZE_SHADER)),
        (this.gtao = null),
        e.ao)
      ) {
        let e = new Ac(this.scene, this.camera, a.x, a.y);
        ((e.output = Ac.OUTPUT.Default),
          (e.blendIntensity = 0.85),
          e.updateGtaoMaterial({
            radius: 0.55,
            distanceExponent: 1.4,
            thickness: 1.2,
            scale: 1.15,
            samples: 16,
            distanceFallOff: 1,
            screenSpaceRadius: !1,
          }),
          e.updatePdMaterial({
            lumaPhi: 10,
            depthPhi: 2,
            normalPhi: 3,
            radius: 7,
            radiusExponent: 1.2,
            rings: 2,
            samples: 14,
          }));
        let t = e._overrideVisibility.bind(e);
        ((e._overrideVisibility = function () {
          t();
          let e = this._visibilityCache;
          this.scene.traverse((t) => {
            t.userData.noAO && t.visible && ((t.visible = !1), e.push(t));
          });
        }),
          (e.enabled = this.toggles.ao),
          o.addPass(e),
          (this.gtao = e));
      }
      ((this.bloom = new Mc(new V(a.x, a.y), 0.5, 0.72, 1.2)),
        (this.bloom.enabled = e.bloom && this.toggles.bloom),
        o.addPass(this.bloom),
        (this.grade = new gc(GRADE_SHADER)),
        o.addPass(this.grade),
        o.addPass(new Pc()));
    }
    setToggle(e, t) {
      ((this.toggles[e] = t),
        e === `ao` && this.gtao && (this.gtao.enabled = t),
        e === `bloom` &&
          this.bloom &&
          (this.bloom.enabled = t && this.quality.bloom));
    }
    resize() {
      let e = Math.max(2, window.innerWidth),
        t = Math.max(2, window.innerHeight);
      (e !== this.width || t !== this.height) &&
        ((this.width = e),
        (this.height = t),
        this.renderer.setSize(e, t, !1),
        this.composer.setSize(e, t),
        (this.camera.aspect = e / t),
        this.camera.updateProjectionMatrix());
    }
    render(e) {
      ((this.renderer.shadowMap.needsUpdate = !0), this.composer.render(e));
    }
  };
function Qc(e) {
  let t = e | 0;
  return function () {
    t = (t + 1831565813) | 0;
    let e = Math.imul(t ^ (t >>> 15), 1 | t);
    return (
      (e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
var $c = (e, t, n) => Math.max(t, Math.min(n, e)),
  el = (e, t, n) => e + (t - e) * n,
  tl = (e, t, n) => {
    let r = $c((n - e) / (t - e), 0, 1);
    return r * r * (3 - 2 * r);
  },
  nl = (e, t, n, r) => el(e, t, 1 - Math.exp(-n * r)),
  Q = (e = 0, t = 1) => e + Math.random() * (t - e);
function rl(e, t) {
  let n = (t - e) % (Math.PI * 2);
  return (
    n > Math.PI && (n -= Math.PI * 2),
    n < -Math.PI && (n += Math.PI * 2),
    n
  );
}
var il = (e, t, n, r) => e + rl(e, t) * (1 - Math.exp(-n * r));
function al(e, t) {
  let n = document.createElement(`canvas`);
  return ((n.width = e), (n.height = t), n);
}
var ol = (e, t, n, r) => (e - n) * (e - n) + (t - r) * (t - r),
  sl = (e, t, n, r) => Math.sqrt(ol(e, t, n, r)),
  cl = {
    sun: 16777215,
    sunI: 0,
    sky: 4152528,
    ground: 1514820,
    hemiI: 0.6,
    fill: 6258656,
    fillI: 0.2,
    envI: 0.09,
    exp: 1.2,
    sat: 1.08,
    vig: 0.46,
  },
  ll = {
    sun: 16773336,
    sunI: 4.6,
    sky: 12573951,
    ground: 11570784,
    hemiI: 0.8,
    fill: 14543103,
    fillI: 0.42,
    envI: 0.26,
    exp: 0.98,
    sat: 1.12,
    vig: 0.28,
  },
  ul = [
    { h: 0, ...cl },
    { h: 4.9, ...cl },
    {
      h: 6.1,
      sun: 16742970,
      sunI: 2.6,
      sky: 10129366,
      ground: 6965834,
      hemiI: 0.62,
      fill: 11575520,
      fillI: 0.26,
      envI: 0.18,
      exp: 1.12,
      sat: 1.12,
      vig: 0.36,
    },
    {
      h: 7.6,
      sun: 16758903,
      sunI: 4,
      sky: 11849471,
      ground: 9730140,
      hemiI: 0.72,
      fill: 13623551,
      fillI: 0.36,
      envI: 0.22,
      exp: 1,
      sat: 1.12,
      vig: 0.3,
    },
    { h: 10.5, ...ll },
    { h: 15, ...ll },
    {
      h: 17.2,
      sun: 16754002,
      sunI: 4.7,
      sky: 11122943,
      ground: 10252368,
      hemiI: 0.7,
      fill: 13160703,
      fillI: 0.36,
      envI: 0.22,
      exp: 1,
      sat: 1.16,
      vig: 0.32,
    },
    {
      h: 18.4,
      sun: 16739884,
      sunI: 4.4,
      sky: 9275098,
      ground: 7358536,
      hemiI: 0.66,
      fill: 11051240,
      fillI: 0.3,
      envI: 0.19,
      exp: 1.06,
      sat: 1.18,
      vig: 0.36,
    },
    {
      h: 19.2,
      sun: 16734762,
      sunI: 2.6,
      sky: 6714056,
      ground: 3551322,
      hemiI: 0.72,
      fill: 8423648,
      fillI: 0.28,
      envI: 0.17,
      exp: 1.2,
      sat: 1.1,
      vig: 0.4,
    },
    { h: 20.3, ...cl },
    { h: 24, ...cl },
  ].map((e) => ({
    ...e,
    sun: new J(e.sun),
    sky: new J(e.sky),
    ground: new J(e.ground),
    fill: new J(e.fill),
  })),
  dl = new J(8825087),
  fl = 1.35,
  pl = new J(0.74, 0.88, 1.26),
  ml = new J(16758112),
  hl = 46,
  gl = 2,
  _l = 60,
  vl = new H(),
  yl = new Re(),
  bl = new H(),
  xl = new H(),
  Sl = new H(),
  Cl = new H(0, 1, 0),
  wl = new Hi(),
  Tl = new V(),
  El = new _n(new H(0, 1, 0), 0),
  Dl = new H(),
  Ol = new H(),
  kl = class {
    constructor(e, t) {
      ((this.scene = e),
        (this.pipeline = t),
        (this.time = 15.4),
        (this.night = 0),
        (this.ambientLevel = 1),
        (this.state = {
          sun: new J(),
          sky: new J(),
          ground: new J(),
          fill: new J(),
          sunI: 0,
          hemiI: 1,
          fillI: 0,
          envI: 0.5,
          exp: 1,
          sat: 1,
          vig: 0.3,
        }),
        (this.keyDir = new H(0, 1, 0)),
        (this.shadowRadius = 20),
        (this.tier = 1),
        (this.mapSize = 4096));
      let n = new Si(16777215, 3);
      ((n.name = `key`),
        (n.castShadow = !0),
        n.shadow.mapSize.set(this.mapSize, this.mapSize),
        (n.shadow.camera.near = 1),
        (n.shadow.camera.far = 121),
        (n.shadow.bias = -35e-5),
        (n.shadow.normalBias = 0.028),
        e.add(n, n.target),
        (this.key = n));
      let r = new Si(14543103, 0.4);
      (r.position.set(2.5, 9, 10), e.add(r), (this.fill = r));
      let i = new ri(13624575, 11046504, 1.2);
      (e.add(i),
        (this.hemi = i),
        this.buildEnvironment(),
        (this.pool = []),
        (this.requests = []),
        (this.requestCount = 0));
      for (let e = 0; e < 96; e++)
        this.requests.push({
          x: 0,
          y: 0,
          z: 0,
          r: 1,
          g: 1,
          b: 1,
          intensity: 0,
          distance: 4,
          score: 0,
        });
      ((this.focus = new H()),
        (this.lamps = []),
        (this.lampSlots = []),
        (this.lampShadowSlots = 4),
        (this.lampGlass = null),
        (this.cones = []),
        (this.coneMaterial = new jr({
          uniforms: { uColor: { value: ml.clone() }, uStrength: { value: 0 } },
          vertexShader: `
        varying vec3 vN; varying vec3 vView; varying float vH;
        void main() {
          vH = uv.y;
          vec4 mv = modelViewMatrix * vec4( position, 1.0 );
          vN = normalize( normalMatrix * normal );
          vView = normalize( - mv.xyz );
          gl_Position = projectionMatrix * mv;
        }`,
          fragmentShader: `
        uniform vec3 uColor; uniform float uStrength;
        varying vec3 vN; varying vec3 vView; varying float vH;
        void main() {
          float facing = abs( dot( normalize( vN ), normalize( vView ) ) );
          float edge = smoothstep( 0.0, 0.9, facing );
          // clamp first: pow() of a slightly negative interpolant is NaN, and one NaN
          // pixel is smeared across the whole frame by the bloom blur
          float h = clamp( vH, 0.0, 1.0 );
          float fall = pow( h, 2.4 ) * 0.9 + 0.035 * h;
          gl_FragColor = vec4( uColor * uStrength * edge * fall, 1.0 );
        }`,
          transparent: !0,
          blending: 2,
          depthWrite: !1,
          side: 2,
        })),
        this.buildLampSlots(8),
        this.setTime(this.time));
    }
    buildEnvironment() {
      let e = new vt(),
        t = new Ln(
          new xr(10, 32, 16),
          new jr({
            side: 1,
            vertexShader: `varying vec3 vDir; void main() { vDir = normalize( position ); gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); }`,
            fragmentShader: `
          varying vec3 vDir;
          void main() {
            float y = normalize( vDir ).y;
            vec3 zenith = vec3( 0.34, 0.55, 1.0 ) * 1.15;
            vec3 horizon = vec3( 1.0, 0.93, 0.82 ) * 1.25;
            vec3 floorC = vec3( 0.62, 0.47, 0.30 ) * 0.55;
            vec3 c = y > 0.0 ? mix( horizon, zenith, pow( y, 0.55 ) ) : mix( horizon * 0.7, floorC, pow( - y, 0.4 ) );
            gl_FragColor = vec4( c, 1.0 );
          }`,
          }),
        );
      e.add(t);
      let n = new ga(this.pipeline.renderer);
      ((this.envTarget = n.fromScene(e, 0.03)),
        (this.scene.environment = this.envTarget.texture),
        n.dispose(),
        t.geometry.dispose(),
        t.material.dispose(),
        (this.scene.background = new J(724506)));
    }
    applyQuality(e) {
      ((this.tier = e.tier),
        (this.pcss = this.pipeline.usingPCSS),
        this.mapSize !== e.shadowMap &&
          ((this.mapSize = e.shadowMap),
          this.key.shadow.mapSize.set(e.shadowMap, e.shadowMap),
          this.key.shadow.map &&
            (this.key.shadow.map.dispose(), (this.key.shadow.map = null))),
        this.setPoolSize(e.poolLights),
        this.lampSlots.forEach((t, n) => {
          let r = e.lampShadows && n < this.lampShadowSlots;
          (t.castShadow !== r && (t.castShadow = r),
            t.shadow.mapSize.x !== e.lampMap &&
              (t.shadow.mapSize.set(e.lampMap, e.lampMap),
              t.shadow.map && (t.shadow.map.dispose(), (t.shadow.map = null))));
        }),
        this.updateShadowParams());
    }
    updateShadowParams() {
      let e = LAMP_CONFIG.size / (4 * Math.tan(LAMP_CONFIG.angle));
      if (this.pcss) {
        this.key.shadow.radius =
          this.tier + $c(10 / (this.shadowRadius * 2), 0.001, 0.999);
        let t = Math.max(0, this.tier - 1);
        this.lampSlots.forEach((n) => (n.shadow.radius = -(t + e)));
      } else
        ((this.key.shadow.radius = 2.5),
          this.lampSlots.forEach((e) => (e.shadow.radius = 2)));
    }
    setPoolSize(e) {
      for (; this.pool.length < e;) {
        let e = new yi(16777215, 0, 5, 2);
        (e.position.set(0, -50, 0), this.scene.add(e), this.pool.push(e));
      }
      for (; this.pool.length > e;) {
        let e = this.pool.pop();
        (this.scene.remove(e), e.dispose());
      }
    }
    buildLampSlots(e) {
      for (let t = 0; t < e; t++) {
        let e = new _i(ml, 0, LAMP_CONFIG.far, LAMP_CONFIG.angle, 0.55, gl);
        (e.position.set(0, LAMP_CONFIG.height, 0),
          (e.castShadow = t < this.lampShadowSlots),
          e.shadow.mapSize.set(1024, 1024),
          (e.shadow.camera.near = LAMP_CONFIG.near),
          (e.shadow.camera.far = LAMP_CONFIG.far),
          (e.shadow.bias = -9e-4),
          (e.shadow.normalBias = 0.03),
          (e.shadow.autoUpdate = !1),
          this.scene.add(e, e.target),
          this.lampSlots.push(e));
      }
    }
    setLamps(e, t) {
      (this.cones.forEach((e) => this.scene.remove(e)),
        (this.cones.length = 0),
        (this.lamps = e.map((e) => ({
          x: e.x,
          z: e.z,
          d: 0,
          phase: Math.random() * 10,
        }))),
        (this.lampGlass = t));
      let n = LAMP_CONFIG.height - 0.12,
        r = new gr(Math.tan(LAMP_CONFIG.angle * 0.8) * n, n, 40, 1, !0);
      r.translate(0, n / 2, 0);
      for (let e of this.lamps) {
        let t = new Ln(r, this.coneMaterial);
        (t.position.set(e.x, 0, e.z),
          (t.userData.noAO = !0),
          (t.renderOrder = 5),
          this.scene.add(t),
          this.cones.push(t));
      }
    }
    setTime(e) {
      ((this.time = ((e % 24) + 24) % 24), this.applyTime());
    }
    sample(e) {
      let t = 0;
      for (; t < ul.length - 2 && e >= ul[t + 1].h;) t++;
      let n = ul[t],
        r = ul[t + 1],
        i = $c((e - n.h) / (r.h - n.h), 0, 1),
        a = this.state;
      (a.sun.lerpColors(n.sun, r.sun, i),
        a.sky.lerpColors(n.sky, r.sky, i),
        a.ground.lerpColors(n.ground, r.ground, i),
        a.fill.lerpColors(n.fill, r.fill, i));
      for (let e of [`sunI`, `hemiI`, `fillI`, `envI`, `exp`, `sat`, `vig`])
        a[e] = el(n[e], r[e], i);
      return a;
    }
    applyTime() {
      let e = this.time,
        t = this.sample(e),
        n = ((e - 6) / 13) * Math.PI,
        r = Math.sin(n),
        i = e > 6 && e < 19 ? tl(0, 0.2, r) : 0,
        a = Math.max(tl(19.15, 20.2, e), 1 - tl(4.7, 5.7, e));
      if (i > 5e-4)
        (this.keyDir
          .set(Math.cos(n), Math.max(r * 0.85, 0.17), -(0.22 + 0.3 * r))
          .normalize(),
          this.key.color.copy(t.sun),
          (this.key.intensity = t.sunI * i));
      else {
        let t = (e > 12 ? e - 20 : e + 4) * 0.06;
        (this.keyDir.set(0.55 - t, 0.78, -0.5).normalize(),
          this.key.color.copy(dl),
          (this.key.intensity = fl * a));
      }
      (this.hemi.color.copy(t.sky),
        this.hemi.groundColor.copy(t.ground),
        (this.hemi.intensity = t.hemiI),
        this.fill.color.copy(t.fill),
        (this.fill.intensity = t.fillI),
        (this.scene.environmentIntensity = t.envI),
        this.scene.background.copy(t.sky).multiplyScalar(0.18),
        (this.pipeline.renderer.toneMappingExposure = t.exp),
        (this.night = Math.max(tl(18.5, 19.55, e), 1 - tl(5.4, 6.3, e))),
        (this.ambientLevel = el(1, 0.36, this.night)));
    }
    addLight(e, t, n, r, i, a = 5) {
      if (this.requestCount >= this.requests.length || i <= 0.01) return;
      let o = this.requests[this.requestCount++];
      ((o.x = e),
        (o.y = t),
        (o.z = n),
        (o.r = r.r),
        (o.g = r.g),
        (o.b = r.b),
        (o.intensity = i),
        (o.distance = a));
    }
    assignPool() {
      let e = this.requestCount,
        t = this.focus;
      for (let n = 0; n < e; n++) {
        let e = this.requests[n],
          r = e.x - t.x,
          i = e.z - (t.z - 2);
        e.score = e.intensity / (1 + (r * r + i * i) * 0.03);
      }
      let n = Math.min(this.pool.length, e);
      for (let t = 0; t < n; t++) {
        let n = t;
        for (let r = t + 1; r < e; r++)
          this.requests[r].score > this.requests[n].score && (n = r);
        if (n !== t) {
          let e = this.requests[t];
          ((this.requests[t] = this.requests[n]), (this.requests[n] = e));
        }
      }
      for (let e = 0; e < this.pool.length; e++) {
        let t = this.pool[e];
        if (e < n) {
          let n = this.requests[e];
          (t.position.set(n.x, n.y, n.z),
            t.color.setRGB(n.r, n.g, n.b),
            (t.intensity = n.intensity),
            (t.distance = n.distance));
        } else t.intensity = 0;
      }
      this.requestCount = 0;
    }
    updateLamps(e) {
      let t = this.night,
        n = t > 0.002;
      for (let e of this.lampSlots)
        e.castShadow && e.shadow.map === null && (e.shadow.needsUpdate = !0);
      (this.lampGlass && (this.lampGlass.emissiveIntensity = 0.15 + t * 4.2),
        (this.coneMaterial.uniforms.uStrength.value = t * 0.6));
      for (let e of this.cones) e.visible = n;
      if (!n || this.lamps.length === 0) {
        for (let e of this.lampSlots)
          ((e.intensity = 0), (e.shadow.autoUpdate = !1));
        return;
      }
      let r = this.focus;
      for (let e of this.lamps) e.d = Math.hypot(e.x - r.x, e.z - (r.z - 2));
      this.lamps.sort((e, t) => e.d - t.d);
      for (let n = 0; n < this.lampSlots.length; n++) {
        let r = this.lampSlots[n],
          i = this.lamps[n];
        if (!i) {
          ((r.intensity = 0), (r.shadow.autoUpdate = !1));
          continue;
        }
        let a = 1 - tl(19, 25, i.d),
          o =
            1 +
            Math.sin(e * 7 + i.phase) * 0.006 +
            Math.sin(e * 17 + i.phase * 3) * 0.004;
        (r.position.set(i.x, LAMP_CONFIG.height - 0.52, i.z),
          r.target.position.set(i.x, 0, i.z),
          r.target.updateMatrixWorld(),
          (r.intensity = hl * t * a * o),
          r.castShadow &&
            ((r.shadow.intensity = 1 - tl(10.5, 14.5, i.d)),
            (r.shadow.autoUpdate =
              r.intensity > 0.01 && r.shadow.intensity > 0.005)));
      }
    }
    fitShadow(e) {
      let t = [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
          [0, -1],
          [0, 1],
        ],
        n = [];
      for (let [r, i] of t) {
        (Tl.set(r, i), wl.setFromCamera(Tl, e));
        let t = wl.ray.intersectPlane(El, Dl);
        t && wl.ray.origin.distanceTo(t) < 90
          ? n.push(t.clone())
          : n.push(
              wl.ray.origin
                .clone()
                .addScaledVector(wl.ray.direction, 90)
                .setY(0),
            );
      }
      Ol.copy(n[4]).add(n[5]).multiplyScalar(0.5);
      let r = 0;
      for (let e = 0; e < 4; e++) r = Math.max(r, Ol.distanceTo(n[e]));
      let i = $c(Math.ceil(r + 3.5), 12, 46);
      ((i > this.shadowRadius || i < this.shadowRadius - 3) &&
        ((this.shadowRadius = i), this.updateShadowParams()),
        (r = this.shadowRadius));
      let a = this.key.shadow.camera;
      (a.right !== r &&
        ((a.left = -r),
        (a.right = r),
        (a.top = r),
        (a.bottom = -r),
        a.updateProjectionMatrix()),
        yl.lookAt(vl.copy(this.keyDir).multiplyScalar(_l), Sl, Cl),
        bl.setFromMatrixColumn(yl, 0),
        xl.setFromMatrixColumn(yl, 1));
      let o = ((2 * r) / this.mapSize) * 64,
        s = Ol.dot(bl),
        c = Ol.dot(xl);
      (Ol.addScaledVector(bl, Math.round(s / o) * o - s),
        Ol.addScaledVector(xl, Math.round(c / o) * o - c),
        this.key.target.position.copy(Ol),
        this.key.position.copy(Ol).addScaledVector(this.keyDir, _l),
        this.key.target.updateMatrixWorld(),
        this.key.updateMatrixWorld(),
        this.fill.target.position.copy(Ol),
        this.fill.position.set(Ol.x + 2.5, 9, Ol.z + 10),
        this.fill.target.updateMatrixWorld(),
        this.fill.target.parent || this.scene.add(this.fill.target));
    }
    resetShadowFit() {
      this.shadowRadius = 0;
    }
    update(e, t, n, r, i = !1) {
      (this.focus.copy(r),
        this.fitShadow(n),
        this.updateLamps(t),
        i || this.assignPool());
      let a = this.pipeline.grade;
      a &&
        ((a.uniforms.uSaturation.value = this.state.sat),
        (a.uniforms.uVignette.value = this.state.vig),
        a.uniforms.uTint.value.setRGB(1, 1, 1).lerp(pl, this.night));
    }
  },
  Al = new H();
function jl(e, t, n, r, i, a) {
  let o = (2 * Math.PI * i) / 4,
    s = Math.max(a - 2 * i, 0),
    c = Math.PI / 4;
  (Al.copy(t), (Al[r] = 0), Al.normalize());
  let l = (0.5 * o) / (o + s),
    u = 1 - Al.angleTo(e) / c;
  return Math.sign(Al[n]) === 1 ? u * l : s / (o + s) + l + l * (1 - u);
}
var RoundedBoxGeometry = class e extends fr {
  constructor(e = 1, t = 1, n = 1, r = 2, i = 0.1) {
    let a = r * 2 + 1;
    if (
      ((i = Math.min(e / 2, t / 2, n / 2, i)),
      super(1, 1, 1, a, a, a),
      (this.type = `RoundedBoxGeometry`),
      (this.parameters = {
        width: e,
        height: t,
        depth: n,
        segments: r,
        radius: i,
      }),
      a === 1)
    )
      return;
    let o = this.toNonIndexed();
    ((this.index = null),
      (this.attributes.position = o.attributes.position),
      (this.attributes.normal = o.attributes.normal),
      (this.attributes.uv = o.attributes.uv));
    let s = new H(),
      c = new H(),
      l = new H(e, t, n).divideScalar(2).subScalar(i),
      u = this.attributes.position.array,
      d = this.attributes.normal.array,
      f = this.attributes.uv.array,
      p = u.length / 6,
      m = new H(),
      h = 0.5 / a;
    for (let r = 0, a = 0; r < u.length; r += 3, a += 2)
      switch (
        (s.fromArray(u, r),
        c.copy(s),
        (c.x -= Math.sign(c.x) * h),
        (c.y -= Math.sign(c.y) * h),
        (c.z -= Math.sign(c.z) * h),
        c.normalize(),
        (u[r + 0] = l.x * Math.sign(s.x) + c.x * i),
        (u[r + 1] = l.y * Math.sign(s.y) + c.y * i),
        (u[r + 2] = l.z * Math.sign(s.z) + c.z * i),
        (d[r + 0] = c.x),
        (d[r + 1] = c.y),
        (d[r + 2] = c.z),
        Math.floor(r / p))
      ) {
        case 0:
          (m.set(1, 0, 0),
            (f[a + 0] = jl(m, c, `z`, `y`, i, n)),
            (f[a + 1] = 1 - jl(m, c, `y`, `z`, i, t)));
          break;
        case 1:
          (m.set(-1, 0, 0),
            (f[a + 0] = 1 - jl(m, c, `z`, `y`, i, n)),
            (f[a + 1] = 1 - jl(m, c, `y`, `z`, i, t)));
          break;
        case 2:
          (m.set(0, 1, 0),
            (f[a + 0] = 1 - jl(m, c, `x`, `z`, i, e)),
            (f[a + 1] = jl(m, c, `z`, `x`, i, n)));
          break;
        case 3:
          (m.set(0, -1, 0),
            (f[a + 0] = 1 - jl(m, c, `x`, `z`, i, e)),
            (f[a + 1] = 1 - jl(m, c, `z`, `x`, i, n)));
          break;
        case 4:
          (m.set(0, 0, 1),
            (f[a + 0] = 1 - jl(m, c, `x`, `y`, i, e)),
            (f[a + 1] = 1 - jl(m, c, `y`, `x`, i, t)));
          break;
        case 5:
          (m.set(0, 0, -1),
            (f[a + 0] = jl(m, c, `x`, `y`, i, e)),
            (f[a + 1] = 1 - jl(m, c, `y`, `x`, i, t)));
      }
  }
  static fromJSON(t) {
    return new e(t.width, t.height, t.depth, t.segments, t.radius);
  }
};
function mergeGeometries(e, t = !1) {
  let n = e[0].index !== null,
    r = new Set(Object.keys(e[0].attributes)),
    i = new Set(Object.keys(e[0].morphAttributes)),
    a = {},
    o = {},
    s = e[0].morphTargetsRelative,
    c = new pn(),
    l = 0;
  for (let u = 0; u < e.length; ++u) {
    let d = e[u],
      f = 0;
    if (n !== (d.index !== null))
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
            u +
            `. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`,
        ),
        null
      );
    for (let e in d.attributes) {
      if (!r.has(e))
        return (
          console.error(
            `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
              u +
              `. All geometries must have compatible attributes; make sure "` +
              e +
              `" attribute exists among all geometries, or in none of them.`,
          ),
          null
        );
      (a[e] === void 0 && (a[e] = []), a[e].push(d.attributes[e]), f++);
    }
    if (f !== r.size)
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
            u +
            `. Make sure all geometries have the same number of attributes.`,
        ),
        null
      );
    if (s !== d.morphTargetsRelative)
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
            u +
            `. .morphTargetsRelative must be consistent throughout all geometries.`,
        ),
        null
      );
    for (let e in d.morphAttributes) {
      if (!i.has(e))
        return (
          console.error(
            `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
              u +
              `.  .morphAttributes must be consistent throughout all geometries.`,
          ),
          null
        );
      (o[e] === void 0 && (o[e] = []), o[e].push(d.morphAttributes[e]));
    }
    if (t) {
      let e;
      if (n) e = d.index.count;
      else if (d.attributes.position !== void 0)
        e = d.attributes.position.count;
      else
        return (
          console.error(
            `THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index ` +
              u +
              `. The geometry must have either an index or a position attribute`,
          ),
          null
        );
      (c.addGroup(l, e, u), (l += e));
    }
  }
  if (n) {
    let t = 0,
      n = [];
    for (let r = 0; r < e.length; ++r) {
      let i = e[r].index;
      for (let e = 0; e < i.count; ++e) n.push(i.getX(e) + t);
      t += e[r].attributes.position.count;
    }
    c.setIndex(n);
  }
  for (let e in a) {
    let t = mergeAttributes(a[e]);
    if (!t)
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ` +
            e +
            ` attribute.`,
        ),
        null
      );
    c.setAttribute(e, t);
  }
  for (let e in o) {
    let t = o[e][0].length;
    if (t !== 0) {
      ((c.morphAttributes = c.morphAttributes || {}),
        (c.morphAttributes[e] = []));
      for (let n = 0; n < t; ++n) {
        let t = [];
        for (let r = 0; r < o[e].length; ++r) t.push(o[e][r][n]);
        let r = mergeAttributes(t);
        if (!r)
          return (
            console.error(
              `THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the ` +
                e +
                ` morphAttribute.`,
            ),
            null
          );
        c.morphAttributes[e].push(r);
      }
    }
  }
  return c;
}
function mergeAttributes(e) {
  let t,
    n,
    r,
    i = -1,
    a = 0;
  for (let o = 0; o < e.length; ++o) {
    let s = e[o];
    if ((t === void 0 && (t = s.array.constructor), t !== s.array.constructor))
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`,
        ),
        null
      );
    if ((n === void 0 && (n = s.itemSize), n !== s.itemSize))
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`,
        ),
        null
      );
    if ((r === void 0 && (r = s.normalized), r !== s.normalized))
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`,
        ),
        null
      );
    if ((i === -1 && (i = s.gpuType), i !== s.gpuType))
      return (
        console.error(
          `THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`,
        ),
        null
      );
    a += s.count * n;
  }
  let o = new t(a),
    s = new Zt(o, n, r),
    c = 0;
  for (let t = 0; t < e.length; ++t) {
    let r = e[t];
    if (r.isInterleavedBufferAttribute) {
      let e = c / n;
      for (let t = 0, i = r.count; t < i; t++)
        for (let i = 0; i < n; i++) {
          let n = r.getComponent(t, i);
          s.setComponent(t + e, i, n);
        }
    } else o.set(r.array, c);
    c += r.count * n;
  }
  return (i !== void 0 && (s.gpuType = i), s);
}
var tileIndex = (e, t) => t * 44 + e,
  isInBounds = (e, t) => e >= 0 && t >= 0 && e < 44 && t < 44,
  CARDINAL_DIRECTIONS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ],
  TILE_SIZE = 32,
  AO_TILE_SIZE = 16,
  instanceMatrix = new Re(),
  instancePosition = new H(),
  instanceQuaternion = new _e(),
  instanceScale = new H(),
  instanceEuler = new Ke(),
  instanceColor = new J(),
  zeroInstanceMatrix = new Re().makeScale(0, 0, 0);
function addHeightColors(e, t = 0.6, n = 1) {
  e.computeBoundingBox();
  let { min: r, max: i } = e.boundingBox,
    a = e.attributes.position,
    o = new Float32Array(a.count * 3);
  for (let e = 0; e < a.count; e++) {
    let s = $c((a.getY(e) - r.y) / (i.y - r.y || 1), 0, 1),
      c = t + (1 - t) * s ** +n;
    o[e * 3] = o[e * 3 + 1] = o[e * 3 + 2] = c;
  }
  return (e.setAttribute(`color`, new Zt(o, 3)), e);
}
function createCrateTexture() {
  let e = al(128, 128),
    t = e.getContext(`2d`);
  ((t.fillStyle = `#b07a3c`), t.fillRect(0, 0, 128, 128));
  for (let e = 0; e < 4; e++)
    ((t.fillStyle = e % 2 ? `#a9743a` : `#b98446`),
      t.fillRect(0, e * 32, 128, 31),
      (t.fillStyle = `rgba(60,35,12,0.55)`),
      t.fillRect(0, e * 32 + 30, 128, 2));
  ((t.strokeStyle = `#7a4d20`),
    (t.lineWidth = 14),
    t.strokeRect(7, 7, 114, 114),
    (t.lineWidth = 12),
    t.beginPath(),
    t.moveTo(10, 10),
    t.lineTo(118, 118),
    t.stroke(),
    (t.fillStyle = `#4a3014`));
  for (let [e, n] of [
    [14, 14],
    [114, 14],
    [14, 114],
    [114, 114],
  ])
    (t.beginPath(), t.arc(e, n, 3.5, 0, 7), t.fill());
  let n = new cr(e);
  return ((n.colorSpace = k), (n.anisotropy = 4), n);
}
function createBarrelTexture() {
  let e = al(128, 64),
    t = e.getContext(`2d`);
  for (let e = 0; e < 8; e++)
    ((t.fillStyle = e % 2 ? `#9a5f2e` : `#a86a34`),
      t.fillRect(e * 16, 0, 16, 64),
      (t.fillStyle = `rgba(50,28,10,0.5)`),
      t.fillRect(e * 16 + 15, 0, 1.5, 64));
  ((t.fillStyle = `#4c4f58`),
    t.fillRect(0, 9, 128, 7),
    t.fillRect(0, 48, 128, 7));
  let n = new cr(e);
  return ((n.colorSpace = k), n);
}
function createNormalTexture() {
  let t = al(256, 256),
    n = t.getContext(`2d`),
    r = n.createImageData(256, 256),
    i = [
      [1, 2, 0, 1],
      [3, -1, 1.3, 0.6],
      [-2, 3, 2.1, 0.5],
      [5, 2, 0.7, 0.28],
      [-4, -5, 4, 0.22],
      [7, -3, 2.9, 0.14],
    ],
    a = (e, t) => {
      let n = 0;
      for (let [r, a, o, s] of i)
        n += Math.sin(((e * r + t * a) / 256) * Math.PI * 2 + o) * s;
      return n;
    };
  for (let e = 0; e < 256; e++)
    for (let t = 0; t < 256; t++) {
      let n = (a(t + 1, e) - a(t - 1, e)) * 3.2,
        i = (a(t, e + 1) - a(t, e - 1)) * 3.2,
        o = 1 / Math.hypot(n, i, 1),
        s = (e * 256 + t) * 4;
      ((r.data[s] = (-n * o * 0.5 + 0.5) * 255),
        (r.data[s + 1] = (-i * o * 0.5 + 0.5) * 255),
        (r.data[s + 2] = (o * 0.5 + 0.5) * 255),
        (r.data[s + 3] = 255));
    }
  n.putImageData(r, 0, 0);
  let o = new cr(t);
  return ((o.wrapS = o.wrapT = e), o.repeat.set(44 / 5, 44 / 5), o);
}

export {
  $c,
  AO_TILE_SIZE,
  Ac,
  Al,
  BOT_NAMES,
  BRAWLER_DEFS,
  CARDINAL_DIRECTIONS,
  COLLISION_RADIUS,
  Cl,
  DIFFICULTIES,
  Dl,
  El,
  Fe,
  GAME_CONFIG,
  GRADE_SHADER,
  H,
  Hi,
  J,
  Ke,
  LAMP_CONFIG,
  Ln,
  Mc,
  N,
  Ne,
  Nr,
  Ol,
  PCSS_SHADOW_CHUNK,
  Pc,
  Q,
  QUALITY_PRESETS,
  Qc,
  Re,
  RenderPipeline,
  RoundedBoxGeometry,
  SANITIZE_SHADER,
  Si,
  Sl,
  Sr,
  T,
  TILE_SIZE,
  TerrainStyle,
  TileType,
  Tl,
  Tn,
  V,
  Y,
  Yn,
  Zt,
  _,
  _e,
  _i,
  _l,
  _n,
  a,
  addHeightColors,
  al,
  ao,
  ar,
  b,
  bc,
  bl,
  br,
  c,
  cl,
  cr,
  createBarrelTexture,
  createCrateTexture,
  createNormalTexture,
  d,
  dl,
  e,
  el,
  en,
  f,
  findVsmShadowBlock,
  fl,
  fr,
  g,
  ga,
  gc,
  gl,
  gr,
  h,
  hi,
  hl,
  hr,
  i,
  identity,
  il,
  installPcssShadowPatch,
  instanceColor,
  instanceEuler,
  instanceMatrix,
  instancePosition,
  instanceQuaternion,
  instanceScale,
  isInBounds,
  jl,
  jr,
  k,
  kl,
  l,
  ll,
  m,
  mergeAttributes,
  mergeGeometries,
  ml,
  mr,
  n,
  nl,
  o,
  ol,
  on,
  p,
  patchSpotAttenuation,
  pcssPatchState,
  pl,
  pn,
  pr,
  q,
  r,
  ri,
  rl,
  s,
  sl,
  t,
  tileIndex,
  tl,
  u,
  uc,
  ul,
  ut,
  v,
  vl,
  vr,
  vt,
  w,
  wl,
  x,
  xl,
  xr,
  y,
  yc,
  yi,
  yl,
  yr,
  z,
  zeroInstanceMatrix,
};
