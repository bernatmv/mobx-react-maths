import {observable} from 'mobx';
import {appConfigBottom} from '../config/appConfig';

export default class MathStoreBottom {
    config = appConfigBottom;

    @observable allSpins = [];

    calculateAllSpins() {

    }
}