// Lightweight page event tracker (~2KB)
// Injected into published promotion pages
(function () {
  "use strict";

  var API_URL = "{{API_URL}}";
  var PAGE_ID = "{{PAGE_ID}}";

  var visitorId = getVisitorId();

  function getVisitorId() {
    var key = "_promo_vid";
    var id = localStorage.getItem(key);
    if (!id) {
      id =
        Math.random().toString(36).substring(2) +
        Date.now().toString(36);
      localStorage.setItem(key, id);
    }
    return id;
  }

  function sendEvent(eventType, eventData) {
    var payload = JSON.stringify({
      pageId: PAGE_ID,
      visitorId: visitorId,
      eventType: eventType,
      eventData: eventData || {},
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        API_URL + "/api/events",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", API_URL + "/api/events");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(payload);
    }
  }

  // Track pageview
  sendEvent("pageview");

  // Track clicks on links and buttons
  document.addEventListener("click", function (e) {
    var target = e.target.closest("a, button");
    if (!target) return;

    sendEvent("click", {
      tag: target.tagName.toLowerCase(),
      text: (target.textContent || "").trim().substring(0, 100),
      href: target.href || null,
    });
  });

  // Track max scroll depth
  var maxScroll = 0;
  var ticking = false;

  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        var scrollPercent = Math.round(
          ((window.scrollY + window.innerHeight) /
            document.documentElement.scrollHeight) *
            100
        );
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // Send scroll depth on page unload
  window.addEventListener("pagehide", function () {
    if (maxScroll > 0) {
      sendEvent("scroll", { maxDepth: maxScroll });
    }
  });
})();
