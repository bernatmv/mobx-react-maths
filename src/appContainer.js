import {EventEmitter} from 'fbemitter';
import MathStore from './store/mathStore';
import MathStoreBottom from './store/mathStoreBottom';
import MathStoreTop from './store/mathStoreTop';

export let emitter = new EventEmitter();

export let mathStore = new MathStore(
    new MathStoreBottom(emitter),
    new MathStoreTop(emitter),
    emitter
);