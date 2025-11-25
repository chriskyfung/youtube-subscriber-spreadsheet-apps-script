---
name: Bug Report
about: Create a report to help us improve
title: '[Bug]: '
labels: 'bug'
assignees: ''

---

### 1. Type of Issue

Please check the box that best describes the issue. This helps us understand where to look.
- [ ] **Runtime Bug**: An issue with the script when it's running in the Google Apps Script environment (after `npm run push`).
- [ ] **Local Development Bug**: An issue with the local development setup (e.g., `npm install`, `npm test`, `npm run build`, linting, formatting).

---

### 2. Bug Description

A clear and concise description of what the bug is.

---

### 3. Environment

Please provide the following details about your development environment.
 - **Node.js version**: `node --version`
 - **npm version**: `npm --version`
 - **`@google/clasp` version**: `clasp --version`
 - **OS**: (e.g., Windows 10, macOS Sonoma)

---

### 4. For Runtime Bugs

***(Please fill out this section ONLY if you checked "Runtime Bug")***

**To Reproduce**
1. Trigger used (e.g., time-based, manual execution from the editor).
2. Function executed.
3. Steps to reproduce the error.

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Logs from Google Apps Script Executions**
Please provide any relevant logs from the **Executions** page in the Google Apps Script editor. This is crucial for debugging.
*Note: Be sure to remove any sensitive personal information from the logs before posting.*
```
(Paste your GAS logs here)
```

**Configuration**
Provide relevant (non-sensitive) parts of your configuration from `src/config.js` or `src/constants.js`.
*Warning: Do not post any private keys, credentials, or personal information.*
```javascript
// Example from src/constants.js
const LOCALE = 'en';
```

---

### 5. For Local Development Bugs

***(Please fill out this section ONLY if you checked "Local Development Bug")***

**Command Executed**
Which `npm` script or command did you run? (e.g., `npm test`, `npm run build`, `npm run lint:fix`)

**Terminal Output / Error Logs**
Please paste the full terminal output, including the error message.
```shell
(Paste your full terminal output here)
```

**Relevant Configuration**
If the issue is related to a specific tool, please paste the relevant configuration file content.
(e.g., `jest.config.js`, `rollup.config.js`, `.eslintrc.cjs`, `.prettierrc.js`)
```javascript
// Paste relevant config file content here
```

---

### 6. Screenshots & Additional Context

**(Optional)** If applicable, add screenshots to help explain your problem. Add any other context about the problem here.
