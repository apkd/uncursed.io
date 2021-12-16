/// <reference path="../node_modules/bootstrap/dist/js/bootstrap.js" />

const n = navigator as any;
let lowPerfDevice = false;
lowPerfDevice ||= n.deviceMemory !== undefined && n.deviceMemory < 2;
lowPerfDevice ||= n.hardwareConcurrency !== undefined && n.hardwareConcurrency < 2;
lowPerfDevice ||= "connection" in n && n.connection.saveData === true;
lowPerfDevice ||= "connection" in n && (n.connection.effectiveType === "slow-2g" || n.connection.effectiveType === "2g");

window.addEventListener("DOMContentLoaded", () => {
    const navbarClassList = document.body.querySelector("#mainNav").classList;
    const animateLogoElements = document.body.querySelectorAll<HTMLElement>(".animate-logo");
    let navbarLowered = null;

    const lowerNavbar = function () {
        console.log(`${window.scrollY} ${window.innerHeight}`);
        if ((navbarLowered === null || navbarLowered) && window.scrollY < window.innerHeight) {
            for (const el of animateLogoElements)
                el.classList.add("animate-logo")
            navbarLowered = false;
            navbarClassList.remove("navbar-shrink");
        } else if ((navbarLowered === null || !navbarLowered) && window.scrollY > window.innerHeight) {
            for (const el of animateLogoElements)
                el.classList.remove("animate-logo");
            navbarLowered = true;
            navbarClassList.add("navbar-shrink");
        }
    };

    lowerNavbar();
    document.addEventListener("scroll", lowerNavbar);

    // @ts-ignore
    new bootstrap.ScrollSpy(document.body, {
        target: "#mainNav",
        offset: 500,
    });

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector(".navbar-toggler");
    const navbarResponsive = document.body.querySelector("#navbarResponsive");
    const responsiveNavLinks = [].slice.call(document.querySelectorAll("#navbarResponsive .nav-link"));

    responsiveNavLinks.map(responsiveNavItem => {
        responsiveNavItem.addEventListener("click", () => {
            if (window.getComputedStyle(navbarToggler).display !== "none") {
                navbarToggler.classList.add("collapsed");
                navbarResponsive.classList.add("collapse");
                navbarResponsive.classList.remove("show");
            }
        });
    });
    const pingPong = [].slice.call(document.querySelectorAll(".ping-pong"));

    pingPong.map((x: HTMLMediaElement) => {
        x.addEventListener("ended", () => {
            x.playbackRate = -1;
        });
        x.addEventListener("timeupdate", () => {
            if (x.currentTime === 0)
                x.playbackRate = 1;
        });
    })

    for (const el of animateLogoElements)
        el.style.animationPlayState = "running";

    if (lowPerfDevice) {
        document.body.querySelector<HTMLIFrameElement>("#discord-parent").remove();
    }
});

let loaded = false;

function TryLoadDiscord() {
    if (loaded)
        return;

    if (window.scrollY < window.innerHeight)
        return;

    loaded = true;

    document.body.querySelector<HTMLIFrameElement>("#discord").src
        = "https://e.widgetbot.io/channels/909475206190497823/909475206723170348";
}

if (!lowPerfDevice) {
    window.addEventListener("load", () => {
        TryLoadDiscord();

        if (!loaded) {
            window.addEventListener("scroll", TryLoadDiscord);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

    function loadVideo(video) {
        for (const source in video.children) {
            const videoSource = video.children[source] as HTMLVideoElement;
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                videoSource.src = videoSource.dataset.src;
            }
        }
        video.load();
        video.classList.remove("lazy");
    }

    if ("IntersectionObserver" in window) {
        const lazyVideoObserver = new IntersectionObserver(
            (entries, observer) => entries
                .filter(x => x.isIntersecting)
                .forEach(video => {
                    const target = video.target;
                    observer.unobserve(target);
                    return loadVideo(target);
                }),
            {rootMargin: '50px'}
        );

        lazyVideos.forEach(video => lazyVideoObserver.observe(video));
    } else {
        lazyVideos.forEach(x => loadVideo(x));
    }
});
