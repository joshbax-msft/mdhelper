'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mdhelper" is now active!');

    let disposable_bold = vscode.commands.registerCommand('extension.bold', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let sel: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < sel.length; x++) {
                if(sel[x].isEmpty) { ToggleBoldWord(d, edit, sel[x]); }                
                else { ToggleBoldSelection(d, edit, sel[x]); }  
            }
        });
    });
    
    let disposable_italicize = vscode.commands.registerCommand('extension.italicize', () => {
        let e = vscode.window.activeTextEditor;
        let d = e.document;
        let sel = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < sel.length; x++) {
                if(sel[x].isEmpty) { ToggleItalicsWord(d, edit, sel[x]); }                
                else { ToggleItalicsSelection(d, edit, sel[x]); }  
            }
        });
    });
    
    let disposable_toupper = vscode.commands.registerCommand('extension.toupper', () => {
        let e = vscode.window.activeTextEditor;
        let d = e.document;
        let sel = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < sel.length; x++) {
                let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
                edit.replace(sel[x], txt.toUpperCase());
            }
        });
    });
    
    let disposable_tolower = vscode.commands.registerCommand('extension.tolower', () => {
        let e = vscode.window.activeTextEditor;
        let d = e.document;
        let sel = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < sel.length; x++) {
                let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
                edit.replace(sel[x], txt.toLowerCase());
            }
        });
    });

    let disposable_tounorderedlist = vscode.commands.registerCommand('extension.tounorderedlist', () => {
        let e = vscode.window.activeTextEditor;
        let d = e.document;
        let sel = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < sel.length; x++) {
                let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
                let txtTrimmed: string = txt.trim();
                // if(!IsList(txtTrimmed))
                // {
                    let txtReplace = txt.replace(txtTrimmed, ConvertToUnorderedList(txtTrimmed));
                    edit.replace(sel[x], txtReplace);
                // }
            }
        });
    });
    
    let disposable_toorderedlist = vscode.commands.registerCommand('extension.toorderedlist', () => {
        let e = vscode.window.activeTextEditor;
        let d = e.document;
        let sel = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < sel.length; x++) {
                let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
                let txtTrimmed: string = txt.trim();
                // if(!IsList(txtTrimmed))
                // {
                    let txtReplace: string = txt.replace(txtTrimmed, ConvertToOrderedList(txtTrimmed));
                    edit.replace(sel[x], txtReplace);
                // }
            }
        });
    });
    
    let disposable_tolink = vscode.commands.registerCommand('extension.tolink', () => {
        let e = vscode.window.activeTextEditor;
        let d = e.document;
        let sel = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < sel.length; x++) {
                let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
                if(!ContainsLink(txt))
                {
                    let txtReplace: string = "[" + txt + "]()";
                    edit.replace(sel[x], txtReplace);
                }
            }
        });
    });
    
    let disposable_toimagelink = vscode.commands.registerCommand('extension.toimagelink', () => {
        let e = vscode.window.activeTextEditor;
        let d = e.document;
        let sel = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < sel.length; x++) {
                let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
                if(!ContainsImageLink(txt))
                {
                    let txtReplace: string = "![" + txt + "](path/to/image.png)";
                    edit.replace(sel[x], txtReplace);
                }
            }
        });
    });
    
    context.subscriptions.push(disposable_bold);
    context.subscriptions.push(disposable_italicize);
    context.subscriptions.push(disposable_toupper);
    context.subscriptions.push(disposable_tolower);
    context.subscriptions.push(disposable_tounorderedlist);
    context.subscriptions.push(disposable_toorderedlist);
    context.subscriptions.push(disposable_tolink);
    context.subscriptions.push(disposable_toimagelink);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function ConvertToUnorderedList(txtTrimmed: string)
{
    let txtTrimmedLines: string[] = txtTrimmed.split("\n");
    let expression_initial_whitespace: RegExp = new RegExp("^[ ]*");
    let expression_list_line_item: RegExp = new RegExp("^([ ]*)([0-9]*\\.|-|\\*)(.*)");    
    
    for(let i = 0; i < txtTrimmedLines.length; i++)
    {
        var matches = txtTrimmedLines[i].match(expression_list_line_item);
        if (matches == null)
        {
            // not already a list item; insert a dash and space before the first non-whitespace character
            matches = txtTrimmedLines[i].match(expression_initial_whitespace);
            txtTrimmedLines[i] = txtTrimmedLines[i].substr(0, matches[0].length) + "- " + txtTrimmedLines[i].substr(matches[0].length);
        }
        else
        {
            // already a list item; convert initial character(s) to dash for consistency
            txtTrimmedLines[i] = txtTrimmedLines[i].replace(expression_list_line_item, "$1-$3");
        }
    }
    
    return txtTrimmedLines.join("\n");
}

function ConvertToOrderedList(txtTrimmed: string, startingIndex: number = 0)
{
    let txtTrimmedLines: string[] = ConvertToUnorderedList(txtTrimmed).split("\n");
    ConvertToOrderedSublist(txtTrimmedLines, 0);
    return txtTrimmedLines.join("\n");
}

function ConvertToOrderedSublist(txtTrimmedLines: string[], startingIndex: number)
{
    // returns the total number of processed items; used by parent to increment list processing position
    let expression: RegExp = new RegExp("^([ ]*)-(.*)");
    let currentIndex: number = startingIndex;
    let currentIndent: number;
    let currentOrderNumber: number = 1;
    
    let itemsProcessed: number = 0;

    // process first line
    var matches = txtTrimmedLines[currentIndex].match(expression); 
    currentIndent = matches[1].length;
    
    txtTrimmedLines[currentIndex] = txtTrimmedLines[currentIndex].replace(expression, "$1" + currentOrderNumber.toString() + ".$2");
    currentIndex++;
    currentOrderNumber++;
    itemsProcessed++;
    
    if(currentIndex < txtTrimmedLines.length)
    {
        var matches = txtTrimmedLines[currentIndex].match(expression);
        while(matches[1].length >= currentIndent && currentIndex < txtTrimmedLines.length)
        {
            if(matches[1].length == currentIndent)
            {
                // sibling
                txtTrimmedLines[currentIndex] = txtTrimmedLines[currentIndex].replace(expression, "$1" + currentOrderNumber.toString() + ".$2");
                currentIndex++;
                currentOrderNumber++;
                itemsProcessed++;
                if(currentIndex < txtTrimmedLines.length)
                {
                    matches = txtTrimmedLines[currentIndex].match(expression);
                }
            }
            else
            {
                // new child list
                let subitemsProcessed: number = ConvertToOrderedSublist(txtTrimmedLines, currentIndex); 
                currentIndex += subitemsProcessed;
                itemsProcessed += subitemsProcessed;
                if(currentIndex < txtTrimmedLines.length)
                {
                    matches = txtTrimmedLines[currentIndex].match(expression);
                }
            }
        }
    }
    
    return itemsProcessed;
}

function ToggleBoldWord(d: vscode.TextDocument, e: vscode.TextEditorEdit, s: vscode.Selection) {
    // replace selection object based on cursor position, preceding/following space positions
    let txtAll: string = d.getText(new vscode.Range(s.active.line, 0, s.active.line + 1, 0));
    let spacePreceding: number = txtAll.lastIndexOf(' ', s.start.character);
    if(spacePreceding == -1) { spacePreceding = 0; }
    let spaceFollowing: number = txtAll.indexOf(' ', s.start.character);
    if(spaceFollowing == -1) { spaceFollowing = txtAll.length - 1; }
    
    s = new vscode.Selection(new vscode.Position(s.active.line, spacePreceding + 1), new vscode.Position(s.active.line, spaceFollowing));
    ToggleBoldSelection(d, e, s);
    // this isn't working, obvious selection length issues aside
    s = new vscode.Selection(s.start, new vscode.Position(s.end.line, s.end.character + 4));
}

function ToggleBoldSelection(d: vscode.TextDocument, e: vscode.TextEditorEdit, s: vscode.Selection) {
    let txt: string = d.getText(new vscode.Range(s.start, s.end));
    let txtTrimmed: string = txt.trim();
    let txtReplace: string;
                    
    if(IsBold(txtTrimmed)) {
        let boldStyle = txtTrimmed.substring(0, 2);
        let firstBold = txt.indexOf(boldStyle);
        let lastBold = txt.lastIndexOf(boldStyle);
        let textAfterLastBold: string;
        if(txt.length > lastBold + 1) { textAfterLastBold = txt.substring(lastBold + 2); }
        txtReplace = txt.substring(0, firstBold) + txt.substring(firstBold + 2, lastBold) + textAfterLastBold;
    }
    else if (IsItalicizedAndBold(txtTrimmed)) {
        let boldStyle = txtTrimmed.substring(1, 3);
        let firstBold = txt.indexOf(boldStyle);
        let lastBold = txt.lastIndexOf(boldStyle);
        let textAfterLastItalics: string = txt.substring(lastBold + 3);
        txtReplace = "_" + txt.substring(3, lastBold) + "_" + textAfterLastItalics;
    }
    else {
        let txtStripped = txtTrimmed.split("**").join("").split("__").join("");
        txtReplace = txt.replace(txtTrimmed, "**" + txtStripped + "**");                   
    }
                    
    e.replace(s, txtReplace); 
}

function ToggleItalicsWord(d: vscode.TextDocument, e: vscode.TextEditorEdit, s: vscode.Selection) {
    // replace selection object based on cursor position, preceding/following space positions
    let txtAll: string = d.getText(new vscode.Range(s.active.line, 0, s.active.line + 1, 0));
    let spacePreceding: number = txtAll.lastIndexOf(' ', s.start.character);
    if(spacePreceding == -1) { spacePreceding = 0; }
    let spaceFollowing: number = txtAll.indexOf(' ', s.start.character);
    if(spaceFollowing == -1) { spaceFollowing = txtAll.length - 1; }
    
    s = new vscode.Selection(new vscode.Position(s.active.line, spacePreceding + 1), new vscode.Position(s.active.line, spaceFollowing));
    ToggleItalicsSelection(d, e, s);
    // this isn't working, obvious selection length issues aside
    s = new vscode.Selection(s.start, new vscode.Position(s.end.line, s.end.character + 4));
}

function ToggleItalicsSelection(d: vscode.TextDocument, e: vscode.TextEditorEdit, s: vscode.Selection) {
    let txt: string = d.getText(new vscode.Range(s.start, s.end));
    let txtTrimmed: string = txt.trim();
    let txtReplace: string;
                
    if(IsItalicized(txtTrimmed)) {
        let italicsStyle = txtTrimmed.substring(0, 1);
        let firstItalics = txt.indexOf(italicsStyle);
        let lastItalics = txt.lastIndexOf(italicsStyle);
        let textAfterLastItalics: string;
        if(txt.length > lastItalics) { textAfterLastItalics = txt.substring(lastItalics + 1); }
        txtReplace = txt.substring(0, firstItalics) + txt.substring(firstItalics + 1, lastItalics) + textAfterLastItalics;
    }
    else if (IsBoldAndItalicized(txtTrimmed)) {
        let italicsStyle = txtTrimmed.substring(2, 3);
        let firstItalics = txt.indexOf(italicsStyle);
        let lastItalics = txt.lastIndexOf(italicsStyle);
        let textAfterLastBold = txt.substring(lastItalics + 3);
        txtReplace = "**" + txt.substring(firstItalics + 1, lastItalics) + "**" + textAfterLastBold;
    }
    else {
        // trim internal italics
        let txtStripped = TrimSingles(txtTrimmed, "*");
        txtStripped = TrimSingles(txtStripped, "_");
        
        // edge case; convert underline bold to asterisks before applying italics
        if (IsBold(txtStripped) && txtStripped.substring(0, 2) == "__") {
            txtStripped = "**" + txtStripped.substring(2, txtStripped.length - 2) + "**";
        }
        
        // final replacement string 
        txtReplace = txt.replace(txtTrimmed, "_" + txtStripped + "_");
    }
                    
    e.replace(s, txtReplace); 
}

// helpers
function IsBold(txt: string) { return (txt.startsWith("**") && txt.endsWith("**")) || (txt.startsWith("__") && txt.endsWith("__")); }
function IsItalicized(txt: string) { return ((txt.startsWith("_") && txt.endsWith("_")) && !(txt.startsWith("__") && txt.endsWith("__"))) 
    || ((txt.startsWith("*") && txt.endsWith("*") && !(txt.startsWith("**") && txt.endsWith("**")))); }
function IsItalicizedAndBold(txt: string) { return (txt.startsWith("_**") && txt.endsWith("**_")) || (txt.startsWith("*__") && txt.endsWith("__*")); }
function IsBoldAndItalicized(txt: string) { return (txt.startsWith("**_") && txt.endsWith("_**")) || (txt.startsWith("__*") && txt.endsWith("*__")); }
function ContainsLink(txt: string) {
    let expression = new RegExp("\\[.*?\\]\\(.*?\\)");
    let match = expression.exec(txt);
    return (match != null);
}
function ContainsImageLink(txt: string) {
    let expression = new RegExp("!\\[.*?\\]\\(.*?\\)");
    let match = expression.exec(txt);
    return (match != null);
}
function IsList(txtTrimmed: string)
{
    let txtTrimmedLines = txtTrimmed.split("\n");
    let expression: RegExp = new RegExp("^[ ]*?[0-9|-]");
    for(let i = 0; i < txtTrimmedLines.length; i++) {
        let matches = txtTrimmedLines[i].match(expression);
        if (matches == null) { return false; }
    }    
    return true;
}
function TrimSingles(txt: string, char: string) {
    if(txt.length == 1) {
        if(txt == char) { return ""; }
        else { return txt; }  
    }
    else if(txt.length == 2) {
        let strCompare: string = char + char;
        if(txt == strCompare) { return txt; }
        else { return txt.replace(char, ""); }
    }
    else {
        // length > 2
        let txtReturn: string = "";
        // handle 0
        if(txt[0] != char || txt[1] == char) { txtReturn += txt[0]; }
        // handle middle
        for(let i = 1; i < txt.length - 1; i++) {
            if(txt[i] != char || txt[i - 1] == char || txt[i + 1] == char) { txtReturn += txt[i]; }
        }
        // handle last char
        if(txt[txt.length - 1] != char || txt[txt.length - 2] == char) { txtReturn += txt[txt.length - 1]; }
        return txtReturn;
    }
}