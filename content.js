const SN_FACEBOOK = 'facebook';
const SN_TWITTER = 'twitter';
const SEARCH_TERMS = [
  'pokemon','pokémon'
];

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse)
  {
    if(request.message === "clicked_browser_action")
    {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log(firstHref);

      // This line is new!
      chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
    }
  }
);

var hostname = window.location.hostname;
var social_networks = [
  SN_FACEBOOK,
  SN_TWITTER
];

function removeShit()
{
  var output = $('<div>', {'style': 'background: #eee; padding: 50px 20px;', 'class': 'js-unshit-parent'});
  var heading = $('<h1>', {'style': 'color: #bbb;', 'text': 'Pokemon No!'});

  output.append(heading);

  return output;
}

function facebookHidePost(searchTerm, parentSelector)
{
  $("[data-referrer] *").filter(
    function ()
    {
      var $this = $(this),
        str = $.trim($this.text().toLowerCase());

      if(str.length > 0 && $this.is(':visible'))
      {
        if(str.indexOf(searchTerm) > -1)
        {
          var $crap = $this.closest(parentSelector);
          $crap.css('border', '1px solid #f00');
          $this.closest(parentSelector).replaceWith(removeShit(parentSelector));
        }
      }
    }
  );
}

function twitterHidePost(searchTerm, parentSelector)
{
  $(".stream *").filter(
    function ()
    {
      var $this = $(this),
        str = $.trim($this.text().toLowerCase());

      if(str.length > 0 && $this.is(':visible'))
      {
        if(str.indexOf(searchTerm) > -1)
        {
          var $crap = $this.closest(parentSelector);
          $crap.css('border', '1px solid #f00');
          $this.closest(parentSelector).replaceWith(removeShit(parentSelector));
        }
      }
    }
  );
}

function checkPage()
{
  $(social_networks).each(
    function (key, value)
    {
      if(hostname.indexOf(value) > -1)
      {
        $(SEARCH_TERMS).each(
          function ()
          {
            switch(value)
            {
              case SN_FACEBOOK:
                console.log('facebook');
                facebookHidePost(this.toLowerCase(), '.userContentWrapper');
                break;
              case SN_TWITTER:
                console.log('twitter');
                twitterHidePost(this.toLowerCase(), '.js-stream-item');
                break;
            }
          }
        );
      }
    }
  );
}
checkPage();

function DOMModificationHandler()
{
  $(this).unbind('DOMSubtreeModified.event1');
  setTimeout(
    function ()
    {
      checkPage();

      $(document).on('DOMSubtreeModified.event1', DOMModificationHandler);
    }, 1000
  );
}

//after document-load
$(document).on('DOMSubtreeModified.event1', DOMModificationHandler);
