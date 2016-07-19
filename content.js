const SN_FACEBOOK = 'facebook';
const SN_TWITTER = 'twitter';
const SEARCH_TERMS = [
  'pokemon', 'pokémon'
];

var hostname = window.location.hostname;
var social_networks = [
  SN_FACEBOOK,
  SN_TWITTER
];

function removeShit()
{
  var output = $(
    '<div>',
    {
      'style': 'background: #eee; padding: 50px 20px;',
      'class': 'js-unshit-parent'
    }
  );
  var heading = $(
    '<h1>',
    {
      'style': 'color: #666;',
      'text':  'Pokemon Go Away!'
    }
  );

  return output.append(heading);
}

function hidePost(container, parentSelector, searchTerm)
{
  $(container + " *").filter(
    function ()
    {
      var $this = $(this),
        str = $.trim($this.text().toLowerCase());

      if(str.length > 0 && $this.is(':visible'))
      {
        if(str.indexOf(searchTerm) > -1)
        {
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
            var searchTerm = this.toLowerCase();

            switch(value)
            {
              case SN_FACEBOOK:
                hidePost('[data-referrer]', '.userContentWrapper', searchTerm);
                break;
              case SN_TWITTER:
                hidePost('.stream', '.js-stream-item', searchTerm);
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
    }, 500
  );
}

//after document-load
$(document).on('DOMSubtreeModified.event1', DOMModificationHandler);
