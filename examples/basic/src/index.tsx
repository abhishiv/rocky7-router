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
          <li>
            <Link href="/profile">Profile</Link>
          </li>
          <li>
            <Link href="/profile/settings">Profile Settings</Link>
          </li>
          <li>
            <Link href="/profile/settings/delete">Profile Delete</Link>
          </li>
        </ul>
        <Switch>
          <Route path="" component={Home} />
          <Route path="about" component={About} />
          <Route path="profile" component={Profile} />
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

export const Profile = component<{}>("Profile", (props, {}) => {
  return (
    <div>
      profile
      <Switch>
        <Route path="" component={ProfileIndex} />
        <Route path="settings" component={ProfileSettings} />
      </Switch>
    </div>
  );
});

export const ProfileIndex = component<{}>("ProfileIndex", (props, {}) => {
  return <div>ProfileIndex</div>;
});

export const ProfileSettings = component<{}>("ProfileSettings", (props, {}) => {
  return (
    <div>
      ProfileSettings
      <Switch>
        <Route path="" component={ProfileSettingsIndex} />
        <Route path="delete" component={ProfileSettingsDelete} />
      </Switch>
    </div>
  );
});
export const ProfileSettingsIndex = component<{}>(
  "ProfileSettingsIndex",
  (props, {}) => {
    return <div>ProfileSettingsIndex</div>;
  }
);
export const ProfileSettingsDelete = component<{}>(
  "ProfileSettingsDelete",
  (props, {}) => {
    return <div>ProfileSettingsDelete</div>;
  }
);
