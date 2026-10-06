(() => {
    'use strict';

    // Change these two values when copying this file to another site.
    const liveHostname = 'behave.rblnk.xyz';
    const analyticsToken = 'fa8f8c5c296a492f874f1be118456152';

    // Local development, file previews, and staging hosts do not send analytics.
    const isLive =
        window.location.protocol === 'https:' &&
        window.location.hostname === liveHostname;

    if (!isLive) {
        return;
    }

    const beacon = document.createElement('script');
    beacon.type = 'module';
    beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    beacon.setAttribute(
        'data-cf-beacon',
        JSON.stringify({ token: analyticsToken })
    );

    document.head.appendChild(beacon);
})();
