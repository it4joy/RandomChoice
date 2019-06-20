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

$(document).ready(function() {
    $('.std-form-label').first().attr('for', `variant-descr-${textAreasCounter}`);
    $('.textarea').first().attr('id', `variant-descr-${textAreasCounter}`);
});


const btnLaunchRandom = $('.btn-launch-random');


// adding variants

$('.btn-add-variant').on('click', function() {
    $('#app-form-step-1 .form-item:last').after(`
        <div class="form-item">
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


// deleting variants

$('#app-form-step-1').on('click', '.link-del-variant', function(e) {
    e.preventDefault();

    if ( $('#app-form-step-1 .form-item').length !== 1 ) {
        --textAreasCounter; // check !
        $(this).parent().remove();
    }

    if (textAreasCounter < 2) {
        btnLaunchRandom.attr('disabled', true);
    }
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
