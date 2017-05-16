const generateCodePrize = (prize) => {
    if (!prize) {
        return 'null';
    }
    return `new Prize(new Array[] {${prize.positions.join()}}, ${prize.figure}, ${prize.type}, ${(prize.value ? prize.value : 'null')})`;
};

const generateCodeSpin = (spin) => {
    if (!spin || !spin.positions || !spin.figures) {
        return '';
    }
    return `new Spin(new Array[] {${spin.positions.join()}}, new Array[] {${spin.figures.join()}}, new Array[] {${spin.prize.map(prize => generateCodePrize(prize)).join()}})`;
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