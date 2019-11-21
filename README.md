
# Selenium Side Converter

## Installation

`yarn global add selenium-side-runner`

or

`npm install -g selenium-side-runner`

## Usage

### Create Project

`selenium-side-converter create ./project-name`

The following directory will be created.

```
project-name
├── files
├── inputs
├── outputs
├── settings
│   ├── file.json
│   ├── text.json
│   └── xpath.json
└── ssconfig.json
```

### Converting template in side file

`selenium-side-converter convert -i target.side

If your side file has command like below, Replace template in setting files. 

Converting require setting files. There are file.json, xpath.json, text.json in ./settings by default loaded.

*target.side*
```json
{
    "id": "e506b2b3-6901-4cfa-a3bb-301352e1e6f0",
    "comment": "",
    "command": "assertText",
    "target": "{xpath:MESSAGE_XPATH}",
    "targets": [],
    "value": "{text:MESSAGE_TEXT}"
}
```

*xpath.json*
```json
{
    "target": {
        "MESSAGE_XPATH": "//p[@id='message-xpath']"
    }
}
```

*text.json*
```json
{
    "target": {
        "MESSAGE_TEXT": "message text"
    }
}
```

### Converting side files

`selenium-side-converter convert --all`

