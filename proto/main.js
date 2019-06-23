const errors = {
    emptyField: 'Please, fill the field',
    notANumber: 'Please, use only numbers',
    usingSpaces: 'Please, don\'t use spaces',
    tooSmallAmount: 'The amount should be more or equal to 2',
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
        if ( block.attr('class').indexOf('err') !== -1 ) {
            block.text('');
        }
    }, 4000);
}

function hideErrorBlock() {
    setTimeout(function() {
        $('.invalid').removeClass('invalid');
        $('.app-logic-step .error-block').fadeOut().text('');
    }, 3000);
    errAmount = 0;
    //console.log(errAmount); // test > ok
}


// node for custom events

const eNode = $({});


// gets nodes of steps & hides smth initially

const stepOneWrapper = $('.step-1');

const stepTwoWrapper = $('.step-2');
stepTwoWrapper.hide();


// step-1

let textAreasCounter = 1;

const stepOneCommonErrBlock = $('.step-1 .common-errors-block');

const btnLaunchRandom = $('.btn-launch-random');


// adding variants

$('.btn-add-variant').on('click', function() {
    $('#app-form-step-1 .form-item:last').after(`
        <div class="form-item scenario-1-item">
            <label for="variant-descr-${++textAreasCounter}" class="std-form-label">Please, input the description</label>
            <textarea id="variant-descr-${textAreasCounter}" class="textarea"></textarea>
            <a href="#" class="link link-del-variant">Delete variant</a>
            <div class="error-block"></div>
        </div>
    `);
    //$('#app-form-step-1 .form-item:last textarea').attr('autofocus'); // add 'autofocus' for new textareas

    if (textAreasCounter >= 2) {
        btnLaunchRandom.attr('disabled', false);
    }
});


$('.btn-specify-amount').on('click', function() {
    eNode.trigger('scenarioTwoActivated');
});

eNode.on('scenarioTwoActivated', function() {
    if ( $('#app-form-step-1 .scenario-2-item').length > 0 ) {
        textAreasCounter = $('#app-form-step-1 .scenario-2-item').length;
        $('.scenario-2-item').fadeIn();
        $('.btn-add-variants-auto').fadeOut();
        btnLaunchRandom.fadeIn(); // test
    } else {
        textAreasCounter = 0;
    }

    $('.note-scenario-1').fadeOut();
    $('.note-scenario-2').fadeIn();
    $('.scenario-1-item').fadeOut();
    $('.scenario-2').fadeIn();
    $('.btn-add-variant').fadeOut();
    btnLaunchRandom.fadeOut();
    $('.btn-add-variants-auto').fadeIn().attr('disabled', true);
});

$('.btn-back-to-init').on('click', function() {
    eNode.trigger('scenarioTwoDisactivated');
});

eNode.on('scenarioTwoDisactivated', function() {
    $('.note-scenario-1').fadeIn();
    $('.note-scenario-2').fadeOut();
    $('.scenario-1-item').fadeIn();
    $('.scenario-2-item').fadeOut();
    $('.scenario-2').fadeOut();
    $('.btn-add-variants-auto').fadeOut().attr('disabled', false);
    $('.btn-add-variant').fadeIn();
    if ( $('#app-form-step-1 .scenario-1-item').length >= 2 ) {
        btnLaunchRandom.fadeIn().attr('disabled', false);
    } else {
        btnLaunchRandom.fadeIn().attr('disabled', true);
    }
});

$('#amount-of-variants').on('input', function() {
    $('.btn-add-variants-auto').attr('disabled', false);
});

$('#amount-of-variants').on('blur', function() {
    if ( $(this).val().length === 0 ) {
        $('.btn-add-variants-auto').attr('disabled', true);
    }
});

$('.btn-add-variants-auto').on('click', function() {
    const amountOfVariants = $('#amount-of-variants').val();

    if ( amountOfVariants < 2 ) {
        stepOneCommonErrBlock.text(errors.tooSmallAmount).fadeIn();
        hideBlock(stepOneCommonErrBlock);
    // replace to 'length > 100'
    } else if ( amountOfVariants > 10 ) {
        stepOneCommonErrBlock.text(errors.tooBigAmount).fadeIn();
        hideBlock(stepOneCommonErrBlock);
    } else {
        // think about prefix / postfix notation of iterator
        for (let i = 1; i <= amountOfVariants; i++) {
            $('#app-form-step-1 .form-item:last').after(`
                <div class="form-item scenario-2-item">
                    <label for="variant-descr-${i}" class="std-form-label">Please, input the description</label>
                    <textarea id="variant-descr-${i}" class="textarea"></textarea>
                    <a href="#" class="link link-del-variant">Delete variant</a>
                    <div class="error-block"></div>
                </div>
            `);

            // test
            ++textAreasCounter;
            console.log(textAreasCounter);
        }

        $('.scenario-2-item:first').find('.link-del-variant').hide();
        $(this).fadeOut();
        btnLaunchRandom.fadeIn().attr('disabled', false);
    }
});


// deleting variants

$('#app-form-step-1').on('click', '.link-del-variant', function(e) {
    e.preventDefault();

    if ( $('#app-form-step-1 .scenario-1-item').length !== 1 || $('#app-form-step-1 .scenario-2-item').length !== 1 ) {
        --textAreasCounter; // check !
        $(this).parent().remove();
    }

    if (textAreasCounter < 2) {
        btnLaunchRandom.attr('disabled', true);
    }

    if ( $('#app-form-step-1 .scenario-2-item').length === 1 ) {
        $('#app-form-step-1 .scenario-2-item').remove();
        $('.btn-add-variants-auto').fadeIn();
    }

    console.log(textAreasCounter); // test
});


// validation & launch random choice

let errAmount = 0;

btnLaunchRandom.on('click', function() {
    const variantsAmount = $('#app-form-step-1 .textarea').length;

    // replace to 'length > 100'
    if ( variantsAmount > 10 ) {
        stepOneCommonErrBlock.text(errors.tooBigAmount).fadeIn();
        hideBlock(stepOneCommonErrBlock);
        return false;
    }

    $('#app-form-step-1 .textarea').each(function() {
        if ( $(this).val() == '' ) {
            $(this).addClass('invalid');
            ++errAmount;
            //console.log(errAmount); // test > ok
        }
    });

    if ( errAmount > 0 ) {
        eNode.trigger('validationError', ['emptyField']);
    } else {
        // generates a pseudo random number of variant
        let randomNumOfVar = Math.random() * variantsAmount;
        randomNumOfVar = Math.floor(randomNumOfVar);
        //console.log(randomNumOfVar); // test
        const selectedVarParent = $('#app-form-step-1 .textarea').eq(randomNumOfVar).parent();

        selectedVarParent.addClass('selected-variant');
        btnLaunchRandom.attr('disabled', true);
        setTimeout(function() {
            selectedVarParent.removeClass('selected-variant');
            btnLaunchRandom.attr('disabled', false);
        }, 4000);
    }
});

eNode.on('validationError', function(e, errType = '') {
    if ( errType !== '' ) {
        const err = errors[errType];
        $('.invalid').each(function() {
            $(this).parent().find('.error-block').text(err).fadeIn();
        });

        hideErrorBlock();
    }
});


// tmp

eNode.on('readyVariantsList', function() {
    stepOneWrapper.hide();
    stepTwoWrapper.show();
});
