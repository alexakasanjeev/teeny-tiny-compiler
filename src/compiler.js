const { transformer } = require('./lib/the-super-tiny-compiler');

const codeToCompile = '(add 2 (subtract 4 3))';

const isNumeric = character => /[0-9]/.test(character);
const isAlphabet = character => /[a-z]/i.test(character);

const createToken = (type, value)  => ({ type, value });

// TODO Implement string tokens also `(concat "foo" "baz")`
const tokenzier = string => {
    const tokens = [];

    let currentIndex = 0;

    while(currentIndex < string.length) {
        let character = string.charAt(currentIndex);
        // Check for parentheses
        if(character === '(' || character === ')'){
            tokens.push(createToken('paren', character));
            currentIndex++;
            continue;
        }
        // Check for numbers
        if(isNumeric(character)) {
            let value = '';
            do {
                value += character;
                character = string.charAt(++currentIndex);
            } while(isNumeric(character));
            tokens.push(createToken('number', value));
            continue;
        }
        // Check for alphabets
        if(isAlphabet(character)) {
            let value = '';
            do {
                value += character;
                character = string.charAt(++currentIndex);
            } while(isAlphabet(character));
            tokens.push(createToken('name', value));
        }
        currentIndex++;
    }

    return tokens;

};

const generateAbstractSyntaxTree = tokens => {
    const abstractSyntaxTree = {};
    abstractSyntaxTree.type = 'Program';
    abstractSyntaxTree.body = [];
    let currentIndex = 0;

    function walk() {
        let token = tokens[currentIndex];

        if(token.type === 'number') {
            currentIndex++;
            return {
                type: 'NumberLiteral',
                value: token.value,
            };
        }

        if(token.type === 'string') {
            currentIndex++;
            return {
                type: 'StringLiteral',
                value: token.value,
            };
        }

        if(token.type === 'paren' && token.value === '(') {
            token = tokens[++currentIndex];

            let node = {
                type: 'CallExpression',
                name: token.value,
                params: [],
            }

            token = tokens[++currentIndex];

            while((token.type !== 'paren') || (token.type === 'paren' && token.value !== ')')) {
                node.params.push(walk());
                token = tokens[currentIndex];
            }
            currentIndex++;
            return node;
        }

        throw new TypeError(token.type);
    }

    while(currentIndex < tokens.length) {
        abstractSyntaxTree.body.push(walk()); // currentIndex value will be incremented inside walk function
    }

    return abstractSyntaxTree;
};

const parser = string => {
    const tokens = tokenzier(string);
    return generateAbstractSyntaxTree(tokens);
};

const codeGenerator = function codeGenerator(node) {
    switch(node.type) {
        case 'Program':
            return node.body.map(codeGenerator);
        case 'ExpressionStatement':
            return codeGenerator(node.expression);
        case 'CallExpression':
            return (node.callee.name +
            '(' +
            node.arguments.map(codeGenerator).join(', ')+
            ')');
        case 'Identifier':
            return node.name;
        case 'NumberLiteral':
            return node.value;
        case 'StringLiteral':
            return '"' + node.value + '"';
        default:
            throw new TypeError(node.type);
    }
};

const compiler = string => {
    const abstractSyntaxTree = parser(string);

    const newAbstractSyntaxTree = transformer(abstractSyntaxTree);

    const newCode = codeGenerator(newAbstractSyntaxTree);

    return newCode;
};

compiler(codeToCompile);

module.exports = {
    tokenzier,
    generateAbstractSyntaxTree,
    transformer,
    codeGenerator,
    compiler,
};