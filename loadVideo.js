function delayedLoadVideo() {
    var desktopWrapper = document.getElementById('desktop-goes-here');
    var mobileWrapper = document.getElementById('mobile-goes-here');
    var viewportWidth = window.innerWidth;

    // Function to load the desktop video
    function loadDesktopVideo() {
        if (!desktopWrapper.innerHTML) {
            desktopWrapper.innerHTML = '<iframe src="https://player.vimeo.com/video/1009508858?background=1&amp;quality=1080p" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen=""></iframe>';
        }
    }

    // Function to load the mobile video
    function loadMobileVideo() {
        if (!mobileWrapper.innerHTML) {
            mobileWrapper.innerHTML = '<iframe src="https://player.vimeo.com/video/1009508905?background=1&amp;quality=1080p" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen=""></iframe>';
        }
    }

    // Delay loading by 5 seconds
    setTimeout(function() {
        if (viewportWidth > 767) {
            loadDesktopVideo();
        } else {
            loadMobileVideo();
        }
    }, 2250); // 5-second delay
}

window.addEventListener('load', delayedLoadVideo);