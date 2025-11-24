# 📩 YouTube Subscriber to Spreadsheet Google Apps Script

[![GitHub Workflow CI](https://github.com/chriskyfung/youtube-subscriber-spreadsheet-apps-script/actions/workflows/ci.yml/badge.svg)](https://github.com/chriskyfung/youtube-subscriber-spreadsheet-apps-script/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/chriskyfung/youtube-subscriber-spreadsheet-apps-script/graph/badge.svg)](https://codecov.io/github/chriskyfung/youtube-subscriber-spreadsheet-apps-script)
[![GitHub license](https://img.shields.io/github/license/chriskyfung/youtube-subscriber-spreadsheet-apps-script)](LICENSE)
[![Google Apps Script CLI](https://img.shields.io/badge/Google%20Apps%20Script%20CLI-clasp-4285F4?logo=google&logoColor=white)](https://developers.google.com/apps-script/guides/clasp)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7BA3E?style=flat&logo=prettier&logoColor=white)](https://prettier.io/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)


This project is a [Google Apps Script](https://developers.google.com/apps-script) designed to extract and record information about your YouTube subscribers from Gmail to a Google Sheet. It leverages the [Clasp CLI](https://developers.google.com/apps-script/guides/clasp) for seamless development and deployment.

## ✨ Features

*   **Automated Subscriber Tracking**: Automatically pulls subscriber information from YouTube notification emails in Gmail.
*   **Google Sheet Integration**: Records subscriber details (name, channel URL, subscription date) into a Google Sheet.
*   **Multi-language Support**: Configurable to support different languages for email parsing.
*   **Easy Deployment**: Uses Clasp for easy push and pull of code to Google Apps Script.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and deployment.

### 📝 Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
*   [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
*   [Clasp](https://developers.google.com/apps-script/guides/clasp) (Google Apps Script CLI)

    ```bash
    npm install -g @google/clasp
    ```

### ⚙️ Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/chriskyfung/youtube-subscriber-spreadsheet-apps-script.git
    cd youtube-subscriber-spreadsheet-apps-script
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Log in to Clasp:**

    ```bash
    npm run clasp:login
    ```

    This will open a browser window and ask you to log in to your Google account. Ensure you log in with the account you want to use for Google Apps Script.

4.  **Create a new Google Apps Script project:**

    ```bash
    npm run clasp:create
    ```

    Clasp CLI will prompt you to select a project type. Choose `"sheets"` to create a new Google Spreadsheet-bound script.

    *Self-Correction Note:* After creating the project, it is highly recommended to change the `rootDir` attribute in the generated `.clasp.json` file to `.`. This ensures better project portability and avoids potential issues with Clasp's directory handling.

    ```json
    {
      "scriptId": "YOUR_SCRIPT_ID",
      "rootDir": "."
    }
    ```

5.  **Push the project to Google Apps Script:**

    ```bash
    npm run push
    ```

    The **first time** you execute this command, Clasp CLI will ask you to overwrite the manifest file (`appsscript.json`) of the project. Type `y` and press `Enter`. This file contains the necessary configuration for Google to manage permissions and access to your script.

## 🛠️ Configuration

The script can be customized via the `src/config.js` and `src/constants.js` files.

### `src/config.js`

This file holds configuration for Gmail search queries and Spreadsheet settings.

### `src/constants.js`

This file defines the supported languages and the regular expressions used for parsing subscriber names.

## 🌐 Language Support

The script currently supports the following languages for parsing subscriber notification emails:

| Language     | Search Query Placeholder                                           |
| :----------- | :----------------------------------------------------------------- |
| English      | Email subject: `{_subscriber Name_} has subscribed to you on YouTube` |
| 中文(香港)   | 電郵主題: `{_訂閱者名稱_} 訂閱了你的 YouTube 頻道`                   |
| 中文(台灣)   | 電郵主題: `{_訂閱者名稱_} 訂閱了您的 YouTube 頻道`                   |

To add support for a new language, you would need to:
1.  Add the language code to the `LOCATES` array in `src/constants.js`.
2.  Add the corresponding localized phrase to the `LANG` object in `src/constants.js`.
3.  Potentially adjust the `regex` function if the email body structure for the new language significantly differs.

## 🔍 Troubleshooting

Here are some common issues and their solutions:

### `clasp:login` fails or authentication issues

*   **Issue**: You're having trouble logging in with `npm run clasp:login` or encountering authentication errors.
*   **Solution**:
    1.  Ensure you have a stable internet connection.
    2.  Try clearing your browser's cookies and cache before attempting to log in again.
    3.  Verify that you are logging in with the correct Google account that has access to Google Apps Script.
    4.  If the browser window doesn't open, try running `clasp login` directly in your terminal to see if there are any specific error messages.

### `npm run push` fails with permissions errors

*   **Issue**: The `npm run push` command gives errors related to insufficient permissions or API access.
*   **Solution**:
    1.  **Enable Google Apps Script API**: Go to the [Google Cloud Console](https://console.cloud.google.com/) -> APIs & Services -> Dashboard. Search for and ensure the "Google Apps Script API" is enabled for your project.
    2.  **Authorize Scopes**: When you first push the project, Google may ask for authorization for certain scopes (e.g., Gmail, Spreadsheets). Ensure you grant these permissions. If you previously denied them, you might need to revoke access for Clasp in your Google account settings and re-authenticate.
    3.  **Check `appsscript.json`**: Ensure your `appsscript.json` file (the manifest file) correctly defines the required [OAuth scopes](https://developers.google.com/apps-script/concepts/scopes). For example, to interact with Gmail and Spreadsheets, you'll need scopes like `https://www.googleapis.com/auth/gmail.readonly` and `https://www.googleapis.com/auth/spreadsheets`.

### Script runs locally but not on Google Apps Script

*   **Issue**: Your script works when tested locally (if applicable), but fails or doesn't behave as expected after `npm run push` and running it in Google Apps Script environment.
*   **Solution**:
    1.  **Check Logs**: Access the Google Apps Script project online (script.google.com), go to "Executions" or "Logs" to see detailed error messages.
    2.  **Manifest File (`appsscript.json`)**: Ensure your `appsscript.json` correctly defines all necessary services, triggers, and OAuth scopes.
    3.  **Environment Differences**: Google Apps Script environment is server-side JavaScript. Some Node.js specific features or global objects might not be available. Ensure your code is compatible with the Apps Script runtime.
    4.  **Time-driven Triggers**: If your script is meant to run automatically, verify that you have set up a time-driven trigger in the Google Apps Script editor (via the clock icon on the left sidebar).

### Incorrect `rootDir` in `.clasp.json`

*   **Issue**: After `npm run clasp:create`, the `rootDir` in `.clasp.json` is not set to `.`, leading to deployment issues.
*   **Solution**: Manually edit the `.clasp.json` file in your project's root directory and change the `rootDir` value to `.` (a single dot). This tells Clasp to consider your entire project directory as the root for deployment.

    ```json
    {
      "scriptId": "YOUR_SCRIPT_ID",
      "rootDir": "."
    }
    ```

## 📸 Screenshots

![Screenshot of Google Spreadsheet](/assets/images/screenshot-gsheet.png)

## 📄 License

This project is licensed under the [GNU Affero General Public License Version 3 (AGPL-3.0)](LICENSE).

The AGPL-3.0 is a strong copyleft license that ensures software freedom for all users. Key aspects include:
*   **Source Code Availability**: Anyone who uses the software over a network must be provided with the full source code.
*   **Freedom to Share and Change**: Users are free to run, study, share, and modify the software.
*   **Derivative Works**: Any derivative works must also be licensed under AGPL-3.0.
*   **Network Use**: If you modify the software and run it as a service over a network, you must offer the modified source code to the users of that service. This is the main distinction from the GNU General Public License (GPL).

For more details, please refer to the [full license text](LICENSE).

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please follow these steps:

1.  **Fork** the repository.
2.  **Create a new branch** for your feature or fix: `git checkout -b feature/your-feature-name` or `git checkout -b fix/bug-description`.
3.  **Make your changes** and ensure they are well-tested.
4.  **Commit your changes** with a clear and descriptive commit message.
5.  **Push your branch** to your forked repository.
6.  **Open a Pull Request** to the `main` branch of this repository.

Please ensure your code adheres to the project's coding style and includes appropriate documentation and tests.
