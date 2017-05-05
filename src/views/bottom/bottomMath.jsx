import React from 'react';
import {observer} from 'mobx-react';
import * as styles from '../appContainer.css';
import SystemConstants from '../../common/constants/systemConstants';
import EventConstants from '../../common/constants/eventConstants';
import SpinBagCard from '../components/spinBagCard';

let MAX_SPINS = 16*16*16;

@observer
export default class BottomMath extends React.Component {
    calculateSpins = () => {
        this.props.emitter.emit(EventConstants.CalculateAllSpins);
    };

    calculatePrizesCH = () => {
        this.props.emitter.emit(EventConstants.CalculatePrizesCH);
    };

    calculateAvancesCH = () => {
        this.props.emitter.emit(EventConstants.CalculateAvancesCH);
    };

    render() {
        let progress = Math.ceil((this.props.store.allSpins.count / MAX_SPINS) * 100);
        return (
            <div className={styles.container}>

                {/* ADD GLOBAL PROGRESSION AND GLOBAL BUTTON */}

                {/* REMOVE BUTTON WHEN EACH PROGRESSION IS DONE */}

                <SpinBagCard
                    title={'Calculate all spins'}
                    subtitle={'Full permutation'}
                    action={this.calculateSpins}
                    spins={this.props.store.allSpins.count}
                    progress={progress}
                    isProcessing={this.props.store.isProcessing}
                    />

                <SpinBagCard
                    title={'Premios CH'}
                    action={this.calculatePrizesCH} 
                    spins={this.props.store.prizes_CH.length} 
                    isProcessing={this.props.store.isProcessing}
                    />
                    {/*
                        Calcula premios (crea un array de ID/ref sobre el allSpins)
                        Que mostri tres figures o amb wild, eliminar casos lletjos (jackpots just a sobre o sota, etc)
                        Mostrar % vàlids (acceptats i eliminats per lletjos)
                    */}

                <SpinBagCard
                    title={'Sin Premio'}
                    action={() => {}} 
                    spins={0} 
                    isProcessing={this.props.store.isProcessing}
                    />
                    {/*
                        Calcula sin premios (crea un array de ID/ref sobre el allSpins)
                        Eliminar casos lletjos (jackpots just a sobre o sota, etc)
                        Mostrar % vàlids (acceptats i eliminats per lletjos)
                    */}

                {/* RESTA PREMIS */}

                <SpinBagCard
                    title={'Avances CH'}
                    action={this.calculateAvancesCH} 
                    spins={0}
                    progress={0}
                    isProcessing={this.props.store.isProcessing}
                    />
                    {/*
                        Calcula avances (crea un array de ID/ref sobre el allSpins)
                        Que compleixin premi de CH amb aquests avances en cualsevol combinació de reels sense que per mig hi hagi premi igual o més gran, eliminar casos lletjos
                        4: 1-4 avances
                        Mostrar % vàlids (acceptats i eliminats per lletjos)
                    */}

                {/* RESTA AVANCES */}

                <SpinBagCard
                    title={'Retenciones CH'}
                    action={() => {}}
                    spins={0}
                    isProcessing={this.props.store.isProcessing}
                    />
                    {/*
                        Calcula retenciones (crea un array de ID/ref sobre el allSpins)
                        Que mostri dos figures o una més wild, eliminar casos lletjos (jackpots just a sobre o sota, etc)
                        Mostrar % vàlids (acceptats i eliminats per lletjos)
                    */}

                {/* RESTA RETENCIONES */}

                <SpinBagCard
                    title={'Bonos'}
                    action={() => {}} 
                    spins={0} 
                    progress={0} 
                    isProcessing={this.props.store.isProcessing}
                    />
                    {/*
                        Calcula bonos (crea un array de ID/ref sobre el allSpins)
                        Que mostri de 1 a 3 figuras (o 1 + wild/s), eliminar casos lletjos (jackpots just a sobre o sota, etc)
                        3: 1-3 scatter
                        Mostrar % vàlids (acceptats i eliminats per lletjos)
                    */}

                <SpinBagCard
                    title={'Minijuego'}
                    action={() => {}} 
                    spins={0} 
                    isProcessing={this.props.store.isProcessing}
                    />
                    {/*
                        Calcula minijuegos (crea un array de ID/ref sobre el allSpins)
                        Que mostri 3 figuras (no afecta wild), eliminar casos lletjos (jackpots just a sobre o sota, etc)
                        Mostrar % vàlids (acceptats i eliminats per lletjos)
                    */}
            </div>
        );
    }
}