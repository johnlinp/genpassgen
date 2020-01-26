var generatePasswordGenerator = function(length, upper, lower, number, symbol, symbols) {
    var symbolsString = 'r"' + symbols.replace(/"/g, '\\"').replace(/'/g, "'\\''") + '"';

    var codeLines = [];
    codeLines.push('import secrets');
    codeLines.push('import string');
    codeLines.push('candidates = []');
    if (upper) {
        codeLines.push('candidates.extend(string.ascii_uppercase)');
    }
    if (lower) {
        codeLines.push('candidates.extend(string.ascii_lowercase)');
    }
    if (number) {
        codeLines.push('candidates.extend(string.digits)');
    }
    if (symbol && symbols) {
        codeLines.push('candidates.extend(' + symbolsString + ')');
    }
    codeLines.push('while True:')
    codeLines.push('    choices = [secrets.choice(candidates) for _ in range(' + length + ')]');
    if (upper) {
        codeLines.push('    if not any(char in choices for char in string.ascii_uppercase):');
        codeLines.push('        continue');
    }
    if (lower) {
        codeLines.push('    if not any(char in choices for char in string.ascii_lowercase):');
        codeLines.push('        continue');
    }
    if (number) {
        codeLines.push('    if not any(char in choices for char in string.digits):');
        codeLines.push('        continue');
    }
    if (symbol && symbols) {
        codeLines.push('    if not any(char in choices for char in ' + symbolsString + '):');
        codeLines.push('        continue');
    }
    codeLines.push('    break');
    codeLines.push('password = "".join(choices)');
    codeLines.push('message = "Generated password: {0}".format(password)');
    codeLines.push('print("{1}\\n{0}\\n{1}".format(message, "-" * len(message)))');
    return "python3 -c '" + codeLines.join('\n') + "'";
};

var fillPasswordGenerator = function() {
    var passwordLength = document.getElementById('password-length');
    var includeUpperCases = document.getElementById('include-upper-cases');
    var includeLowerCases = document.getElementById('include-lower-cases');
    var includeNumbers = document.getElementById('include-numbers');
    var includeSymbols = document.getElementById('include-symbols');
    var symbolsIncluded = document.getElementById('symbols-included');

    var passwordGenerator = document.getElementById('password-generator');

    passwordGenerator.value = generatePasswordGenerator(
        passwordLength.value,
        includeUpperCases.checked,
        includeLowerCases.checked,
        includeNumbers.checked,
        includeSymbols.checked,
        symbolsIncluded.value
    );

    passwordGenerator.rows = passwordGenerator.value.split('\n').length;
};

var copyPasswordGeneratorToClipboard = function() {
    var passwordGenerator = document.getElementById('password-generator');
    passwordGenerator.select();
    document.execCommand('copy');
};

var registerUpdateToFillPasswordGenerator = function() {
    var numbers = [
        document.getElementById('password-length'),
    ];

    var checkboxes = [
        document.getElementById('include-upper-cases'),
        document.getElementById('include-lower-cases'),
        document.getElementById('include-numbers'),
        document.getElementById('include-symbols'),
    ];

    var texts = [
        document.getElementById('symbols-included'),
    ];

    var inputFields = [].concat(numbers).concat(checkboxes);

    inputFields.forEach(function(inputField) {
        inputField.addEventListener('change', function(evt) {
            if (!checkboxes.some(function(checkbox) { return checkbox.checked; })) {
                inputField.checked = 'true';
                return;
            }
            fillPasswordGenerator();
        });
    });

    texts.forEach(function(text) {
        text.addEventListener('keyup', function(evt) {
            fillPasswordGenerator();
        });
    });
};

var registerSymbolCheckboxToControlSymbolText = function() {
    var includeSymbols = document.getElementById('include-symbols');
    var symbolsIncluded = document.getElementById('symbols-included');

    includeSymbols.addEventListener('change', function(evt) {
        symbolsIncluded.disabled = (!includeSymbols.checked);
    });
};

var registerLengthChangeToUpdateLabel = function() {
    var passwordLength = document.getElementById('password-length');
    var passwordLengthLabel = document.getElementById('password-length-label');

    passwordLength.addEventListener('input', function(evt) {
        passwordLengthLabel.innerHTML = passwordLength.value;
    });
};

var registerCopyToClipboard = function() {
    var copyToClipboard = document.getElementById('copy-to-clipboard');
    copyToClipboard.addEventListener('click', function() {
        copyPasswordGeneratorToClipboard();
    });
};

var main = function() {
    registerUpdateToFillPasswordGenerator();
    registerSymbolCheckboxToControlSymbolText();
    registerLengthChangeToUpdateLabel();
    registerCopyToClipboard();
    fillPasswordGenerator();
};

main();
