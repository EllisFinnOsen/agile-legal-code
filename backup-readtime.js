<div class="tag-list" id="tags-{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}"></div>

<script>
window.addEventListener('DOMContentLoaded', function() {
    jQuery(function() {
        setTimeout(function() {
            var tagListSelector = '#tags-{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}';
            var pageSlug = "{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}";

            // Load the dynamic content into the specific tag-list
            jQuery(tagListSelector).load("/business-law-news/" + pageSlug + " .copytag-list-lite", function() {
                var staticTagItems = jQuery(this).closest('.w-dyn-item').find('.copytag-list-lite').not('.w-dyn-items').first().children('.tag-item');

                if (staticTagItems.length > 0) {
                    jQuery(this).find('.copytag-list-lite.w-dyn-items').prepend(staticTagItems);
                }

                jQuery(this).closest('.w-dyn-item').find('.copytag-list-lite').not('.w-dyn-items').remove();

                // Trigger layout recalculation
                jQuery('.home-services-grid').css('height', 'auto'); // Reset the height to auto
            });
        }, 250);
    });
});
</script>







<div class="read-time"><div class="read-time-circle"><div class="read-time-text" id="time-{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}">5</div></div><div class="read-text">Min Read</div><img src="https://cdn.prod.website-files.com/66d8ae0d82991ca9e4fb3c31/66ddd550a528a79d9b10ddaa_Arrow.svg" loading="lazy" alt="" class="arrow"></div>



<script>
window.addEventListener('DOMContentLoaded', function() {
    jQuery(function() {
        // Set the average reading speed in words per minute
        var wordsPerMinute = 200;

        // Delay execution to ensure the page is fully loaded
        setTimeout(function() {
            // Get the slug of the current blog post from Webflow
            var slug = "{{wf {&quot;path&quot;:&quot;slug&quot;,&quot;type&quot;:&quot;PlainText&quot;\} }}";
            var blogBodyUrl = '/business-law-news/' + slug;

            // Use AJAX to load the blog post content
            jQuery.ajax({
                url: blogBodyUrl,
                success: function(response) {
                    

                    // Extract the content inside the .blog-body-richtext class
                    var blogText = jQuery('<div>').html(response).find('.blog-body-richtext').text().trim();

                    // Log the blog post text to check if it’s being loaded correctly
                    //console.log('Blog text:', blogText);

                    // Check if any content is found
                    if (blogText.length > 0) {
                        // Count the number of words
                        var wordCount = blogText.split(/\s+/).length;

                        // Log the word count for debugging
                        //console.log('Word count:', wordCount);

                        // Calculate the reading time in minutes (rounded)
                        var readTime = Math.ceil(wordCount / wordsPerMinute);

                        // Log the calculated reading time
                        //console.log('Read time (minutes):', readTime);

                        // Update the text of the element with ID time-{slug} with the calculated reading time
                        jQuery('#time-' + slug).text(readTime);

                    } else {
                        //console.log('No content found in .blog-body-richtext for slug:', slug);
                    }
                },
                error: function() {
                    //console.error('Failed to load blog post content from:', blogBodyUrl);
                }
            });
        }, 250); // Optional delay to ensure the content is loaded properly
    });
});
</script>