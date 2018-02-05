# easy-copy-file

> easy copy files and directories

## Getting Started

```shell
npm install easy-copy-file --save-dev
```

### Usage Examples

`package.json`

```js

{
  "name": "demo",
  "version": "",
  "description": "",
  "main": "",
  "scripts": {
    "build": "node src/index.js --from build --to public"
  },
  "devDependencies": {
    "easy-copy-file": "^0.1.0"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "author": "dylan",
  "license": "ISC",
  "dependencies": {}
}
```

`--from` : directory name

`--to` : directory name

⚠ `--from` and `--to` is required
