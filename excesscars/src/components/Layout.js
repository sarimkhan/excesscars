import React from 'react';
import { Outlet } from 'react-router';

function Layout() {
  return (
    <div>
      <header>
        <h1>My App</h1>
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/vehicles">vehicles</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;