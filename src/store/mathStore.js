import {observable} from 'mobx';
import SystemConstants from '../common/constants/systemConstants';

export default class MathStore {
    mathBottom = null;
    emitter = null;

    @observable activePanel = SystemConstants.PanelBottom;

    constructor(mathBottom, emitter) {
        this.mathBottom = mathBottom;
        this.emitter = emitter;
    }
}