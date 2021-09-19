import * as vscode from 'vscode';
import axios from 'axios';
import { compressToEncodedURIComponent as lzCompress } from 'lz-string';

const BASE_URL = 'https://roblox-ts.com/playground/#code/';

const editor = vscode.window.activeTextEditor!;

interface UmaiResponseData {
	id: string;
	origin: string;
	terminus: string;
}

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
					'Open in browser',
					'Shorten url'
				)
				.then(async (selection) => {
					if (selection === 'Open in browser') {
						vscode.env.openExternal(vscode.Uri.parse(url));
					} else if (selection === 'Shorten url') {
						const { origin: shortUrl } = (
							await axios.post('https://api.umai.pw/v1/url', {
								url,
							})
						).data as UmaiResponseData;
						vscode.env.clipboard.writeText(`https://${shortUrl}`);
						vscode.window.showInformationMessage(
							'Shortened url copied to clipboard.'
						);
					}
				});
		}
	);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
