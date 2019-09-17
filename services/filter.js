import { observable, action, computed } from 'mobx';

class FilterService {
  @observable transition = {};
  @observable type = 'cheapest';

  @computed get isCheapest() {
    return this.type === 'cheapest';
  };

  getTransition(name) {
    return this.transition[name];
  };

  @action toggleTransition(name) {
    this.transition[name] = this.transition[name] ? false : true;
  }

  @action toggleType() {
    this.type = this.isCheapest ? 'fastest' : 'cheapest';
  }
}

export default FilterService;