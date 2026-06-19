(function () {
  var form = document.querySelector('[data-global-search]');
  var results = document.querySelector('[data-search-results]');

  if (!form || !results || !Array.isArray(window.movieIndex || movieIndex)) {
    return;
  }

  function render(items) {
    results.innerHTML = items.slice(0, 80).map(function (item) {
      return [
        '<article class="movie-card">',
        '  <a class="poster-link" href="' + item.url + '">',
        '    <div class="poster" style="--poster-image: url(\'' + item.poster + '\');">',
        '      <span class="poster-year">' + item.year + '</span>',
        '      <span class="poster-type">' + item.type + '</span>',
        '    </div>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <h3><a href="' + item.url + '">' + item.title + '</a></h3>',
        '    <p class="movie-meta">' + item.region + ' · ' + item.genre + '</p>',
        '    <p class="movie-line">' + item.oneLine + '</p>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function search() {
    var data = new FormData(form);
    var keyword = (data.get('keyword') || '').toString().trim().toLowerCase();
    var type = (data.get('type') || '').toString();
    var year = (data.get('year') || '').toString();

    var items = movieIndex.filter(function (item) {
      var content = [item.title, item.region, item.type, item.genre, item.tags, item.oneLine].join(' ').toLowerCase();
      var keywordMatched = !keyword || content.indexOf(keyword) !== -1;
      var typeMatched = !type || item.type === type;
      var yearMatched = !year || String(item.year) === year;
      return keywordMatched && typeMatched && yearMatched;
    });

    render(items);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    search();
  });

  Array.prototype.slice.call(form.elements).forEach(function (control) {
    control.addEventListener('input', search);
    control.addEventListener('change', search);
  });

  render(movieIndex.slice(0, 40));
})();
