const assert = require('node:assert/strict');
const { create, parseCatalog, indexCatalog } = require('../inventors.js');

const folderId = 'fictional-folder';
const first = 'fictional-video-2';
const later = 'fictional-video-10';
const video = (id, title) => ({
  id, title, mime: 'video/mp4', size: 12000, url: 'https://drive.google.com/file/d/' + id + '/view'
});
const folder = {
  id: folderId, title: '6. Робототехника', mime: 'application/vnd.google-apps.folder',
  url: 'https://drive.google.com/drive/folders/' + folderId,
  items: [video(later, '10. Робот.mp4'), video(first, '2. <Тест>.mp4')]
};
const source = items => JSON.stringify({ version: 1, items });
const raw = source([folder]);

async function run() {
  const index = indexCatalog(parseCatalog(raw));
  assert.equal(index.videos, 2);
  assert.deepEqual(index.entries.get(later).parents.map(item => item.id), [folderId]);

  for (const url of [
    'https://drive.google.com.example.org/file/d/' + first + '/view',
    'https://data@drive.google.com/file/d/' + first + '/view',
    'https://drive.google.com/file/d/' + later + '/view',
    'javascript:alert(1)'
  ]) assert.throws(() => parseCatalog(source([{ ...video(first, 'Example'), url }])), /Invalid Drive link/);
  assert.throws(() => parseCatalog(source([folder, folder])), /Invalid entry/);
  assert.throws(() => parseCatalog(source([{ ...video(first, 'Example'), mime: 'constructor' }])), /Invalid file/);
  const keyed = { ...video(first, 'Example'), url: video(first, '').url + '?usp=sharing&resourcekey=fictional-key' };
  assert.equal(parseCatalog(source([keyed])).items[0].url, video(first, '').url + '?resourcekey=fictional-key');

  const saved = new Map([['vale-study-book-v02', 'progress']]);
  const storage = { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) };
  let markup;
  let message;
  const results = {};
  const viewer = { querySelector: () => ({ focus() {} }) };
  global.location = { hash: '#inventors' };
  global.document = { querySelector: selector => selector === '#inventor-results' ? results : viewer };
  const options = {
    shell: (html, tab) => { markup = html; assert.equal(tab, 'inventors'); },
    lang: () => 'en',
    toast: next => { message = next; },
    storage
  };
  const app = create(options);
  app.render();
  assert.match(markup, /Add a catalog/);
  await app.importFile({ size: raw.length, text: async () => raw });
  assert.match(markup, /Robotics/);
  assert.equal(saved.get('vale-study-book-v02'), 'progress');
  await app.importFile({ size: 2, text: async () => '[]' });
  assert.match(message, /Could not read/);
  create(options).render();
  assert.match(markup, /Robotics/);
  app.search('робот тест');
  assert.match(results.innerHTML, /&lt;Тест&gt;/);
  assert.doesNotMatch(results.innerHTML, /10\. Робот/);
  app.render([folderId]);
  assert.ok(markup.indexOf(first) < markup.indexOf(later));
  app.search('робот');
  assert.match(results.innerHTML, /Робот/);
  assert.doesNotMatch(results.innerHTML, /Тест/);
  app.render([first]);
  assert.doesNotMatch(markup, /<iframe/);
  assert.match(markup, /Open file in browser/);
  const button = {};
  app.showPreview(button);
  assert.match(viewer.innerHTML, /src="https:\/\/drive\.google\.com\/file\/d\/fictional-video-2\/preview"/);
  assert.equal(button.hidden, true);
  console.log('Inventors catalog, local storage, search, and on-demand preview passed');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
