function getClickHandler(buttonid, url) {
  return function(e) {
    chrome.tabs.create({
      url: url,
      active: false,
    }, function() {
      chrome.storage.local.get('pages', function(pages) {
        console.log(pages);
        var index = pages.pages.indexOf(url);
        if (index != -1) {
          p = pages.pages;
          p.splice(index, 1);
          pages.pages = p;
        }
        chrome.storage.local.set(pages, function() {
          div = document.querySelector('#content');
          buttons = document.querySelectorAll('button');
          for (var i = 0; i < buttons.length; i++) {
            div.removeChild(buttons[i]);
          }
          breaks = document.querySelectorAll('br');
          for (var i = 0; i < breaks.length; i++) {
            div.removeChild(breaks[i]);
          }
          var id = 0;
          for (page in pages.pages) {
            var b = document.createElement("button");
            b.id = "button" + id;
            b.textContent = pages.pages[page];
            div.appendChild(b);
            b.addEventListener('click', getClickHandler("#button" + id, pages.pages[page]));
            div.appendChild(document.createElement("br"));
            id++;
          }
          //window.close();
        });
      });
    });
  }
}

chrome.tabs.getSelected(null, function(tab) {
  chrome.storage.local.get('pages', function(pages) {
    console.log(pages);
    if (pages.pages == undefined)
      pages.pages = [];
    if (tab.url != "chrome://newtab/") {
      if (pages.pages.indexOf(tab.url) == -1)
        pages.pages.push(tab.url);
      chrome.storage.local.set(pages, function() {
        chrome.tabs.remove(tab.id);
        window.close();
      });
    }
    else
    {
      var id = 0;
      div = document.querySelector('#content');
      for (page in pages.pages) {
        var b = document.createElement("button");
        b.id = "button" + id;
        b.textContent = pages.pages[page];
        div.appendChild(b);
        b.addEventListener('click', getClickHandler("#button" + id, pages.pages[page]));
        div.appendChild(document.createElement("br"));
        id++;
      }
    }
  });
});
