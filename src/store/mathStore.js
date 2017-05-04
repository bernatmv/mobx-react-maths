import {observable} from 'mobx';
import SystemConstants from '../common/constants/systemConstants';

export default class MathStore {
    mathBottom = null;

    @observable activePanel = SystemConstants.PanelBottom;

    constructor(mathBottom) {
        this.mathBottom = mathBottom;
    }
}