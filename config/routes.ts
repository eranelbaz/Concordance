export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: 'Login', path: '/user/login', component: './User/Login' }]
  },
  { path: '/welcome', name: 'Welcome', icon: 'smile', component: './Welcome' },
  { name: 'Search Table', icon: 'table', path: '/list', component: './TableList' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' }
];
