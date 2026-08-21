(function () {
    const body = document.body;
    const themeButton = document.getElementById("theme-toggle");
    const themeMeta = document.querySelector('meta[name="theme-color"]');

    function setTheme(theme) {
        const isLight = theme === "light";
        body.classList.toggle("light", isLight);
        if (themeButton) {
            themeButton.setAttribute("aria-pressed", String(isLight));
            themeButton.title = isLight ? "Темная тема" : "Светлая тема";
        }
        if (themeMeta) {
            themeMeta.setAttribute("content", isLight ? "#ffffff" : "#050505");
        }
    }

    const savedTheme = localStorage.getItem("theme");
    setTheme(savedTheme || "dark");

    if (themeButton) {
        themeButton.addEventListener("click", () => {
            const nextTheme = body.classList.contains("light") ? "dark" : "light";
            localStorage.setItem("theme", nextTheme);
            setTheme(nextTheme);
        });
    }

    function loadThumb(img) {
        if (!img || img.dataset.loaded) return;
        img.dataset.loaded = "true";
        img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
        img.src = img.dataset.thumbSrc;
    }

    function initLazyThumbs() {
        const thumbs = Array.from(document.querySelectorAll("img[data-thumb-src]"));
        if (!("IntersectionObserver" in window)) {
            thumbs.forEach(loadThumb);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);
                loadThumb(entry.target);
            });
        }, { rootMargin: "320px 0px" });

        thumbs.forEach((img) => observer.observe(img));
    }

    const onIdle = window.requestIdleCallback || ((callback) => setTimeout(callback, 350));
    onIdle(initLazyThumbs, { timeout: 1200 });

    const videoMedias = Array.from(document.querySelectorAll(".media[data-hover-video]"));

    function ensureHoverVideo(media) {
        let video = media.querySelector("video.hover-video");
        if (video) return video;

        const thumb = media.querySelector(".media-thumb");
        if (thumb) loadThumb(thumb);

        video = document.createElement("video");
        video.className = "hover-video";
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.src = media.dataset.hoverVideo;
        video.addEventListener("canplay", () => showVideo(media, video), { once: true });
        media.append(video);
        return video;
    }

    function showVideo(media, video) {
        video.classList.add("loaded");
        media.classList.add("video-ready");
        video.play().catch(() => {});
    }

    function playHoverVideo(media) {
        if (!media || !media.dataset.hoverVideo) return;
        const video = ensureHoverVideo(media);
        media.classList.add("hovering");
        if (video.readyState >= 3) showVideo(media, video);
        video.play().catch(() => {});
    }

    function pauseHoverVideo(media) {
        if (media && media.classList.contains("video-ready")) {
            media.classList.remove("hovering");
            return;
        }
        const video = media && media.querySelector("video.hover-video");
        if (!video) return;
        video.pause();
        video.currentTime = 0;
        media.classList.remove("hovering");
    }

    function startVideoHydration() {
        videoMedias.forEach((media) => {
            const video = ensureHoverVideo(media);
            if (video.readyState >= 3) showVideo(media, video);
            else video.load();
        });
    }

    function resumeReadyVideos() {
        videoMedias.forEach((media) => {
            const video = media.querySelector("video.hover-video");
            if (video && media.classList.contains("video-ready")) {
                video.play().catch(() => {});
            }
        });
    }

    function pauseReadyVideos() {
        videoMedias.forEach((media) => {
            const video = media.querySelector("video.hover-video");
            if (video) video.pause();
        });
    }

    function scheduleVideoHydration() {
        window.setTimeout(() => onIdle(startVideoHydration, { timeout: 1600 }), 700);
    }

    if (document.readyState === "complete") {
        scheduleVideoHydration();
    } else {
        window.addEventListener("load", scheduleVideoHydration, { once: true });
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            pauseReadyVideos();
        } else {
            resumeReadyVideos();
        }
    });

    videoMedias.forEach((media) => {
        media.addEventListener("pointerenter", () => playHoverVideo(media));
        media.addEventListener("pointerleave", () => pauseHoverVideo(media));
        media.addEventListener("mouseenter", () => playHoverVideo(media));
        media.addEventListener("mouseleave", () => pauseHoverVideo(media));
        media.addEventListener("mousemove", () => {
            if (!media.classList.contains("hovering")) playHoverVideo(media);
        });
        media.addEventListener("focus", () => playHoverVideo(media));
        media.addEventListener("blur", () => pauseHoverVideo(media));
    });

    document.addEventListener("click", (event) => {
        const button = event.target.closest("[data-load-media]");
        if (!button) return;

        const media = button.closest(".media");
        if (!media || media.dataset.fullLoaded) return;

        const src = media.dataset.fullSrc;
        const thumb = media.querySelector(".media-thumb");
        if (!src) return;

        media.dataset.fullLoaded = "true";
        button.remove();

        if (media.dataset.kind === "video") {
            const video = document.createElement("video");
            video.className = "loaded";
            video.controls = true;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.preload = "metadata";
            video.src = src;
            if (thumb) thumb.replaceWith(video);
            else media.append(video);
            video.play().catch(() => {});
            return;
        }

        const image = document.createElement("img");
        image.decoding = "async";
        image.alt = thumb ? thumb.alt : "";
        image.addEventListener("load", () => image.classList.add("loaded"), { once: true });
        image.src = src;
        if (thumb) thumb.replaceWith(image);
        else media.append(image);
    });
})();
