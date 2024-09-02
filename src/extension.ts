import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "imageslider" is now active!');

	const disposable = vscode.commands.registerCommand('imageslider.SliderCompare', async (contextSelection: vscode.Uri, allSelections: vscode.Uri[])  => {

		if (allSelections.length !== 2) {
			vscode.window.showErrorMessage('Please select exactly two images.');
			return;
		}
		const left_image = allSelections[0];
		const right_image = allSelections[1];
		
		displayImageSlider(left_image, right_image);
	});

	context.subscriptions.push(disposable);
}

function displayImageSlider(left_image: vscode.Uri, right_image: vscode.Uri) {
    const panel = vscode.window.createWebviewPanel(
        'imageView',
        'Image Comparison Slider',
        vscode.ViewColumn.One,
        {
			enableScripts: true
		}
    );

    const left_image_src = panel.webview.asWebviewUri(left_image);
	const right_image_src = panel.webview.asWebviewUri(right_image);

    panel.webview.html = getWebviewContent(left_image_src, right_image_src);
}

function getWebviewContent(left_image_src: vscode.Uri, right_image_src: vscode.Uri) {
    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				
				<title>Image comparison slider</title>
				<style>
					:root {
						--slider-value: 50%;
					}
					.view {
						position: relative;
						width: 100%;
						height: 100vh;
						display: flex;
            			justify-content: center;
						align-items: center;
					}
					img {
                        position: absolute;
						object-fit: cover;
                    }
					.slider {
						position: absolute;
						width: 100%;
						height: 100%;
						appearance: none;
						opacity: 0;
						outline: none; 
					}
				</style>
			</head>
			<body>
				<div class="view">
					<img src="${left_image_src}" style="clip-path: inset(0 calc(100% - var(--slider-value)) 0 0);" />
					<img src="${right_image_src}" style="clip-path: inset(0 0 0 var(--slider-value));" />
					<input type="range" min="0" max="100" value="50" class="slider" id="myRange" oninput="adjustSlider(this.value)" />
				</div>
			</body>

			<script>
				function adjustSlider(value) {
					document.documentElement.style.setProperty('--slider-value', value + '%');
				}
    		</script>
			</html>`;
}

exports.activate = activate;
export function deactivate() {}
