
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
selenium-project
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

`selenium-side-converter convert -i target.side -o output.side`

If your side file has command like below, Replace template in setting files. 

Converting require setting files. There are file.json, xpath.json, text.json in ./settings by default loaded.

*inputs/target.side*
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
  
*settings/xpath.json*
```json
{
    "target": {
        "MESSAGE_XPATH": "//p[@id='message-xpath']"
    }
}
```
  
*settings/text.json*
```json
{
    "target": {
        "MESSAGE_TEXT": "message text"
    }
}
```

### Converting side files

`selenium-side-converter convert --all`

Convert all files under the inputs directory. The converted file is placed under outputs in the same directory structure. It also corresponds to the json structure. For example. like below. And outputs, inputs directory etc. can be changed in the `ssconfig.json`.

```
selenium-project
├── files
│   └── example-input-picture.jpg
├── inputs
│   └── test_page
│       └── target.side
├── outputs
│   └── test_page
│       └── target.side
```
  
*settings/file.json*
```json
{
    "test-page": {
        "target": {
            "test_picture": "example-input-picture.jpg"
        }
    }
}
```
  
*outputs/test_page/target.side*
```json
{
    "id": "e506b2b3-6901-4cfa-a3bb-301352e1e6f0",
    "comment": "",
    "command": "type",
    "target": "//input[@id='upload-form']",
    "targets": [],
    "value": "/your_pc_absolute_path/files/example-input-picture.jpg"
}
```

### Merging side files

`selenium-side-converter merge --tests -o merged.side file1.side file2.side file3.side`

It recursively merges Source file of file2.side, file2.side into the destination file file1.side and so generated merged.side. In this example, merging tests key only.
