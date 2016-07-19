var headingText = 'Pokemon Go Away!';
const SEARCH_TERMS = [
  'pokemon', 'pokémon'
];

/**
 * All code above is config
 * all code below is extension related.
 *
 */

const SN_FACEBOOK = 'facebook';
const SN_TWITTER = 'twitter';

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
      'style': 'background: #eee; padding: 20px 20px; overflow: hidden; border: 1px solid rgba(0, 0, 0, 0.15);',
      'class': 'js-post-parent'
    }
  );
  var heading = $(
    '<h1>',
    {
      'style': 'color: #666; margin-top: 8px;',
      'text':  headingText
    }
  );
  var btn = $(
    '<button>',
    {
      'class': 'js-post-toggle',
      'text':  'Show Post',
      'style': 'float: right; padding: 8px 12px; border: 1px solid rgba(0, 0, 0, 0.25); border-radius: 2px; background: #3B5998; color: rgba(255, 255, 255, 0.75); cursor: pointer;'
    }
  );
  output.append(btn);
  output.append(heading);

  return output;
}

function hidePost(container, parentSelector, searchTerm)
{
  $(container + " *").filter(
    function ()
    {
      var $this = $(this),
        str = $.trim($this.text().toLowerCase());

      if($this.closest(parentSelector).hasClass('js-processed'))
      {
        return false;
      }

      if(str.length > 0 && $this.is(':visible'))
      {
        if(str.indexOf(searchTerm) > -1)
        {
          var item = $this.closest(parentSelector)
                          .addClass('js-processed')
                          .hide();

          removeShit().insertBefore(item);
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

$(document).on(
  'click', '.js-post-toggle', function ()
  {
    var post = $(this).closest('.js-post-parent')
                      .parent()
                      .find('.js-processed');

    post.toggle();

    if(post.is(':visible'))
    {
      $(this).text('Close Post');
    }
    else
    {
      $(this).text('Show Post');
    }
  }
);
