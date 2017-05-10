const generateCodePrize = (prize) => {
    if (!prize) {
        return 'null';
    }
    return 'new Prize(' + prize.figure + ', ' + prize.type + ', ' + (prize.value ? prize.value : 'null') + ')';
};

const generateCodeSpin = (spin) => {
    if (!spin || !spin.positions || !spin.figures) {
        return '';
    }
    return 'new Spin({' + spin.positions.join() + '}, {' + spin.figures.join() + '}, ' + generateCodePrize(spin.prize) + ')';
};

export const generateCodeBag = (variable, bag) => {
    if (!bag) {
        return '';
    }
    console.log(`===> GENERATING CODE FOR: ${variable} <===`);
    return `
        var ${variable} = new Array[] {
            ${bag.map(spin => generateCodeSpin(spin)).join(',\n            ')}
        };
`;
};

export const generateAdvancementsCodeBag = (variable, bag) => {
    if (!bag) {
        return '';
    }
    console.log(`===> GENERATING ADVANCEMENTS CODE FOR: ${variable} <===`);
    return `
        var ${variable} = new Array[] {
            ${bag.map(advancement => {
                return `new Advancement(${generateCodeSpin(advancement.startSpin)}, ${generateCodeSpin(advancement.prizedSpin)}, new Array[] {${advancement.movements.join()}}`;
            }).join(',\n            ')}
        };
`;
};