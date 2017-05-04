import MathStore from './store/mathStore';
import MathStoreBottom from './store/mathStoreBottom';

export let mathStore = new MathStore(
    new MathStoreBottom()
);