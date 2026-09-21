import { useEffect } from "react";
import { startGame } from "./engine";
import "./game.css";

export function SundownShowdown() {
  useEffect(() => {
    const game = startGame({}) as { dispose: () => void };
    return () => {
      game.dispose();
      delete (window as Window & { __game?: unknown }).__game;
    };
  }, []);

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#0b0e1a]">
      <canvas id="game" />

      <div id="hud" className="hidden">
        <div id="gas-warn" />
        <div id="hurt" />
        <div id="overheads" />
        <div id="floaters" />
        <div id="feed" />
        <div id="topbar">
          <div className="pill" id="left-count">
            BRAWLERS LEFT <b>8</b>
          </div>
          <div className="pill" id="clock">
            15:24
          </div>
        </div>
        <div id="banner" className="outline" />
        <div id="hints">
          <kbd>W</kbd>
          <kbd>A</kbd>
          <kbd>S</kbd>
          <kbd>D</kbd> move &nbsp;
          <kbd>Mouse</kbd> aim &nbsp; <kbd>Click</kbd> shoot
          <br />
          <kbd>Space</kbd> / <kbd>Right-click</kbd> hold to aim super, release
          to fire
          <br />
          <kbd>T</kbd> time of day &nbsp; <kbd>P</kbd> pause &nbsp; <kbd>M</kbd>{" "}
          mute
        </div>
        <div id="sticks">
          <div className="stick" id="stick-move">
            <i />
            <b>MOVE</b>
          </div>
          <div className="stick" id="stick-aim">
            <i />
            <b>DRAG TO AIM &middot; TAP TO AUTO-AIM</b>
          </div>
        </div>
        <div id="super">
          <div className="core" id="super-core">
            SUPER
          </div>
        </div>
      </div>

      <button id="gear" title="Lighting &amp; graphics">
        &#9881;
      </button>
      <div id="settings">
        <h3>Settings</h3>
        <h4>BOTS</h4>
        <div className="seg" id="difficulty-seg" />
        <h4>QUALITY</h4>
        <div className="seg" id="quality-seg" />
        <h4>TIME OF DAY</h4>
        <div className="row">
          <label htmlFor="auto-time">
            Follow the match (afternoon &rarr; night)
          </label>
          <input type="checkbox" id="auto-time" defaultChecked />
        </div>
        <div className="row">
          <span id="time-label">15:24</span>
          <input
            type="range"
            id="time-slider"
            min="0"
            max="24"
            step="0.05"
            defaultValue="15.4"
          />
        </div>
        <div className="tip">
          Drag to scrub the sun. Press <kbd>T</kbd> in game to jump between
          noon, golden hour, dusk and night.
        </div>
        <h4>EFFECTS</h4>
        <div className="row">
          <label htmlFor="tog-ao">Ambient occlusion (GTAO)</label>
          <input type="checkbox" id="tog-ao" defaultChecked />
        </div>
        <div className="row">
          <label htmlFor="tog-bloom">Bloom</label>
          <input type="checkbox" id="tog-bloom" defaultChecked />
        </div>
        <div className="row">
          <label htmlFor="tog-mute">
            Mute sound (<kbd>M</kbd>)
          </label>
          <input type="checkbox" id="tog-mute" />
        </div>
        <div id="stats" />
      </div>

      <div id="menu" className="screen">
        <h1 id="title">
          SUNDOWN<span>SHOWDOWN</span>
        </h1>
        <div id="tagline">
          Last brawler standing. The sun sets as the gas closes in.
        </div>
        <div id="cards" />
        <button className="big-btn" id="play">
          PLAY
        </button>
        <div id="menu-hint">
          <span className="for-keys">
            Open <kbd>&#9881;</kbd> to scrub the time of day and tune shadows
          </span>
          <span className="for-touch">
            Left thumb moves &middot; right thumb drags to aim, release to fire
            &middot; tap to auto-aim
          </span>
        </div>
      </div>

      <div id="result" className="screen">
        <h1 id="result-title">VICTORY!</h1>
        <div id="result-rank" className="outline" />
        <div id="result-stats" />
        <button className="big-btn" id="again">
          PLAY AGAIN
        </button>
        <button className="ghost-btn" id="to-menu">
          CHANGE BRAWLER
        </button>
      </div>

      <div id="toast" />
      <div id="loading">Lighting the lamps&hellip;</div>
    </main>
  );
}
