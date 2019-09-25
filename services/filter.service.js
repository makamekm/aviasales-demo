import { observable, action, computed } from "mobx";
import { useRouter, Router } from "next/router";
import filterKeys from "../models/filter.transition-key";
import {
  setAllTransitionObject,
  setTransitionObject,
} from "../utils/filter.transition";

class FilterService {
  queryParams = {};

  setQueryParams(queryParams) {
    this.queryParams = queryParams;
  }
  getQueryVariables() {
    return this.queryParams;
  }

  @observable transition = setAllTransitionObject({}, true);
  @observable direction = {
    type: "cheapest",
  };

  @computed get isCheapest() {
    return this.direction.type === "cheapest";
  }

  @computed get isAllTransitionSelected() {
    let result = true;
    for (const name of filterKeys) {
      result = result && this.transition[name];
    }
    return result;
  }

  router = useRouter();

  constructor() {
    this.popRouter();
    Router.events.on("routeChangeComplete", () => {
      this.popRouter();
    });
  }

  popRouter() {
    const query = this.getQueryVariables();
    this.popRouterQueryTransition(query);
    this.popRouterQueryDirection(query);
  }

  popRouterQueryTransition(query) {
    if (query.transition) {
      try {
        setTransitionObject(this.transition, JSON.parse(query.transition));
      } catch (e) {
        // Ignore JSON parse error
      }
    } else {
      setAllTransitionObject(this.transition, true);
    }
  }

  popRouterQueryDirection(query) {
    if (query.direction) {
      this.direction.type = query.direction;
    }
  }

  getTransition(name) {
    return name === "all"
      ? this.isAllTransitionSelected
      : this.transition[name];
  }

  pushRouter() {
    const direction = this.direction.type;
    const transition = JSON.stringify(
      filterKeys.filter(k => this.transition[k])
    );
    this.changeUrl({ transition, direction });
  }

  changeUrl(query = {}) {
    this.router.push({
      pathname: "/",
      as: "/",
      query,
    });
  }

  getQueryFromQueries(queries) {
    return queries.length
      ? `${window.location.pathname}?${queries.join("&")}`
      : window.location.pathname;
  }

  @action toggleTransition(name) {
    if (name === "all") {
      setAllTransitionObject(this.transition, !this.isAllTransitionSelected);
    } else {
      this.transition[name] = this.transition[name] ? false : true;
    }
    this.pushRouter();
  }

  @action toggleType() {
    this.direction.type = this.isCheapest ? "fastest" : "cheapest";
    this.pushRouter();
  }
}

export default FilterService;
