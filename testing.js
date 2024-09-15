waitless.scripts.push(
    {
        src: '', 
        location: 'body', 
        callback: customScriptLoaded 
    }
);

function customScriptLoaded() {
    console.log('Custom script callback triggered.');
    
    // Test if jQuery is available
    if (typeof jQuery !== 'undefined') {
        console.log('jQuery is loaded.');
        jQuery(function() {
            console.log('jQuery DOM ready.');
            // Simple log to check if we reach this point
        });
    } else {
        console.log('jQuery is not loaded.');
    }
}
