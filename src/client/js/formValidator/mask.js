const Mask = (RULES) => {
    function generateMask(value, maskArray) {
        let textMasked = value;
        maskArray.forEach((mask) => {
            textMasked = textMasked.replace(mask[0], mask[1]);
        });
        return textMasked;
    }

    function addInputMask() {
        const inputsMask = document.querySelectorAll('[class^="mask-"]');
        inputsMask.forEach((inputMask) => {
            inputMask.addEventListener('keyup', function(e) {
                const INPUT_RULE = e.target.classList.toString().split('mask-')[1].split(/\s/)[0];
                setTimeout(()=> {
                    e.target.value = generateMask(e.target.value, RULES[INPUT_RULE].mask);
                }, 400);
            });
        })
    }

    return ({
        addInputMask: addInputMask
    })
}

export default Mask;