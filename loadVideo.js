function manageBackgroundVideo() {
    var desktopVideoWrapper = document.getElementById("desktop-goes-here");
    var mobileVideoWrapper = document.getElementById("mobile-goes-here");
    var viewportWidth = window.innerWidth;
  
    // Remove any existing video and log the action
    function clearVideo(wrapper, wrapperName) {
      var videoElement = wrapper.querySelector("video");
      if (videoElement) {
        wrapper.innerHTML = ""; // Remove the video to reduce load
        console.log(`${wrapperName} video cleared.`);
      }
    }
  
    // Add video if not already present and log the action
    function loadDesktopVideo() {
      if (!desktopVideoWrapper.querySelector("video")) {
        desktopVideoWrapper.innerHTML = `
                  <video autoplay loop muted playsinline style="background-image:url('https://cdn.prod.website-files.com/66d8ae0d82991ca9e4fb3c31%2F66e602a1965fc589ef0d9b5a_Landscape%20Agile%20Legal-poster-00001.jpg')" data-object-fit="cover">
                      <source src="https://cdn.prod.website-files.com/66d8ae0d82991ca9e4fb3c31%2F66e602a1965fc589ef0d9b5a_Landscape%20Agile%20Legal-transcode.mp4" type="video/mp4">
                      <source src="https://cdn.prod.website-files.com/66d8ae0d82991ca9e4fb3c31%2F66e602a1965fc589ef0d9b5a_Landscape%20Agile%20Legal-transcode.webm" type="video/webm">
                  </video>`;
        console.log("Desktop video loaded.");
      }
    }
  
    function loadMobileVideo() {
      if (!mobileVideoWrapper.querySelector("video")) {
        mobileVideoWrapper.innerHTML = `
                  <video autoplay loop muted playsinline style="background-image:url('https://cdn.prod.website-files.com/66d8ae0d82991ca9e4fb3c31%2F66e602f236084642bf0cfd16_Portrait%20Agile%20Legal-poster-00001.jpg')" data-object-fit="cover">
                      <source src="https://cdn.prod.website-files.com/66d8ae0d82991ca9e4fb3c31%2F66e602f236084642bf0cfd16_Portrait%20Agile%20Legal-transcode.mp4" type="video/mp4">
                      <source src="https://cdn.prod.website-files.com/66d8ae0d82991ca9e4fb3c31%2F66e602f236084642bf0cfd16_Portrait%20Agile%20Legal-transcode.webm" type="video/webm">
                  </video>`;
        console.log("Mobile video loaded.");
      }
    }
  
    // Log viewport width
    console.log(`Viewport width: ${viewportWidth}`);
  
    // Handle which video to load based on screen size
    if (viewportWidth > 767) {
      // Desktop and larger
      loadDesktopVideo();
      clearVideo(mobileVideoWrapper, "Mobile");
    } else {
      // Mobile and smaller
      loadMobileVideo();
      clearVideo(desktopVideoWrapper, "Desktop");
    }
  }
  
  // Trigger on page load and window resize
  window.addEventListener("load", manageBackgroundVideo);
  window.addEventListener("resize", manageBackgroundVideo);
  