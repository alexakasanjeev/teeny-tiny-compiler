const { tokenzier, compiler, codeGenerator, generateAbstractSyntaxTree }  = require('./compiler');
const { transformer } = require('./lib/the-super-tiny-compiler');

describe('Compiler', () => {
    // Unit test: add description
    describe('Parsing', () => {
        test('testing tokenzier function', () => {
            // setup
            const codeString = '(add 2 (subtract 4 3))';
            const expectedResult = [
                { type: 'paren', value: '(' },
                { type: 'name', value: 'add' },
                { type: 'number', value: '2' },
                { type: 'paren', value: '(' },
                { type: 'name', value: 'subtract' },
                { type: 'number', value: '4' },
                { type: 'number', value: '3' },
                { type: 'paren', value: ')' },
                { type: 'paren', value: ')' },
            ];
    
            // excercise
            const tokens = tokenzier(codeString);
    
            // check
            expect(tokens).toEqual(expectedResult);
        });

        test('testing generateAbstractSyntaxTree function', () => {
            // setup
            const tokens = [
                { type: 'paren', value: '(' },
                { type: 'name', value: 'add' },
                { type: 'number', value: '2' },
                { type: 'paren', value: '(' },
                { type: 'name', value: 'subtract' },
                { type: 'number', value: '4' },
                { type: 'number', value: '3' },
                { type: 'paren', value: ')' },
                { type: 'paren', value: ')' },
            ];
            const expectedResult = {
                type: 'Program',
                body: [
                    {
                        type: 'CallExpression',
                        name: 'add',
                        params: [
                            {
                                type: 'NumberLiteral',
                                value: '2'
                            },
                            {
                                type: 'CallExpression',
                                name: 'subtract',
                                params: [
                                    {
                                        type: 'NumberLiteral',
                                        value: '4'
                                    },
                                    {
                                        type: 'NumberLiteral',
                                        value: '3',
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
    
            // exercise
            const result = generateAbstractSyntaxTree(tokens);
    
            //check
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Transformation', () => {
        test('transform ast into C style ast', () => {
            // setup
            const abstractSyntaxTree = {
                type: 'Program',
                body: [{
                    type: 'CallExpression',
                    name: 'add',
                    params: [
                        {
                            type: 'NumberLiteral',
                            value: '2'
                        },
                        {
                            type: 'CallExpression',
                            name: 'subtract',
                            params: [
                                {
                                    type: 'NumberLiteral',
                                    value: '4'
                                },
                                {
                                    type: 'NumberLiteral',
                                    value: '3'
                                }
                            ]
                        }
                    ]
                }]
            };

            const expectedResult = {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'add'
                        },
                        arguments: [
                            {
                                type: 'NumberLiteral',
                                value: '2',
                            },
                            {
                                type: 'CallExpression',
                                callee: {
                                    type: 'Identifier',
                                    name: 'subtract'
                                },
                                arguments: [
                                    {
                                        type: 'NumberLiteral',
                                        value: '4',
                                    },
                                    {
                                        type: 'NumberLiteral',
                                        value: '3',
                                    }
                                ]
                            }
                        ]
                    }
                }]
            };

            // exercise
            const result = transformer(abstractSyntaxTree);

            // check
            expect(result).toEqual(expectedResult);
        });
    });

    describe('Code generation', () => {
        test('convert ast to C style code', () => {
            // setup
            const abstractSyntaxTree = {
                type: 'Program',
                body: [{
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: 'add'
                        },
                        arguments: [
                            {
                                type: 'NumberLiteral',
                                value: '2',
                            },
                            {
                                type: 'ExpressionStatement',
                                expression: {
                                    type: 'CallExpression',
                                    callee: {
                                        type: 'Identifier',
                                        name: 'subtract'
                                    },
                                    arguments: [
                                        {
                                            type: 'NumberLiteral',
                                            value: '4',
                                        },
                                        {
                                            type: 'NumberLiteral',
                                            value: '3',
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }]
            };
            const expectedResult = 'add(2, subtract(4, 3))';

            // exercise
            const result = codeGenerator(abstractSyntaxTree)[0];

            //check
            expect(result).toBe(expectedResult);
        });
    });


    // Integration test: add description
    test('compile \"add 2 subtract 4 3\" into \"add(2, subtract(4, 3)\"', () => {
        // setup
        const codeToCompile = '(add 2 (subtract 4 3))';
        const expectedResult = 'add(2, subtract(4, 3))';

        // exercise
        const result = compiler(codeToCompile)[0];

        // check
        expect(result).toBe(expectedResult);

    });
});