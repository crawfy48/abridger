var omitApplier;
var omitOn=false;

function uploadBook(that) {
	if(that.files && that.files[0]){
		var reader = new FileReader();
		reader.onload = function (e) {  
			var output=e.target.result;
			document.getElementById('book').innerHTML= output;
		};
		reader.readAsText(that.files[0]);
	}
}
function downloadHtml() {
	var a = document.body.appendChild(document.createElement("a"));
	a.download = "text.html";
	a.href = "data:text/html," + encodeURIComponent(document.getElementById("book").innerHTML);
	a.click();
}
function downloadText() {
	var a = document.body.appendChild(document.createElement("a"));
	a.download = "text.txt";
	a.href = "data:text/plain," + encodeURIComponent(document.getElementById("book").textContent);
	a.click();
}
function switchMode() {
	if(omitOn) {
		expandAll();
		document.getElementById('modeButton').innerHTML="Switch to Read Mode";
		document.getElementById('viewPanel').style.display = 'none';
		document.getElementById('editPanel').style.display = 'inline';
	}
	else {
		document.getElementById('modeButton').innerHTML="Switch to Edit Mode";
		document.getElementById('viewPanel').style.display = 'inline';
		document.getElementById('editPanel').style.display = 'none';
	}
	omitOn=!omitOn
}
function expandAll() {
	var allFragments = document.getElementsByClassName("omit");
	for (var i = 0; i < allFragments.length; i++) {
		var e=allFragments[i];
		if(e.innerHTML.charAt(0)=='[') {
			temporaryVariable=e.innerHTML;
			e.innerHTML=e.title;
			e.title=temporaryVariable;
		}
	}
}
function collapseAll() {
	if(omitOn) {
		var allFragments = document.getElementsByClassName("omit");
		for (var i = 0; i < allFragments.length; i++) {
			var e=allFragments[i];
			if(e.title.charAt(0)=='[') {
				temporaryVariable=e.innerHTML;
				e.innerHTML=e.title;
				e.title=temporaryVariable;
			}
		}
	}
}
function toggleOmit(e) {
	if(omitOn) {
		e=window.event? event.srcElement: e.target;
		if(e.className && e.className=='omit') {
			temporaryVariable=e.innerHTML;
			e.innerHTML=e.title;
			e.title=temporaryVariable;
		}
	}
	else {
		var omitDesc = document.getElementById('fragDesc').value;
		omitApplier = rangy.createClassApplier("omit", {
			elementProperties: {
				title: "[" + omitDesc + "]"
			}
		});
		if(document.getElementById('wordWrapping').checked) {
			rangy.getSelection().expand("word", {
					wordOptions: {
						wordRegex: /[a-z0-9]+\S*/gi
					}
			});
			rangy.getSelection().expand("word", {
					wordOptions: {
						includeTrailingSpace: true
					}
			});
		}
		omitApplier.toggleSelection();
	}
}
window.onload = function() {
	rangy.init();
	var classApplierModule = rangy.modules.ClassApplier;

	if (rangy.supported && classApplierModule && classApplierModule.supported) {
		omitApplier = rangy.createClassApplier("omit", {
			elementProperties: {
				title: '[...]'
			}
		});
	}
	switchMode();
};