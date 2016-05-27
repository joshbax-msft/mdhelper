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
        let e = vscode.window.activeTextEditor;
        let d = e.document;
        let sel = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < sel.length; x++) {
                if(sel[x].isEmpty) {
                    // replace selection object based on cursor position, preceding/following space positions
                    let txtAll: string = d.getText(new vscode.Range(sel[x].active.line, 0, sel[x].active.line + 1, 0));
                    let spacePreceding: number = txtAll.lastIndexOf(' ', sel[x].start.character);
                    let spaceFollowing: number = txtAll.indexOf(' ', sel[x].start.character);
                    sel[x] = new vscode.Selection(new vscode.Position(sel[x].active.line, spacePreceding + 1), new vscode.Position(sel[x].active.line, spaceFollowing));
                }
                
                let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
                let txtTrimmed: string = txt.trim();
                let txtReplace: string;
                
                if(txtTrimmed.startsWith("**") && txtTrimmed.endsWith("**")) {
                    let firstBold = txt.indexOf("**");
                    let lastBold = txt.lastIndexOf("**");
                    let textAfterLastBold: string;
                    if(txt.length > lastBold + 1) { textAfterLastBold = txt.substring(lastBold + 2); }
                    txtReplace = txt.substring(0, firstBold) + txt.substring(firstBold + 2, lastBold) + textAfterLastBold;
                }
                else if (txtTrimmed.startsWith("_**") && txtTrimmed.endsWith("**_")) {
                    let firstBold = txt.indexOf("**");
                    let lastBold = txt.lastIndexOf("**");
                    let textAfterLastBold: string;
                    textAfterLastBold = txt.substring(lastBold + 2);
                    txtReplace = txt.substring(0, firstBold) + txt.substring(firstBold + 2, lastBold) + textAfterLastBold;
                }
                else {
                    // check if selection contains a bold
                    let count: number = 0;
                    let index: number = txt.indexOf("**", 0);
                    while(index != -1) { count++; index = txt.indexOf("**", index + 2); }
                    
                    if (count > 1) {
                        let txtStripped = txtTrimmed.split("**").join("");
                        txtReplace = txt.replace(txtTrimmed, "**" + txtStripped + "**");
                    }
                    else {
                        txtReplace = txt.replace(txtTrimmed, "**" + txtTrimmed + "**");
                    }                    
                }
                
                edit.replace(sel[x], txtReplace);   
            }
        });
    });
    
    let disposable_italicize = vscode.commands.registerCommand('extension.italicize', () => {
        let e = vscode.window.activeTextEditor;
        let d = e.document;
        let sel = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < sel.length; x++) {
                let txt: string = d.getText(new vscode.Range(sel[x].start, sel[x].end));
                let txtTrimmed: string = txt.trim();
                let txtReplace: string;
                
                if(txtTrimmed.startsWith("_") && txtTrimmed.endsWith("_")) {
                    let firstItalics = txt.indexOf("_");
                    let lastItalics = txt.lastIndexOf("_");
                    let textAfterLastItalics: string;
                    if(txt.length > lastItalics) { textAfterLastItalics = txt.substring(lastItalics + 1); }
                    txtReplace = txt.substring(0, firstItalics) + txt.substring(firstItalics + 1, lastItalics) + textAfterLastItalics;
                }
                else if (txtTrimmed.startsWith("**_") && txtTrimmed.endsWith("_**")) {
                    let firstItalics = txt.indexOf("_");
                    let lastItalics = txt.lastIndexOf("_");
                    let textAfterLastItalics: string;
                    textAfterLastItalics = txt.substring(lastItalics + 1);
                    txtReplace = txt.substring(0, firstItalics) + txt.substring(firstItalics + 1, lastItalics) + textAfterLastItalics;
                }
                else {
                    // check if selection contains a italics
                    let count: number = 0;
                    let index: number = txt.indexOf("_", 0);
                    while(index != -1) { count++; index = txt.indexOf("_", index + 2); }
                    
                    if (count > 1) {
                        let txtStripped = txtTrimmed.split("_").join("");
                        txtReplace = txt.replace(txtTrimmed, "_" + txtStripped + "_");
                    }
                    else {
                        txtReplace = txt.replace(txtTrimmed, "_" + txtTrimmed + "_");
                    }                    
                }                
                
                edit.replace(sel[x], txtReplace); 
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
    
    context.subscriptions.push(disposable_bold);
    context.subscriptions.push(disposable_italicize);
    context.subscriptions.push(disposable_toupper);
    context.subscriptions.push(disposable_tolower);
    context.subscriptions.push(disposable_tounorderedlist);
    context.subscriptions.push(disposable_toorderedlist);
    context.subscriptions.push(disposable_tolink);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function IsList(txtTrimmed: string)
{
    let txtTrimmedLines = txtTrimmed.split("\n");
    let expression: RegExp = new RegExp("^[ ]*?[0-9|-]");

    for(let i = 0; i < txtTrimmedLines.length; i++)
    {
        let matches = txtTrimmedLines[i].match(expression);
        if (matches == null) { return false; }
    }
    
    return true;
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

function ContainsLink(str: string)
{
    let expression = new RegExp("\\[.*?\\]\\(.*?\\)");
    let match = expression.exec(str);
    return (match != null);
}