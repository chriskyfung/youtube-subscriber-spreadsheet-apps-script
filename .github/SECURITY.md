# Security Policy

## Reporting a Vulnerability

We take the security of this project seriously. If you discover any security vulnerabilities, please report them to us as soon as possible. We appreciate your efforts and will work with you to address any issues responsibly.

We encourage you to use GitHub's private vulnerability reporting feature. If this feature is enabled for the repository, you will find a "Report a vulnerability" button on the Security tab of the repository. This allows us to address the vulnerability privately before it is publicly disclosed.

Please include the following information in your report:
- A clear and concise description of the vulnerability.
- Steps to reproduce the vulnerability.
- The potential impact of the vulnerability.
- Any suggested remediations (if applicable).

We will acknowledge your report within 3 business days and provide an estimated timeline for resolution.

## Security Policy

This project adheres to the following security principles:

1.  **Least Privilege**: The Google Apps Script project operates with the minimum necessary permissions required for its functionality.
2.  **Input Validation**: All user inputs and external data are properly validated and sanitized to prevent injection attacks (e.g., XSS, SQL injection in external services).
3.  **Dependency Management**: Dependencies are regularly updated to mitigate known vulnerabilities.
4.  **Secure Configuration**: The project is configured to use secure settings for Google Apps Script and any integrated Google services.
5.  **Data Protection**: Sensitive data, if handled, is protected through encryption and restricted access. Avoid storing sensitive information directly in the script properties or user properties without proper encryption.
6.  **Error Handling**: Errors are handled gracefully to prevent information leakage that could aid attackers.

## Best Practices for Google Apps Script Security (Project-Specific)

For developers contributing to this Google Apps Script project, which interacts with **YouTube Data API** and **Google Sheets**, please consider the following security best practices:

-   **Avoid `eval()`**: Do not use `eval()` or similar functions with untrusted input.
-   **Service Accounts (if applicable)**: If interacting with Google APIs directly, consider using service accounts for server-to-server interactions, maintaining the principle of least privilege.
-   **OAuth Scopes**: Be mindful of the OAuth scopes requested by the Apps Script project. Only request the scopes absolutely necessary for the script's functionality.
-   **User Authorization**: When dealing with user-specific data, ensure proper user authorization flows are implemented.
-   **Data Handling (YouTube/Google Sheets)**: Ensure proper handling and protection of subscriber data and any other sensitive information retrieved from the YouTube Data API or stored in Google Sheets. Avoid logging sensitive data to Stackdriver or other public logs.
-   **External API Keys (e.g., YouTube API Key)**: Never hardcode API keys or sensitive credentials directly into the script. Use Script Properties (via `PropertiesService`) for sensitive configuration data (e.g., YouTube API keys) and ensure they are not committed to version control.
-   **Container-Bound Scripts (Recommended)**: This project is designed to be a container-bound script, meaning it is directly associated with a Google Sheet. Understand that container-bound scripts have inherent access to the document they are bound to. This simplifies deployment and interaction with the spreadsheet but requires extra vigilance in ensuring the script's permissions and data access are strictly limited to its intended functionality within that specific sheet. Avoid granting broader permissions than necessary.
-   **Add-ons and Web Apps**: If deploying this script as an Add-on or Web App, thoroughly review the security implications, especially regarding user impersonation and external requests.
-   **Code Review**: All code changes should undergo a thorough code review process to identify potential security weaknesses.

By following these guidelines, we aim to maintain a secure and reliable project.
