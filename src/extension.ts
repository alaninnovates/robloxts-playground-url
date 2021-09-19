import * as vscode from 'vscode';
import { compressToEncodedURIComponent as lzCompress } from 'lz-string';

const BASE_URL = 'https://roblox-ts.com/playground/#code/';

const editor = vscode.window.activeTextEditor!;

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		'robloxts-playground-url.createPlayground',
		() => {
			const text =
				editor.document.getText(editor.selection) ||
				editor.document.getText();
			const url = `${BASE_URL}${lzCompress(text)}`;
			vscode.env.clipboard.writeText(url);
			vscode.window
				.showInformationMessage(
					'Playground URL copied to clipboard.',
					'Open in browser'
				)
				.then((selection) => {
					if (selection === 'Open in browser') {
						vscode.env.openExternal(vscode.Uri.parse(url));
					}
				});
		}
	);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
