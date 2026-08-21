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

    const videoMedias = Array.from(document.querySelectorAll(".media[data-video-src]"));
    const animatedImageMedias = Array.from(document.querySelectorAll(".media[data-animated-src]"));

    function showMedia(media, element) {
        element.classList.add("loaded");
        media.classList.add("media-ready");
    }

    function loadVideo(media) {
        if (media.dataset.mediaLoading) return;
        media.dataset.mediaLoading = "true";

        const thumb = media.querySelector(".media-thumb");
        if (thumb) loadThumb(thumb);

        const video = document.createElement("video");
        video.className = "auto-media";
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.addEventListener("canplay", () => {
            showMedia(media, video);
            if (!document.hidden) video.play().catch(() => {});
        }, { once: true });
        video.src = media.dataset.videoSrc;
        media.append(video);
        video.load();
    }

    function loadAnimatedImage(media) {
        if (media.dataset.mediaLoading) return;
        media.dataset.mediaLoading = "true";

        const thumb = media.querySelector(".media-thumb");
        if (thumb) loadThumb(thumb);

        const image = document.createElement("img");
        image.className = "auto-media";
        image.alt = thumb ? thumb.alt : "";
        image.addEventListener("load", () => showMedia(media, image), { once: true });
        image.addEventListener("error", () => image.remove(), { once: true });
        image.src = media.dataset.animatedSrc;
        media.append(image);
    }

    function startMediaHydration() {
        videoMedias.forEach(loadVideo);
        animatedImageMedias.forEach(loadAnimatedImage);
    }

    function resumeReadyVideos() {
        videoMedias.forEach((media) => {
            const video = media.querySelector("video.auto-media");
            if (video && media.classList.contains("media-ready")) {
                video.play().catch(() => {});
            }
        });
    }

    function pauseReadyVideos() {
        videoMedias.forEach((media) => {
            const video = media.querySelector("video.auto-media");
            if (video) video.pause();
        });
    }

    function scheduleMediaHydration() {
        window.setTimeout(() => onIdle(startMediaHydration, { timeout: 1600 }), 700);
    }

    if (document.readyState === "complete") {
        scheduleMediaHydration();
    } else {
        window.addEventListener("load", scheduleMediaHydration, { once: true });
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            pauseReadyVideos();
        } else {
            resumeReadyVideos();
        }
    });

})();
