import * as clipboardy from 'clipboardy';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

export function gptebug(): void {
    // Assuming the first argument is a comma-separated list of extensions
    const processArgs: string[] = process.argv.slice(2);
    const extensions: string[] = processArgs[0].split(',').map(ext => ext.trim());
    const searchPattern: string = `**/*.{${extensions.join(',')}}`;

    glob(searchPattern, { nodir: true }, (err: Error | null, files: string[]) => {
        if (err) {
            console.error(`Error finding files: ${err}`);
            return;
        }

        let contents: string = files.map(file => {
            const fileContents: string = fs.readFileSync(file, 'utf8');
            return `File: ${file}\n\n${fileContents}\n\n--- tebug ---\n`;
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
