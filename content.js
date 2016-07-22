const PLATFORM_FACEBOOK = 'facebook';
const PLATFORM_TWITTER = 'twitter';
const PLATFORM_LINKEDIN = 'linkedin';

var searchTerms = null;
var manifest = chrome.runtime.getManifest();
var hostname = window.location.hostname;
var isSupported = true;
var platforms = [
  PLATFORM_FACEBOOK,
  PLATFORM_TWITTER,
  PLATFORM_LINKEDIN
];

function hidePost(searchTerm)
{
  var output = document.createElement('div');
  output.classList.add('js-post-parent');
  output.setAttribute(
    'style',
    'background: #eee; padding: 20px 20px; overflow: hidden; ' +
    'border: 1px solid rgba(0, 0, 0, 0.15);'
  );

  var heading = document.createElement('h1');
  heading.setAttribute('style', 'color: #666;');
  heading.textContent = manifest.name;

  var keyword = document.createElement('span');
  keyword.setAttribute('style', 'color: #999;');
  keyword.textContent = 'keyword: ' + searchTerm;

  var btn = document.createElement('button');
  btn.classList.add('js-post-toggle');
  btn.textContent = 'Show Post';
  btn.setAttribute(
    'style', 'float: right; padding: 8px 12px; ' +
    'border: 1px solid rgba(0, 0, 0, 0.25); border-radius: 2px; ' +
    'background: #3B5998; color: rgba(255, 255, 255, 0.75); cursor: pointer;'
  );

  output.appendChild(btn);
  output.appendChild(heading);
  output.appendChild(keyword);

  return $(output);
}

function filterContent(feedContainer, postContainer, searchTerm)
{
  $(feedContainer + " *").filter(
    function ()
    {
      var $this = $(this),
        str = $.trim($this.text().toLowerCase());

      if($this.closest(postContainer).hasClass('js-processed'))
      {
        return false;
      }

      if(str.length > 0 && $this.is(':visible'))
      {
        if(str.indexOf(searchTerm) > -1)
        {
          var item = $this.closest(postContainer)
                          .addClass('js-processed');

          item.wrapInner($('<div class="js-post">').hide());
          hidePost(searchTerm).prependTo(item);
        }
      }
    }
  );
}

function checkPage()
{
  if(searchTerms)
  {
    var hostnameExists = 0;

    $(platforms).each(
      function (key, platform)
      {
        if(hostname.indexOf(platform) > -1)
        {
          hostnameExists++;

          $(searchTerms).each(
            function ()
            {
              var kw = $.trim(this.toLowerCase());

              switch(platform)
              {
                case PLATFORM_FACEBOOK:
                  filterContent('[data-referrer]', '.userContentWrapper', kw);
                  break;
                case PLATFORM_TWITTER:
                  filterContent('.stream', '.js-stream-item', kw);
                  break;
                case PLATFORM_LINKEDIN:
                  filterContent('#ozfeed', 'li > .content', kw);
                  break;
              }
            }
          );
        }
      }
    );

    if(!hostnameExists)
    {
      isSupported = false;
      console.log(hostname + ' is not in the list of supported platforms');
    }
  }
  else
  {
    chrome.storage.sync.get(
      'keywords', function (items)
      {
        searchTerms = atob(items.keywords).split(',');
      }
    );

    setTimeout(function () { checkPage(); }, 250);
  }
}
checkPage();

function DOMModificationHandler()
{
  if(isSupported)
  {
    $(this).unbind('DOMSubtreeModified.event1');
    setTimeout(
      function ()
      {
        console.log('checkPage');
        checkPage();
        $(document).on('DOMSubtreeModified.event1', DOMModificationHandler);
      }, 750
    );
  }
}

//after document-load
$(document).on('DOMSubtreeModified.event1', DOMModificationHandler);

$(document).on(
  'click', '.js-post-toggle', function ()
  {
    var post = $(this).closest('.js-processed').find('.js-post');

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
