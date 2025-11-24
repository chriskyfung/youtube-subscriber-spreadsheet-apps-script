Based on [EZ CLASP](https://github.com/cristobalgvera/ez-clasp) template

# 💻 TL;DR

This project is a [Google Apps Script](https://developers.google.com/apps-script) to extract and record the information of your YouTube subscribers from Gmail to Google Sheet.

```bash
git clone https://github.com/chriskyfung/youtube-subscriber-spreadsheet-apps-script.git
cd youtube-subscriber-spreadsheet-apps-script

npm install
npm run clasp:login # And access to your Google account
```

Run `npm run clasp:create` to create a new project. CLASP cli will prompt some project types, and select "sheets" to create a new Google Spreadsheet.

   After you run this script, inside the created `.clasp.json` file, I strongly recommend you to change attribute `rootDir` to `.`. This way you can share and move your project without any issues. This is a Google CLASP CLI trouble.

Push your JavaScript project to Google Apps Script using

   ```bash
   npm run push
   ```

   The **first time** you execute this command, CLASP cli will ask you to overwrite manifest file [`appsscript.json`](./appsscript.json) of the project, insert `y` key and press `enter`.

   This file contains the configuration required by Google to manage permissions and access to your project.

## Screenshots

![Screenshot of Google Spreadsheet](/assets/images/screenshot-gsheet.png)

## Language Support

| Language   | Search Query                                                       |
| ---------- | ------------------------------------------------------------------ |
| English    | Email subject: {_subscriber Name_} has subscribed to you on YouTube |
| 中文(香港) | 電郵主題: {_訂閱者名稱_} 訂閱了你的 YouTube 頻道                   |
| 中文(台灣) | 電郵主題: {_訂閱者名稱_} 訂閱了您的 YouTube 頻道                   |
