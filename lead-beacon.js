/* Lead capture to Make, alongside Formspree. Fire-and-forget: it can never
   block or break a submission, and it carries the UTM that Formspree never sees. */
(function () {
  var HOOK = 'https://hook.us2.make.com/tccqwnheihsq4mh9if0lwd1w8wxtqwux';
  document.addEventListener('submit', function (e) {
    try {
      var f = e.target; if (!f || f.tagName !== 'FORM') return;
      var d = {};
      new FormData(f).forEach(function (v, k) { if (k.charAt(0) !== '_') d[k] = v; });
      d.name = d.name || ((d.first || '') + ' ' + (d.last || '')).trim();
      d.source = d.magnet || d.type || '';
      var q = new URLSearchParams(location.search);
      d.page = location.pathname;
      d.utm_source = q.get('utm_source') || '';
      d.utm_medium = q.get('utm_medium') || '';
      d.utm_campaign = q.get('utm_campaign') || '';
      d.utm_content = q.get('utm_content') || '';
      d.referrer = document.referrer || '';
      d.received = new Date().toISOString();
      d.completeness = (d.phone && d.email) ? 'Full'
        : (d.phone || d.email) ? 'Partial' : 'Email only';
      var body = JSON.stringify(d);
      if (navigator.sendBeacon) navigator.sendBeacon(HOOK, new Blob([body], { type: 'text/plain' }));
      else fetch(HOOK, { method: 'POST', mode: 'no-cors', body: body }).catch(function () {});
    } catch (err) { /* never let capture break a submission */ }
  }, true);
})();
