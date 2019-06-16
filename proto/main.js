const errors = {
    emptyFields: 'Please, fill each field',
    notANumber: 'Please, use only numbers',
}

const regExpObj = {
    regExpNum: /\d/g,
    regExpSpaces: /\s/g,
}

const errorBlock = $('.error-block');

function hideBlock(block) {
    setTimeout(function() {
        block.hide();
    }, 4000);
}

function hideErrorBlock(currentForm, block) {
    setTimeout(function() {
        block.text('');
        $(currentForm).after(block);
    }, 4000);
}

$('.btn-next').on('click', function() {
    errorBlock.show();
    let currentForm = $(this).data('form-id');
    
    if ( currentForm === 'app-form-step-1' ) {
        currentForm = `#${currentForm}`;
        const amountOfVariantsField = $(currentForm).find('.amount-of-variants');
        const amountOfVariantsVal = $(amountOfVariantsField).val();
        if ( amountOfVariantsVal.match(regExpObj.regExpNum) == null ) {
            $(errorBlock).text(errors.notANumber);
            $(amountOfVariantsField).after(errorBlock);
            hideErrorBlock(currentForm, errorBlock);
        }
    }
});
