/* Brikito site tracking — loaded on every page.
   Meta Pixel: page views on all pages + "Lead" when the demo form is submitted (sent from book-a-demo.html).
   Google Analytics: paste the GA4 Measurement ID (G-XXXXXXX) below to switch it on. */
(function () {
  var META_PIXEL_ID = '1852191499896647';
  var GA_MEASUREMENT_ID = ''; // e.g. 'G-ABC123XYZ'

  // Meta Pixel
  if (META_PIXEL_ID && !window.fbq) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
  }

  // Google Analytics 4
  if (GA_MEASUREMENT_ID && !window.gtag) {
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
  }

  // Count clicks on any "Book a demo" button as interest (Meta: ViewContent-style custom event)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="book-a-demo"]');
    if (!a) return;
    if (window.fbq) fbq('trackCustom', 'BookDemoClick');
    if (window.gtag) gtag('event', 'book_demo_click');
  });
})();
