export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: 'Login', path: '/user/login', component: './User/Login' }]
  },
  { path: '/welcome', name: 'Welcome', icon: 'smile', component: './Welcome' },
  { path: '/add', name: 'add document', icon: 'smile', component: './AddDocument' },
  { path: '/query', name: 'query document', icon: 'table', component: './QueryDocument' },
  { path: '/addGroup', name: 'group of words', icon: 'table', component: './AddGroupOfWords' },
  { path: '/document/*', name: 'word in document', icon: 'table', component: './DocumentContent' },
  { path: '/word/*', name: 'word in document', icon: 'table', component: './DocumentWords' },
  { path: '/stats', name: 'Statistics', icon: 'table', component: './Statistics' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' }
];
