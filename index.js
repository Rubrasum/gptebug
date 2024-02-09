import clipboardy from 'clipboardy';
import glob from 'glob';
import fs from 'fs';
import path from 'path';

export function gptebug() {
    const processArgs = process.argv.slice(2);
    const extensions = processArgs[0].split(',').map(ext => ext.trim()); // Assuming the first argument is the extensions separated by commas
    const searchPattern = `**/*.{${extensions.join(',')}}`; // Creates a pattern like **/*.ts for TypeScript files

    glob(searchPattern, { nodir: true }, (err, files) => {
        if (err) {
            console.error(`Error finding files: ${err}`);
            return;
        }

        let contents = files.map(file => {
            const fileContents = fs.readFileSync(file, 'utf8');
            return `File: ${file}\n\n${fileContents}\n\n--- tebug ---\n`; // Prepends the file name and appends the separator
        }).join('\n');

        // Copy the concatenated file contents to the clipboard
        try {
            clipboardy.writeSync(contents);
            console.log(`Copied to clipboard!`);
        } catch (err) {
            console.error(`Error copying to clipboard: ${err.message}`);
        }
    });
}
