
import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import App from './components/App'; 
import NotFoundPage from './components/pages/not-found-page';  
import Layout from './components/Layout'; 
import HomePage from './components/pages/home-pages';  
// import Login from './components/auth/login';  
// import RequireAuth from './components/auth/require-auth';
// import Dashboard from './components/dashboard'; 

export default () => {
 return (
  <Layout>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={App}/>
        <Route component={NotFoundPage}/>
      </Switch>
    </BrowserRouter>
  </Layout>

 )
};