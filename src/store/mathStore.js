import {observable} from 'mobx';
import SystemConstants from '../common/constants/systemConstants';

export default class MathStore {
    mathBottom = null;
    mathTop = null;
    emitter = null;

    @observable activePanel = SystemConstants.PanelBottom;

    constructor(mathBottom, mathTop, emitter) {
        this.mathBottom = mathBottom;
        this.mathTop = mathTop;
        this.emitter = emitter;
    }
}