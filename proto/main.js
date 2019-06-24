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
    sc1: 'sc1Activated',
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
        errBlock.fadeOut().text('');
    }, 3000);
    // tmp
    //errAmount = 0;
    //console.log(`Err amount is: ${errAmount}`);
}


// node for custom events

const eNode = $({});


// work with form

let textAreasCounter = 2; // init amount of textareas (in both scenarios)

const scOneWrapper = $('.scenario-1-wrapper');
const scTwoWrapper = $('.scenario-2-wrapper');

const scOneNote = $('.note-scenario-1');
const scTwoNote = $('.note-scenario-2');

const scTwoControl = $('.scenario-2-control');

const scOneItem = $('.scenario-1-item');
const scTwoItem = $('.scenario-2-item');

const errBlock = $('.error-block');
const commonErrBlock = $('.form-wrapper .common-errors-block');

const btnLaunchRandom = $('.btn-launch-random');
const btnSpecifyAmount = $('.btn-specify-amount');
const btnAdd = $('.btn-add-variant');
const btnAddAuto = $('.btn-add-variants-auto');
const btnBackToInit = $('.btn-back-to-init');


// adds variants (scenario-1)

btnAdd.on('click', function() {
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


btnBackToInit.on('click', function() {
    eNode.trigger(customEvents.sc1);
    console.log(`E: ${customEvents.sc1}`); // test
});


eNode.on(customEvents.sc1, function() {
    customEvents.isScenarioOne = true;

    scOneNote.fadeIn();
    scTwoNote.fadeOut();

    scOneWrapper.fadeIn();
    scTwoWrapper.fadeOut();

    btnAddAuto.fadeOut();
    btnAdd.fadeIn();
});


eNode.on(customEvents.sc2, function() {
    customEvents.isScenarioOne = false;

    scOneNote.fadeOut();
    scTwoNote.fadeIn();

    scOneWrapper.fadeOut();
    scTwoWrapper.fadeIn();
    
    btnAddAuto.fadeIn();
    btnAdd.fadeOut();
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


// scenario-2: checking field with amount's value

$('#amount-of-variants').on('input', function() {
    // replace '10' to '100' after test
    if ( $(this).val() > 10 ) {
        btnAddAuto.attr('disabled', true);
        // error in modal?..
        commonErrBlock.text(errors.tooBigAmount).fadeIn();
        hideBlock(commonErrBlock);
    } else {
        btnAddAuto.attr('disabled', false);
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

let variantsAmount = 0;
let currentTextarea = '';

btnLaunchRandom.on('click', function() {
    // this handler is independent of scenarios

    if ( customEvents.isScenarioOne === true ) {
        variantsAmount = scOneItem.length;
        currentTextarea = scOneWrapper.find('.textarea');
        console.log(currentTextarea); // test
    } else {
        variantsAmount = scTwoItem.length;
        currentTextarea = scTwoWrapper.find('.textarea');
        console.log(currentTextarea); // test
    }

    currentTextarea.each(function() {
        if ( $(this).val() == '' ) {
            $(this).addClass('invalid');
        }
    });

    if ( $('.textarea').hasClass('invalid') ) {
        eNode.trigger('validationError', ['emptyField']);
        //return false;
    } else {
        // generates a pseudo random number of variant
        let randomNumOfVar = Math.random() * variantsAmount;
        randomNumOfVar = Math.floor(randomNumOfVar);
        console.log(`Random amount of vars is: ${randomNumOfVar}`); // test

        const selectedVarParent = currentTextarea.eq(randomNumOfVar).parent();
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
            $(this).parent().find(errBlock).text(err).fadeIn(); // test
        });

        hideErrorBlock();
    }
});
