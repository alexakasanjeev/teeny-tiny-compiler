# Teeny Tiny Compiler

This is a small practice compiler that converts lisp `(add 3 (subtract 4 2))` into c like `add(3, subtract(4, 2))` syntax.
This project was written following [TDD(Test Driven Development)](https://en.wikipedia.org/wiki/Test-driven_development) method. It uses [jest.js](https://jestjs.io) to test the implementation code.

[compiler tutorial link](https://github.com/jamiebuilds/the-super-tiny-compiler)

## Setup

1. Get the code

    ```bash
    git clone https://github.com/alexakasanjeev/teeny-tiny-compiler.git && cd teeny-tiny-compiler
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Run the project

    ```bash
    npm start
    ```
4. To run test

    ```bash
    npm test
    ```

## TODO
- [ ] Understand how `travser` and `transformer` function work and write your own implementation in `compiler.js`

## Acknowledgement

[the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler) by [Jamie Kyle](https://github.com/jamiebuilds)