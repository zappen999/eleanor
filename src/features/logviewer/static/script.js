/* eslint-disable */
$(document).ready(function() {
  let currentPage = 1;
  let perPage = 100;
  let isLoading = false;

  (function populateFromQueryString() {
    const params = (new URL(location)).searchParams;
    const from = new Date();
    from.setMinutes(from.getMinutes() - 10);
    const until = new Date();
    until.setFullYear(until.getFullYear() + 1);

    $('#from').val(params.get('from') || from.toISOString());
    $('#until').val(params.get('until') || until.toISOString());
    $('#search').val(params.get('search') || '');
    $('#minLevel').val(params.get('minLevel') || 'info');
    currentPage = Number(params.get('currentPage')) || 1;

    query();
  })();

  function triggerLoading() {
    if (isLoading) {
      $('.loader').fadeOut('fast');
      $('.btn-query').removeClass('disabled');
      isLoading = false;
      return;
    }

    $('.loader').fadeIn('fast');
    $('.btn-query').addClass('disabled');
    isLoading = true;
  }

  function query() {
    if (isLoading) {
      return;
    }

    triggerLoading();

    const params = {
      search: $('#search').val(),
      from: new Date($('#from').val()).toISOString(),
      until: new Date($('#until').val()).toISOString(),
      minLevel: $('#minLevel').val(),
      start: (currentPage - 1) * perPage,
      limit: perPage,
      currentPage: currentPage,
    };

    console.log(params);

    // save state in url
    const newurl = window.location.protocol + "//" + window.location.host
      + window.location.pathname + '?' + $.param(params);
    window.history.pushState({ path: newurl }, '', newurl);

    window.fetch('/v1/graphql', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ($search: String, $minLevel: Level, $from: String, $until: String, $start: Int, $limit: Int) {
            logs(search: $search, minLevel: $minLevel, from: $from, until: $until, start: $start, limit: $limit) {
              level
              createdAt
              message
              meta
            }
          }
        `,
        variables: params
      })
    })
      .then(res => res.json())
      .then(data => {
        triggerLoading();
        render(data.data.logs);
      });
  }

  function render(logs) {
    $('.log-table tbody').empty();

    if (logs.length === 0) {
      $('.no-hits').fadeIn('fast');
      return;
    }

    $('.no-hits').fadeOut('fast');

    const metaBtn = `<a href="#" class="btn-meta">Expand meta</a>`;
    for (let log of logs) {
      const metaExists = Object.keys(log.meta).length > 0;
      const expandMeta = metaExists && JSON.stringify(log.meta).length > 20;
      $('.log-table tbody').append(`
        <tr>
          <td class="loglevel ${log.level}">${log.level}</td>
          <td>${log.createdAt}</td>
          <td>${log.message}</td>
          <td>
            ${expandMeta ? metaBtn : ''}
            ${metaExists && !expandMeta
              ? '<pre><code class="language-json">' + JSON.stringify(log.meta) + '</code></pre>'
              : ''}
          </td>
        </tr>
      `);

      if (expandMeta) {
        $('.log-table tbody').append(`
          <tr class="detailed-info">
            <td colspan="4">
              <pre><!-- no spacing
                --><code class="language-json">${JSON.stringify(log.meta, null, 2)}</code><!--
              --></pre>
            </td>
          </tr>
        `);
      }
    }

    Prism.highlightAll(); // re-highlight all meta blocks
  }

  function goToPage(page) {
    if (page <= 0) {
      return;
    }

    currentPage = page;

    if (currentPage === 1) {
      $('.page-item.previous').addClass('disabled');
    } else {
      $('.page-item.previous').removeClass('disabled');
    }

    query();
  }

  $('.log-table').on('click', '.btn-meta', function() {
    $($(this).closest('tr').next('tr')).toggle();
    return false;
  });

  $('.btn-query').on('click', function() {
    query();
    return false;
  });

  $('.page-item.previous').on('click', function() {
    goToPage(currentPage - 1);
    return false;
  });

  $('.page-item.next').on('click', function() {
    goToPage(currentPage + 1);
    return false;
  });
});
