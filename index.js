let myLinks = [];
const inputEl = document.getElementById('input-el');
const inputBtn = document.getElementById('input-btn');
const ulEl = document.getElementById('ul-el');
const deleteAllBtn = document.getElementById('delete-all-btn');
const linksFromLocalStorage = JSON.parse(localStorage.getItem('myLinks'));

const tabBtn = document.getElementById('tab-btn');

if (linksFromLocalStorage) {
  myLinks = linksFromLocalStorage;
  render(myLinks);
}

function truncate(str, num = 50) {
  if (str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
}

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

function saveToLocalStorage(myLinks) {
  localStorage.setItem('myLinks', JSON.stringify(myLinks));
}

tabBtn.addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLinks.push(tabs[0].url);
    saveToLocalStorage(myLinks);
    render(myLinks);
  });
});

function render(links) {
  ulEl.innerHTML = links
    .map(
      (link, i) => String.raw`
      <li>
          <a target='_blank' data-index='${i}'  href='${link}'>
              <!-- 'removes the https:// from the url'  -->
              ${truncate(link.replace('https://', ''))}
          </a>
          <button id="delete-btn">
          <span class="material-symbols-outlined">
              close
          </span>
          </button>
      </li>
    `
    )
    .join('');
}
function addLead() {
  if (isValidHttpUrl(inputEl.value)) {
    myLinks.push(inputEl.value);
    inputEl.value = '';
    saveToLocalStorage(myLinks);
    render(myLinks);
  } else {
    alert(`Invalid URL
        
Remember to add https://`);
  }
}

deleteAllBtn.addEventListener('dblclick', function () {
  const deleteAll = confirm('Are you sure you want to delete all links?');
  if (deleteAll) {
    localStorage.clear();
    myLinks = [];
    render(myLinks);
  }
});

inputBtn.addEventListener('click', addLead);

window.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') addLead();
});

ulEl.addEventListener('dblclick', function (e) {
  const deleteBtn = e.target.closest('#delete-btn');
  console.log(deleteBtn);
  const index = deleteBtn.previousElementSibling.dataset.index;
  console.log(index);
  myLinks.splice(+index, 1);

  saveToLocalStorage(myLinks);
  render(myLinks);
});
