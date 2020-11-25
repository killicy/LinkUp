import { extendObservable } from 'mobx';

class UserStore {
    constructor() {
        extendObservable(this, {
            loading: true,
            login: false,
            username: '',
            register: false
        })
    }
}

export default new UserStore();
