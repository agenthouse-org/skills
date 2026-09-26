/* Seekable stage clock. Story motion reads --e, --m, --x, --p, and --t. */
(function () {
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function mount() {
    const stage = document.querySelector("#stage");
    if (!stage) throw new Error("motion-ad: #stage missing");

    const duration = Number(stage.dataset.duration);
    const width = Number(stage.dataset.w || 1920);
    const height = Number(stage.dataset.h || 1080);
    const beats = [...stage.querySelectorAll(".beat")].map((el) => ({
      el,
      start: Number(el.dataset.in),
      end: Number(el.dataset.out),
      enter: Number(el.dataset.enter || 0.7),
      exit: Number(el.dataset.exit || 0.35),
      hold: el.dataset.hold === "1",
    }));

    stage.querySelectorAll(".stagger").forEach((group) => {
      const step = Number(group.dataset.step || 0.12);
      [...group.children].forEach((child, index) => {
        if (!child.style.getPropertyValue("--d")) {
          child.style.setProperty("--d", String(index * step));
        }
      });
    });

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const viewport = document.getElementById("viewport");
    const bar = document.getElementById("bar");
    const scrub = document.getElementById("scrub");
    const readout = document.getElementById("readout");
    const toggle = document.getElementById("toggle");
    const present = new URLSearchParams(location.search).has("present");
    if (present && bar) bar.hidden = true;

    let time = 0;
    let playing = false;
    let last = 0;

    function fit() {
      const chrome = bar && !bar.hidden ? bar.offsetHeight : 0;
      const scale = Math.min(window.innerWidth / width, Math.max(1, window.innerHeight - chrome) / height);
      if (viewport) {
        viewport.style.width = width * scale + "px";
        viewport.style.height = height * scale + "px";
      }
      stage.style.width = width + "px";
      stage.style.height = height + "px";
      stage.style.transform = "scale(" + scale + ")";
    }

    function overflows(el) {
      if (el.scrollWidth > el.clientWidth + 1) return true;
      return [...el.querySelectorAll(".ln")].some((line) => line.scrollWidth > line.clientWidth + 1);
    }

    function fitText() {
      stage.querySelectorAll("[data-fit]").forEach((el) => {
        el.style.fontSize = "";
        const base = parseFloat(getComputedStyle(el).fontSize);
        const min = base * (Number(el.dataset.fit) || 0.6);
        let size = base;
        while (size > min && overflows(el)) {
          size -= 1;
          el.style.fontSize = size + "px";
        }
        el.toggleAttribute("data-fit-overflow", overflows(el));
      });
    }

    function setToggle() {
      if (!toggle) return;
      toggle.textContent = playing ? "Pause" : "Play";
    }

    function apply(next) {
      time = clamp(next, 0, duration);
      stage.style.setProperty("--t", (duration ? time / duration : 0).toFixed(4));
      for (const beat of beats) {
        const holds = beat.hold || beat.end >= duration - 0.001;
        const visible = holds
          ? time >= beat.start && time <= duration
          : time >= beat.start && time < beat.end;
        const enterRaw = clamp((time - beat.start) / beat.enter, 0, 1);
        const exitRaw = holds ? 0 : clamp((time - (beat.end - beat.exit)) / beat.exit, 0, 1);
        const span = Math.max(0.001, beat.end - beat.start);
        beat.el.classList.toggle("on", visible);
        beat.el.style.setProperty("--e", easeOutCubic(enterRaw).toFixed(4));
        beat.el.style.setProperty("--m", easeOutBack(enterRaw).toFixed(4));
        beat.el.style.setProperty("--x", easeOutCubic(exitRaw).toFixed(4));
        beat.el.style.setProperty("--p", clamp((time - beat.start) / span, 0, 1).toFixed(4));
      }
      if (scrub && document.activeElement !== scrub) scrub.value = String(time);
      if (readout) readout.textContent = time.toFixed(1) + "s";
    }

    function frame(now) {
      if (!playing) return;
      if (!last) last = now;
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (time + delta >= duration) {
        apply(duration);
        playing = false;
        setToggle();
        return;
      }
      apply(time + delta);
      requestAnimationFrame(frame);
    }

    function play() {
      if (time >= duration - 0.001) time = 0;
      playing = true;
      last = 0;
      setToggle();
      requestAnimationFrame(frame);
    }

    function pause() {
      playing = false;
      setToggle();
    }

    function seek(value) {
      pause();
      apply(Number(value) || 0);
    }

    window.addEventListener("resize", fit);
    if (scrub) {
      scrub.max = String(duration);
      scrub.step = "0.01";
      scrub.addEventListener("input", () => seek(scrub.value));
    }
    document.getElementById("replay")?.addEventListener("click", () => {
      seek(0);
      play();
    });
    toggle?.addEventListener("click", () => {
      if (playing) pause();
      else play();
    });
    window.addEventListener("keydown", (event) => {
      if (event.target && event.target.matches("input, textarea")) return;
      if (event.code === "Space") {
        event.preventDefault();
        if (playing) pause();
        else play();
      } else if (event.key === "r" || event.key === "R") {
        seek(0);
        play();
      }
    });

    fit();
    fitText();
    const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const fitted = fonts.then(() => {
      fit();
      fitText();
      apply(time);
    });
    if (reduce) {
      document.documentElement.classList.add("reduce-motion");
      apply(Math.max(0, duration - 0.05));
      pause();
    } else {
      apply(0);
      play();
    }

    window.ad = {
      duration,
      seek,
      play,
      pause,
      getTime: () => time,
      fitted,
      ready: true,
    };
    return window.ad;
  }

  window.MotionAd = { mount };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
