import { observable, action, computed } from 'mobx'
import filterTypes from '../models/transition'

const setAllTransitionObject = (obj, value = true) => {
  const names = filterTypes.map(v => v.key).filter(k => k !== 'all');
  for (const name of names) {
    obj[name] = value;
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

  getTransition(name) {
    return name === 'all' ? this.isAllTransitionSelected : this.transition[name];
  }

  @action toggleTransition(name) {
    if (name === 'all') {
      setAllTransitionObject(this.transition, !this.isAllTransitionSelected);
    } else {
      this.transition[name] = this.transition[name] ? false : true;
    }
  }

  @action toggleType() {
    this.direction.type = this.isCheapest ? 'fastest' : 'cheapest';
  }
}

export default FilterService;