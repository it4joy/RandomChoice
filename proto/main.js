const errors = {
    emptyField: 'Please, fill the field',
    notANumber: 'Please, use only numbers',
    usingSpaces: 'Please, don\'t use spaces',
    tooBigAmount: 'The amount should be less or equal to 100',
}

// regExps

const regExpObj = {
    regExpNum: /\d/g,
    regExpSpaces: /\s/g,
}


// hides blocks

function hideBlock(block) {
    setTimeout(function() {
        block.hide();
    }, 4000);
}

function hideErrorBlock(currentForm, block) {
    setTimeout(function() {
        block.text('');
        block.fadeOut();
    }, 4000);
}


// node for custom events

const eNode = $({});


// gets nodes of steps & hides smth initially

const stepOneWrapper = $('.step-1');

const stepTwoWrapper = $('.step-2');
stepTwoWrapper.hide();


// step-1

$('.btn-step-1').on('click', function() {
    const currentForm = '#' + $(this).parent().attr('id');
    const currentErrorBlock = $(currentForm).find('.error-block');
    const amountOfVariantsField = $(currentForm).find('.amount-of-variants');
    const amountOfVariantsVal = amountOfVariantsField.val();

    currentErrorBlock.show();

    if ( amountOfVariantsVal.length === 0 ) {
        currentErrorBlock.text(errors.emptyField);
        amountOfVariantsField.after(currentErrorBlock);
        hideErrorBlock(currentForm, currentErrorBlock);
    } else if ( amountOfVariantsVal.match(regExpObj.regExpSpaces) !== null ) {
        currentErrorBlock.text(errors.usingSpaces);
        amountOfVariantsField.after(currentErrorBlock);
        hideErrorBlock(currentForm, currentErrorBlock);
    } else if ( amountOfVariantsVal.match(regExpObj.regExpNum) == null ) {
        currentErrorBlock.text(errors.notANumber);
        amountOfVariantsField.after(currentErrorBlock);
        hideErrorBlock(currentForm, currentErrorBlock);
    } else {
        if ( amountOfVariantsVal > 100 ) {
            currentErrorBlock.text(errors.tooBigAmount);
            amountOfVariantsField.after(currentErrorBlock);
            hideErrorBlock(currentForm, currentErrorBlock);
        } else {
            $(currentForm).after(currentErrorBlock);

            const variantsWrapperForm = $('#app-form-step-2');

            stepTwoWrapper.prepend(`<p class="p">The amount of variants is: ${amountOfVariantsVal}</p>`);

            for (let i = 1; i <= amountOfVariantsVal; i++) { // think about prefix / postfix notation of iterator
                variantsWrapperForm.append(`
                <div class="form-item">
                    <label for="variant-${i}" class="std-form-label">Please, input the description of variant</label>
                    <textarea id="variant-${i}" class="textarea"></textarea>
                </div>`);
            }

            variantsWrapperForm.append('<button type="button" class="btn btn-primary btn-next btn-step-2" disabled>Launch random choice</button>');
            variantsWrapperForm.append('<div class="error-block"></div>');
            eNode.trigger('readyVariantsList');
        }
    }
});

eNode.on('readyVariantsList', function() {
    stepOneWrapper.hide();
    stepTwoWrapper.show();
});
