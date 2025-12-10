import { getContext, setContext } from "svelte";

export type GroupIdentifier = {
  name: string;
  id: string;
};

class AppContext {
  authenticated = $state<boolean>(false);
  username = $state<string>();
  groups = $state<Array<GroupIdentifier>>();
  recents = $state<Array<GroupIdentifier>>();

  /**
   * Used to hydrate state upon authentication
   * @param locals {App.Locals} local variables for client instance
   */
  hydrate(locals: App.Locals) {
    this.authenticated = locals.authenticated;
    this.username = locals.username;
    this.groups = locals.groups;
    this.recents = locals.recents;
  }

  unauthenticate(): void {
    this.authenticated = false;
    this.username = undefined;
    this.recents = undefined;
  }
}

const AppContextKey = Symbol("app.state");

export const setAppContext = () => {
  return setContext<AppContext>(AppContextKey, new AppContext());
};

export const getAppContext = () => {
  return getContext<AppContext>(AppContextKey);
};
