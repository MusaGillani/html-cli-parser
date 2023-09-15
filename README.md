# HTML Data Extractor CLI

This command-line interface (CLI) app is built with Node.js and utilizes Cheerio to parse HTML files and extract specific text data from them.

## Installation

Before using the app, make sure you have Node.js installed on your system.

1. Clone this repository:

   ```bash
   git clone https://github.com/MusaGillani/html-cli-parser.git
   ```

2. Navigate to project dir

   ```bash
   cd html-cli-parser
   ```

3. install the required dependencies
   ```bash
   npm install
   ```

## Usage

To extract text data from an HTML file, use the following command:

```bash
    node app.js path/to/your/html-file.html
```

Replace path/to/your/html-file.html with the actual path to the HTML file you want to parse.

The app will load the HTML file, parse its DOM structure using Cheerio, and extract specific nodes to display the extracted text data.

## Example

Suppose you have an HTML file named example.html:

```html
<!doctype html>
<html>
  <body>
    <h1>Hello, World!</h1>
    <p>This is a sample HTML file.</p>
  </body>
</html>
```

Running the app with the following command:

```bash
npm start -- example.html
```

will produce the following output:

```txt
Extracted Text Data:
- Hello, World!
- This is a sample HTML file.
```
