const errors = {
    emptyField: 'Please, fill the field',
    notANumber: 'Please, use only numbers',
    usingSpaces: 'Please, don\'t use spaces',
    tooSmallAmount: 'The amount should be more or equal to 2',
    tooBigAmount: 'The amount should be less or equal to 100',
}

const customEvents = {
    isScenarioOne: true,
    sc2: 'sc2Activated',
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
        $('.form-wrapper .error-block').fadeOut().text('');
    }, 3000);
    errAmount = 0;
    console.log(`Err amount is: ${errAmount}`); // test
}


// node for custom events

const eNode = $({});


// work with form

let textAreasCounter = 2; // init amount of textareas (in both scenarios)

const scOneWrapper = $('.scenario-1-wrapper');
const scTwoWrapper = $('.scenario-2-wrapper');

const commonErrBlock = $('.form-wrapper .common-errors-block');

const btnLaunchRandom = $('.btn-launch-random');
const btnSpecifyAmount = $('.btn-specify-amount');
const btnAddAuto = $('.btn-add-variants-auto');


// adds variants (scenario-1)

$('.btn-add-variant').on('click', function() {
    $('#app-form .scenario-1-item:last').after(`
        <div class="form-item scenario-1-item">
            <label for="variant-descr-${++textAreasCounter}" class="std-form-label">Please, input the description</label>
            <textarea id="variant-descr-${textAreasCounter}" class="textarea"></textarea>
            <a href="#" class="link link-del-variant">Delete variant</a>
            <div class="error-block"></div>
        </div>
    `);
});


// scenario-2

btnSpecifyAmount.on('click', function() {
    eNode.trigger(customEvents.sc2);
    console.log(`E: ${customEvents.sc2}`); // test
});


eNode.on(customEvents.sc2, function() {
    customEvents.isScenarioOne = false;

    scOneWrapper.fadeOut();
    scTwoWrapper.fadeIn();
    
    btnAddAuto.fadeIn();

    // if variants are already exist (scenario 2, adding new)
    if ( $('#app-form .scenario-2-item').length > 0 ) {
        textAreasCounter = $('#app-form .scenario-2-item').length;
        console.log(textAreasCounter); // test
        $('.scenario-2 label').text('You can add variants');
        $('.scenario-2-item').fadeIn();
        $('.btn-add-variants-auto').fadeIn().attr('disabled', false);
        btnLaunchRandom.fadeIn(); // test
        eNode.trigger('scenario2_Adding'); // test
    } else {
        textAreasCounter = 0;
        btnLaunchRandom.fadeOut(); // ?
        $('.btn-add-variants-auto').fadeIn().attr('disabled', true);
    }

    $('.note-scenario-1').fadeOut();
    $('.note-scenario-2').fadeIn();
    $('.scenario-1-item').fadeOut();
    $('.scenario-2').fadeIn();
    $('.btn-add-variant').fadeOut(); // test
});

$('.btn-back-to-init').on('click', function() {
    eNode.trigger('scenarioTwoDisactivated');
});

eNode.on('scenarioTwoDisactivated', function() {
    // if variants are already exist (scenario 1, adding new)
    if ( $('.scenario-1-item').length > 0 ) {
        textAreasCounter = $('.scenario-1-item').length; // test
    }

    $('.note-scenario-1').fadeIn();
    $('.note-scenario-2').fadeOut();
    $('.scenario-1-item').fadeIn();
    $('.scenario-2-item').fadeOut();
    $('.scenario-2').fadeOut();
    $('.btn-add-variants-auto').fadeOut().attr('disabled', false);
    $('.btn-add-variant').fadeIn();
    if ( $('#app-form .scenario-1-item').length >= 2 ) {
        btnLaunchRandom.fadeIn().attr('disabled', false);
    } else {
        btnLaunchRandom.fadeIn().attr('disabled', true);
    }
});


// checking field with amount's value

$('#amount-of-variants').on('input', function() {
    // replace '10' to '100' after test
    if ( $(this).val() < 2 || $(this).val() > 10 ) {
        $('.btn-add-variants-auto').attr('disabled', true);
        // N: output of errors?
    } else {
        $('.btn-add-variants-auto').attr('disabled', false);
    }
});


eNode.on('scenario2_Adding', function() {
    $('.btn-add-variants-auto').on('click', function() {
        const amountOfVariants = $('#amount-of-variants').val();
        const currentScenario2ItemsAmount = $('.scenario-2-item').length;

        if ( amountOfVariants + currentScenario2ItemsAmount > 10 ) {
            commonErrBlock.text(errors.tooBigAmount).fadeIn();
            hideBlock(commonErrBlock);
        } else {
            for (let i = currentScenario2ItemsAmount; i <= amountOfVariants + currentScenario2ItemsAmount; i++) {
                $('#app-form .scenario-2-item:last').after(`
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

            $(this).fadeOut();
            btnLaunchRandom.fadeIn().attr('disabled', false);
        }
    });
});


// scenario-2

btnAddAuto.on('click', function() {
    const amountOfVariants = $('#amount-of-variants').val();
    console.log(amountOfVariants); // test

    // N: remove this validation because it already exists above as a validation after click on the button
    if ( amountOfVariants > 10 ) {
        commonErrBlock.text(errors.tooBigAmount).fadeIn();
        hideBlock(commonErrBlock);
    } else {
        // think about prefix / postfix notation of iterator
        // defines the value of 'i' according 2 init blocks
        for (let i = 3; i <= amountOfVariants; i++) {
            $('#app-form .scenario-2-item:last').after(`
                <div class="form-item scenario-2-item">
                    <label for="sc2-variant-descr-${i}" class="std-form-label">Please, input the description</label>
                    <textarea id="sc2-variant-descr-${i}" class="textarea"></textarea>
                    <a href="#" class="link link-del-variant">Delete variant</a>
                    <div class="error-block"></div>
                </div>
            `);

            // test
            ++textAreasCounter;
            console.log(textAreasCounter);
        }

        $(this).fadeOut(); // test
    }
});


// deletes variants

$('#app-form').on('click', '.link-del-variant', function(e) {
    e.preventDefault();

    if ( $('#app-form .scenario-1-item').length !== 2 || $('#app-form .scenario-2-item').length !== 2 ) {
        --textAreasCounter;
        $(this).parent().remove();
    }

    console.log(textAreasCounter); // test
});


// validation & launch random choice

let errAmount, variantsAmount = 0;

btnLaunchRandom.on('click', function() {
    // this handler is independent of scenarios (check !)

    if ( customEvents.isScenarioOne === true ) {
        variantsAmount = $('.scenario-1-item').length;
    } else {
        variantsAmount = $('.scenario-2-item').length;
    }

    // replace to 'length > 100'
    if ( variantsAmount > 10 ) {
        commonErrBlock.text(errors.tooBigAmount).fadeIn();
        hideBlock(commonErrBlock);
        return false;
    }

    $('#app-form .textarea').each(function() {
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
        const selectedVarParent = $('#app-form .textarea').eq(randomNumOfVar).parent();

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
