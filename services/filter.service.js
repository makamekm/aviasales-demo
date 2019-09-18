import { observable, action, computed } from 'mobx'
import filterTypes from '../models/transition'
import { useRouter, Router } from 'next/router'

const setAllTransitionObject = (obj, value = true) => {
  const names = filterTypes.map(v => v.key).filter(k => k !== 'all');
  for (const name of names) {
    obj[name] = value;
  }
  return obj;
}

const setTransitionObject = (obj, values) => {
  const names = filterTypes.map(v => v.key).filter(k => k !== 'all');
  for (const name of names) {
    obj[name] = values.indexOf(name) >= 0 ? true : false;
  }
  return obj;
}

class FilterService {
  @observable transition = setAllTransitionObject({}, true);
  @observable direction = {
    type: 'cheapest'
  };

  @computed get isCheapest() {
    return this.direction.type === 'cheapest';
  }

  @computed get isAllTransitionSelected() {
    const names = filterTypes.map(v => v.key).filter(k => k !== 'all');
    let result = true;
    for (const name of names) {
      result = result && this.transition[name];
    }
    return result;
  }

  router = null

  constructor() {
    this.router = useRouter();
    this.popRouter(this.router.asPath);
    Router.events.on('routeChangeComplete', (url) => {
      this.popRouter(url);
    });
  }

  popRouter(url) {
    const query = this.getQueryVariables(url);
    if (query.transition) {
      try {
        setTransitionObject(this.transition, JSON.parse(query.transition));
      } catch (e) {
        // Ignore JSON parse error
      }
    } else {
      setAllTransitionObject(this.transition, true);
    }
    if (query.direction) {
      this.direction.type = query.direction;
    }
  }

  getQueryVariables(url) {
    const query = url.split('?')[1] || '';
    const couples = query.split('&').filter(s => !!s);
    let result = {};
    let pair;
    for (let couple of couples) {
      pair = couple.split('=');
      result[pair[0]] = decodeURIComponent(pair[1]);
    }
    return result;
  }

  getTransition(name) {
    return name === 'all' ? this.isAllTransitionSelected : this.transition[name];
  }

  pushRouter() {
    const queries = [];
    if (!this.isAllTransitionSelected) {
      const transitionList = filterTypes.map(v => v.key).filter(k => this.transition[k]);
      queries.push(`transition=${JSON.stringify(transitionList)}`);
    }
    if (!this.isCheapest) {
      queries.push(`direction=${this.direction.type}`);
    }
    this.router.push(queries.length ? `${window.location.pathname}?${queries.join('&')}` : window.location.pathname);
  }

  @action toggleTransition(name) {
    if (name === 'all') {
      setAllTransitionObject(this.transition, !this.isAllTransitionSelected);
    } else {
      this.transition[name] = this.transition[name] ? false : true;
    }
    this.pushRouter();
  }

  @action toggleType() {
    this.direction.type = this.isCheapest ? 'fastest' : 'cheapest';
    this.pushRouter();
  }
}

export default FilterService;