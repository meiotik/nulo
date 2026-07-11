const fileInput = document.getElementById('file-btn');
const clearBtn = document.getElementById('clear-btn');
const chipsDiv = document.getElementById('chip-container');
const dropZoneOverlay = document.getElementById('drop-zone-overlay');
let openFiles = [];

function unzipFiles(files) {
	if (files.length === 0) return;
	const allowedExtensions = /(\.csv|\.zip)$/i;
	Array.from(files).forEach(file => {
		if (allowedExtensions.exec(file.name)) {
			const isDuplicate = openFiles.some(f => f.name === file.name && f.size === file.size);
			if (!isDuplicate) {
				openFiles.push(file);
			}
		} else {
			console.warn(`File rejected: "${file.name}"`);
		}
	});
	showChips();
	fileInput.value = '';
}

function showChips() {
	chipsDiv.innerHTML = '';
	if (openFiles.length === 0) {
		clearBtn.style.display = 'none';
		return;
	}
	clearBtn.style.display = 'flex';
	openFiles.forEach((file, index) => {
		const chip = document.createElement('div');
		chip.className = 'file-chip';
		const textSpan = document.createElement('span');
		textSpan.className = 'chip-text';
		textSpan.title = file.name;
		textSpan.textContent = file.name;
		const removeBtn = document.createElement('button');
		removeBtn.className = 'chip-remove';
		removeBtn.innerHTML = '&#x1f5d9;&#xfe0f;';
		removeBtn.ariaLabel = `Remove ${file.name}`;
		removeBtn.addEventListener('click', () => removeFile(index));
		chip.appendChild(textSpan);
		chip.appendChild(removeBtn);
		chipsDiv.appendChild(chip);
	});
	console.log("Files staged:", openFiles);
}

function removeFile(index) {
	openFiles.splice(index, 1);
	showChips();
}

clearBtn.addEventListener('click', () => {
	openFiles = [];
	showChips();
});

fileInput.addEventListener('change', (e) => unzipFiles(e.target.files));

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	window.addEventListener(eventName, (e) => {
		e.preventDefault();
		e.stopPropagation();
	}, false);
});

let dragCounter = 0;

window.addEventListener('dragenter', () => {
	dragCounter++;
	dropZoneOverlay.classList.add('drag-active');
});

window.addEventListener('dragleave', () => {
	dragCounter--;
	if (dragCounter === 0) dropZoneOverlay.classList.remove('drag-active');
});

window.addEventListener('drop', (e) => {
	dragCounter = 0;
	dropZoneOverlay.classList.remove('drag-active');
	unzipFiles(e.dataTransfer.files);
});
