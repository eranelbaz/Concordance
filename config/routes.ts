export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: 'Login', path: '/user/login', component: './User/Login' }]
  },
  { path: '/welcome', name: 'Welcome', icon: 'smile', component: './Welcome' },
  { path: '/add', name: 'add document', icon: 'smile', component: './AddDocument' },
  { path: '/query', name: 'query document', icon: 'table', component: './QueryDocument' },
  { path: '/words/*', name: 'word in document', icon: 'table', component: './DocumentWords' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' }
];
