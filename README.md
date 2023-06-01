# rocky7 Router

Router for [rocky7](https://github.com/abhishiv/rocky7) inspired by react-router

[![Version](https://img.shields.io/npm/v/rocky7-router.svg?color=success&style=flat-square)](https://www.npmjs.com/package/rocky7-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/abhishiv/rocky7-router/actions/workflows/ci.yml/badge.svg)](https://github.com/abhishiv/rocky7-router/actions/workflows/ci.yml)
![Badge size](https://img.badgesize.io/https://cdn.jsdelivr.net/npm/rocky7-router/+esm?compression=gzip&label=gzip&style=flat-square)

**npm**: `npm i rocky7-router`  
**cdn**: https://cdn.jsdelivr.net/npm/rocky7-router/+esm

#### Sponsors

<table>
  <tr>
    <td><img align="middle" width="48" src="https://cdn.www.grati.co/versions/v10/favicons/2318440.png"></td>
    <td>You might want to try out <a href="https://www.grati.co">grati.co</a>, a no-code programming environment with emacs like extensibility.</td>
  </tr>
</table>

#### Example

```tsx
/** @jsx h **/

import { component, h, render } from "rocky7";
import { Link, Route, Switch, BrowserRouter } from "rocky7-router";

export const Layout = component<{}>("Layout", (props, {}) => {
  return (
    <BrowserRouter>
      <div>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
        <Switch>
          <Route path="" component={Home} />
          <Route path="about" component={About} />
        </Switch>
      </div>
    </BrowserRouter>
  );
});
export const Home = component<{}>("Home", (props, {}) => {
  return <div>Home</div>;
});

export const About = component<{}>("About", (props, {}) => {
  return <div>About</div>;
});

render(<Layout />, document.body);
```

#### Ecosystem

- [rocky7](https://github.com/abhishiv/rocky7)
