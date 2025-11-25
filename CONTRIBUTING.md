# Contributing to YouTube Subscriber Spreadsheet Apps Script

First off, thank you for considering contributing to this project! Your help is greatly appreciated.

## Code of Conduct

This project and everyone participating in it is governed by a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue on our [issue tracker](https://github.com/chriskyfung/youtube-subscriber-spreadsheet-apps-script/issues). Please include a clear title, a description of the bug, and steps to reproduce it.

### Suggesting Enhancements

If you have an idea for an enhancement, please open an issue on our [issue tracker](https://github.com/chriskyfung/youtube-subscriber-spreadsheet-apps-script/issues). Describe your suggestion and why it would be beneficial.

### Pull Requests

We welcome pull requests! Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a pull request.

## Development Setup

To get started with the development, you'll need to have [Node.js](https://nodejs.org/) (version >= 20.0.0) and [npm](https://www.npmjs.com/) installed.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/chriskyfung/youtube-subscriber-spreadsheet-apps-script.git
    cd youtube-subscriber-spreadsheet-apps-script
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

### Available Scripts

This project uses several npm scripts to streamline development:

-   `npm run build`: Build the project using Rollup.
-   `npm test`: Run tests with Jest.
-   `npm run lint:check`: Check for linting errors with ESLint.
-   `npm run lint:fix`: Automatically fix linting errors.
-   `npm run format:check`: Check for formatting issues with Prettier.
-   `npm run format:fix`: Automatically fix formatting issues.
-   `npm run check:all`: Run all checks (linting, formatting, types, and tests).

## Coding Style

We use [Prettier](https://prettier.io/) for code formatting and [ESLint](https://eslint.org/) for linting. Please make sure your code adheres to these standards before submitting a pull request. You can use the `format:fix` and `lint:fix` scripts to automatically format your code.

A pre-commit hook is set up with Husky and lint-staged to automatically format and lint your staged files.

## Pull Request Guidelines

Before you submit a pull request, please make sure you have done the following:

-   Run `npm run check:all` to ensure all checks pass.
-   Update the documentation if you have made any changes that require it.
-   Ensure your pull request has a clear title and description.
