const generateCodePrize = (prize) => {
    if (!prize) {
        return 'null';
    }
    return 'new Prize(' + prize.figure + ', ' + prize.type + ', ' + (prize.value ? prize.value : 'null') + ')';
};

const generateSpinPrize = (spin) => {
    return 'new Spin({' + prize.positions.join() + '}, {' + prize.figures.join() + '}, ' + generateCodePrize(spin.prize) + ')';
};