function save_options()
{
  var keywords = document.getElementById('keywords').value;

  chrome.storage.sync.set(
    {keywords: btoa(keywords)},
    function ()
    {
      var status = document.getElementById('status');
      status.textContent = 'Changes saved successfully';
      setTimeout(function () { status.textContent = ''; }, 2000);
    }
  );
}

function restore_options()
{
  chrome.storage.sync.get(
    {keywords: btoa('pokemon, pokémon')}, function (items)
    {
      document.getElementById('keywords').value = atob(items.keywords);
    }
  );
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
