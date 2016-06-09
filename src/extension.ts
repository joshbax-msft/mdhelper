'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let global_expression_initial_whitespace: RegExp = new RegExp("^\\s*");
let global_expression_list_line: RegExp = new RegExp("^(\\s*?)([0-9]*?\\.\\s|-\\s|\\*\\s|\\+\\s)(\\s*)([^\\s]?.*)(\\r?)");
let global_expression_ordered_list_line: RegExp = new RegExp("^(\\s*?)([0-9]*?\\.\\s)(.*)(\\r{0,1})");
let global_expression_unordered_list_line: RegExp = new RegExp("^(\\s*?)(-\\s|\\*\\s|\\+\\s)(.*)(\\r{0,1})");
let global_expression_link: RegExp = new RegExp("\\[.*?\\]\\(.*?\\)");
let global_expression_image = new RegExp("!\\[.*?\\]\\(.*?\\)");
let global_expression_code_block_line: RegExp = new RegExp("^[```|~~~].*");
let global_expression_blockquote: RegExp = new RegExp("^(>\\s)+");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mdhelper" is now active!');
    
    // let disposable_debugpeek = vscode.commands.registerCommand('extension.debugpeek', () => {
    //     let e: vscode.TextEditor = vscode.window.activeTextEditor;
    //     let d: vscode.TextDocument = e.document;
    //     let s: vscode.Selection = e.selection;
    //     // add debug output to Peek before enabling
    //     e.edit(function (edit) { Peek(d, s, 5); });
    // });


    let disposable_togglebold = vscode.commands.registerCommand('extension.togglebold', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                ToggleBold(d, edit, s[x]);
            }
        });
    });
    
    let disposable_toggleitalics = vscode.commands.registerCommand('extension.toggleitalics', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                ToggleItalics(d, edit, s[x]);                
            }
        });
    });

    let disposable_togglestrikethrough = vscode.commands.registerCommand('extension.togglestrikethrough', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                ToggleStrikethrough(d, edit, s[x]);  
            }
        });
    });

    let disposable_togglecodeinline = vscode.commands.registerCommand('extension.togglecodeinline', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                ToggleCodeInline(d, edit, s[x]);                
            }
        });
    });
    
    let disposable_togglecodeblock = vscode.commands.registerCommand('extension.togglecodeblock', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                ToggleCodeBlock(d, edit, s[x]);  
            }
        });
    });
    
    let disposable_toupper = vscode.commands.registerCommand('extension.toupper', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                let txt: string = d.getText(new vscode.Range(s[x].start, s[x].end));
                edit.replace(s[x], txt.toUpperCase());
            }
        });
    });
    
    let disposable_tolower = vscode.commands.registerCommand('extension.tolower', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                let txt: string = d.getText(new vscode.Range(s[x].start, s[x].end));
                edit.replace(s[x], txt.toLowerCase());
            }
        });
    });

    let disposable_tounorderedlist = vscode.commands.registerCommand('extension.tounorderedlist', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                let txt: string = d.getText(new vscode.Range(s[x].start, s[x].end));
                let txtTrimmed: string = txt.trim();
                let txtReplace = txt.replace(txtTrimmed, ConvertToUnorderedList(txtTrimmed));
                edit.replace(s[x], txtReplace);
            }
        });
    });
    
    let disposable_toorderedlist = vscode.commands.registerCommand('extension.toorderedlist', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                let txt: string = d.getText(new vscode.Range(s[x].start, s[x].end));
                let txtTrimmed: string = txt.trim();
                let txtReplace: string = txt.replace(txtTrimmed, ConvertToOrderedList(txtTrimmed));
                edit.replace(s[x], txtReplace);
            }
        });
    });
    
    let disposable_tolink = vscode.commands.registerCommand('extension.tolink', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                let txt: string = d.getText(new vscode.Range(s[x].start, s[x].end));
                if(!ContainsLink(txt))
                {
                    let txtReplace: string = "[" + txt + "]()";
                    edit.replace(s[x], txtReplace);
                }
            }
        });
    });
    
    let disposable_toimagelink = vscode.commands.registerCommand('extension.toimagelink', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                let txt: string = d.getText(new vscode.Range(s[x].start, s[x].end));
                if(!ContainsImageLink(txt))
                {
                    let txtReplace: string = "![" + txt + "](path/to/image.png)";
                    edit.replace(s[x], txtReplace);
                }
            }
        });
    });
    
    let disposable_toggleblockquote = vscode.commands.registerCommand('extension.toggleblockquote', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) {
            for(let x = 0; x < s.length; x++) {
                ToggleBlockquote(d, edit, s[x]);  
            }
        });
    });
    
    let disposable_formattable = vscode.commands.registerCommand('extension.formattable', () => {
        let e: vscode.TextEditor = vscode.window.activeTextEditor;
        let d: vscode.TextDocument = e.document;
        let s: vscode.Selection[] = e.selections;
        e.edit(function (edit) { 
            for(let x = 0; x < s.length; x++) {
                FormatTable(d, edit, s[x]);  
            }
        });
    });
    
    //context.subscriptions.push(disposable_debugpeek);
    context.subscriptions.push(disposable_togglebold);
    context.subscriptions.push(disposable_toggleitalics);
    context.subscriptions.push(disposable_togglestrikethrough);
    context.subscriptions.push(disposable_togglecodeinline);
    context.subscriptions.push(disposable_togglecodeblock);
    context.subscriptions.push(disposable_toupper);
    context.subscriptions.push(disposable_tolower);
    context.subscriptions.push(disposable_tounorderedlist);
    context.subscriptions.push(disposable_toorderedlist);
    context.subscriptions.push(disposable_tolink);
    context.subscriptions.push(disposable_toimagelink);
    context.subscriptions.push(disposable_formattable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function ConvertToUnorderedList(txtTrimmed: string)
{
    let txtTrimmedLines: string[] = txtTrimmed.split("\n");
    for(let i = 0; i < txtTrimmedLines.length; i++)
    {
        let matches: RegExpMatchArray = txtTrimmedLines[i].match(global_expression_list_line);
        if (matches == null)
        {
            // not already a list item; insert a dash and space before the first non-whitespace character
            matches = txtTrimmedLines[i].match(global_expression_initial_whitespace);
            txtTrimmedLines[i] = txtTrimmedLines[i].substr(0, matches[0].length) + "- " + txtTrimmedLines[i].substr(matches[0].length);
        }
        else
        {
            // already a list item; convert initial character(s) to dash for consistency
            txtTrimmedLines[i] = txtTrimmedLines[i].replace(global_expression_list_line, "$1- $3$4$5");
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

// returns the total number of processed items; used recursively to increment list processing position
// assumes list bullets are "-", as returned by ConvertToUnorderedList
function ConvertToOrderedSublist(txtTrimmedLines: string[], startingIndex: number)
{
    let currentIndex: number = startingIndex;
    let currentIndent: number;
    let currentOrderNumber: number = 1;
    let itemsProcessed: number = 0;

    // process first line
    let matches: RegExpMatchArray = txtTrimmedLines[currentIndex].match(global_expression_unordered_list_line); 
    currentIndent = matches[1].length;
    
    txtTrimmedLines[currentIndex] = txtTrimmedLines[currentIndex].replace(global_expression_unordered_list_line, "$1" + currentOrderNumber.toString() + ". $3$4");
    currentIndex++;
    currentOrderNumber++;
    itemsProcessed++;
    
    if(currentIndex < txtTrimmedLines.length)
    {
        matches = txtTrimmedLines[currentIndex].match(global_expression_unordered_list_line);
        while(matches[1].length >= currentIndent && currentIndex < txtTrimmedLines.length)
        {
            if(matches[1].length == currentIndent)
            {
                // sibling
                txtTrimmedLines[currentIndex] = txtTrimmedLines[currentIndex].replace(global_expression_unordered_list_line, "$1" + currentOrderNumber.toString() + ". $3$4");
                currentIndex++;
                currentOrderNumber++;
                itemsProcessed++;
                if(currentIndex < txtTrimmedLines.length)
                {
                    matches = txtTrimmedLines[currentIndex].match(global_expression_unordered_list_line);
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
                    matches = txtTrimmedLines[currentIndex].match(global_expression_unordered_list_line);
                }
            }
        }
    }
    
    return itemsProcessed;
}

function ToggleBlockquote(d: vscode.TextDocument, e: vscode.TextEditorEdit, s: vscode.Selection) {
    if(d.getText().length == 0) { return; }
    s = SelectLines(d, s);
    
    let txt: string = d.getText(new vscode.Range(s.start, s.end));
    let txtTrimmed: string = txt.trim();
    let txtReplace: string;
    
    if(IsBlockquote(txtTrimmed)) { 
        txtReplace = txt.replace(txtTrimmed, RemoveBlockquote(txtTrimmed)); 
    } 
    else { 
        txtReplace = txt.replace(txtTrimmed, AddBlockquote(txtTrimmed)); 
    }
    
    e.replace(s, txtReplace);
}

function ToggleBold(d: vscode.TextDocument, e: vscode.TextEditorEdit, s: vscode.Selection) {
    if(d.getText().length == 0) { return; }
    if(s.isEmpty) { s = SelectWord(d, s); }
    
    let txt: string = d.getText(new vscode.Range(s.start, s.end));
    let txtTrimmed: string = txt.trim();
    let txtReplace: string;
    
    if(IsList(txtTrimmed)) { 
        txtReplace = txt.replace(txtTrimmed, ToggleBoldList(txtTrimmed)); 
    }
    else if(IsBold(txtTrimmed) || IsItalicizedAndBold(txtTrimmed)) { 
        txtReplace = txt.replace(txtTrimmed, RemoveBold(txtTrimmed)); 
    }
    else {
        let txtStripped: string = ConvertItalics(txtTrimmed.split("**").join("").split("__").join(""));
        txtReplace = txt.replace(txtTrimmed, AddBold(txtStripped));                   
    }
                    
    e.replace(s, txtReplace); 
}

function ToggleBoldList(txtList: string) {
    if(IsBoldList(txtList)) {
        // remove bold from each line
        let txtLines: string[] = txtList.split("\n");
        for(let i = 0; i < txtLines.length; i++) {
            let matches: RegExpMatchArray = txtLines[i].match(global_expression_list_line);
            txtLines[i] = matches[1] + matches[2] + matches[3] + RemoveBold(matches[4]) + matches[5];
        }
        return txtLines.join("\n");
    }
    else {
        // add bold to each line
        let txtLines: string[] = txtList.split("\n");
        for(let i = 0; i < txtLines.length; i++) {
            let matches = txtLines[i].match(global_expression_list_line);
            txtLines[i] = matches[1] + matches[2] + matches[3] + AddBold(ConvertItalics(matches[4])) + matches[5];
        }
        return txtLines.join("\n");
    }
}

function ToggleItalics(d: vscode.TextDocument, e: vscode.TextEditorEdit, s: vscode.Selection) {
    if(d.getText().length == 0) { return; }
    if(s.isEmpty) { s = SelectWord(d, s); }

    let txt: string = d.getText(new vscode.Range(s.start, s.end));
    let txtTrimmed: string = txt.trim();
    let txtReplace: string;

    if(IsList(txtTrimmed)) {
        txtReplace = txt.replace(txtTrimmed, ToggleItalicsList(txtTrimmed));
    }
    else if(IsItalicized(txtTrimmed) || IsBoldAndItalicized(txtTrimmed)) {
        txtReplace = txt.replace(txtTrimmed, RemoveItalics(txtTrimmed));
    }
    else {
        let txtStripped: string = ConvertBold(StripItalics(txtTrimmed));
        txtReplace = txt.replace(txtTrimmed, AddItalics(txtStripped));
    }
                    
    e.replace(s, txtReplace); 
}

function ToggleItalicsList(txtList: string) {
    if(IsItalicizedList(txtList)) {
        // remove italics from each line
        let txtLines: string[] = txtList.split("\n");
        for(let i = 0; i < txtLines.length; i++) {
            let matches: RegExpMatchArray = txtLines[i].match(global_expression_list_line);
            txtLines[i] = matches[1] + matches[2] + matches[3] + RemoveItalics(matches[4]) + matches[5];
        }
        return txtLines.join("\n");
    }
    else {
        // add italics to each line
        let txtLines: string[] = txtList.split("\n");
        for(let i = 0; i < txtLines.length; i++) {
            let matches: RegExpMatchArray = txtLines[i].match(global_expression_list_line);
            txtLines[i] = matches[1] + matches[2] + matches[3] + AddItalics(ConvertBold(matches[4])) + matches[5];
        }
        return txtLines.join("\n");
    }
}

function ToggleStrikethrough(d: vscode.TextDocument, e: vscode.TextEditorEdit, s: vscode.Selection) {
    if(d.getText().length == 0) { return; }
    if(s.isEmpty) { s = SelectWord(d, s); }
    
    let txt: string = d.getText(new vscode.Range(s.start, s.end));
    let txtTrimmed: string = txt.trim();
    let txtReplace: string;
    if(IsList(txtTrimmed)) { 
        txtReplace = txt.replace(txtTrimmed, ToggleStrikethroughList(txtTrimmed)); 
    }
    else if(IsStrikethrough(txtTrimmed)) { 
        txtReplace = txt.replace(txtTrimmed, RemoveStrikethrough(txtTrimmed)); 
    }
    else {
        let txtStripped: string = txtTrimmed.split("~~").join("");
        txtReplace = txt.replace(txtTrimmed, AddStrikethrough(txtStripped));                   
    }
                    
    e.replace(s, txtReplace); 
}

function ToggleStrikethroughList(txtList: string) {
    if(IsStrikethroughList(txtList)) {
        // remove strikethrough from each line
        let txtLines: string[] = txtList.split("\n");
        for(let i = 0; i < txtLines.length; i++) {
            let matches: RegExpMatchArray = txtLines[i].match(global_expression_list_line);
            txtLines[i] = matches[1] + matches[2] + matches[3] + RemoveStrikethrough(matches[4]) + matches[5];
        }
        return txtLines.join("\n");
    }
    else {
        // add strikethrough to each line
        let txtLines: string[] = txtList.split("\n");
        for(let i = 0; i < txtLines.length; i++) {
            let matches = txtLines[i].match(global_expression_list_line);
            txtLines[i] = matches[1] + matches[2] + matches[3] + AddStrikethrough(RemoveStrikethrough(matches[4])) + matches[5];
        }
        return txtLines.join("\n");
    }
}

function ToggleCodeInline(d: vscode.TextDocument, e: vscode.TextEditorEdit, s: vscode.Selection) {
    if(d.getText().length == 0) { return; }
    if(s.isEmpty) { s = SelectWord(d, s); }

    let txt: string = d.getText(new vscode.Range(s.start, s.end));
    let txtTrimmed: string = txt.trim();
    let txtReplace: string;

    if(!IsCodeBlock(txtTrimmed)) {
        if(IsList(txtTrimmed)) {
            txtReplace = txt.replace(txtTrimmed, ToggleCodeInlineList(txtTrimmed));
        }
        else if(IsCodeInline(txtTrimmed)) {
            txtReplace = txt.replace(txtTrimmed, RemoveCodeInline(txtTrimmed));
        }
        else {
            txtReplace = txt.replace(txtTrimmed, AddCodeInline(TrimSingles(txtTrimmed, "`")));
        }
                        
        e.replace(s, txtReplace); 
    }
}

function ToggleCodeInlineList(txtList: string) {
    if(IsCodeInlineList(txtList)) {
        // remove code inline from each line
        let txtLines: string[] = txtList.split("\n");
        for(let i = 0; i < txtLines.length; i++) {
            let matches: RegExpMatchArray = txtLines[i].match(global_expression_list_line);
            txtLines[i] = matches[1] + matches[2] + matches[3] + RemoveCodeInline(matches[4]) + matches[5];
        }
        return txtLines.join("\n");
    }
    else {
        // wrap each line in `
        let txtLines: string[] = txtList.split("\n");
        for(let i = 0; i < txtLines.length; i++) {
            let matches: RegExpMatchArray = txtLines[i].match(global_expression_list_line);
            txtLines[i] = matches[1] + matches[2] + matches[3] + AddCodeInline(TrimSingles(matches[4], "`")) + matches[5];
        }
        return txtLines.join("\n");
    }
}

function ToggleCodeBlock(d: vscode.TextDocument, e: vscode.TextEditorEdit, s: vscode.Selection) {
    if(d.getText().length == 0) { return; }
    if(s.isEmpty) { s = SelectWord(d, s); }

    let txt: string = d.getText(new vscode.Range(s.start, s.end));
    let txtTrimmed: string = txt.trim();
    let txtReplace: string;

    if(IsCodeBlock(txtTrimmed)) {
        txtReplace = txt.replace(txtTrimmed, RemoveCodeBlock(txtTrimmed));
        if(txtReplace.endsWith("\r\n") || Peek(d, s, 2) == "\r\n") {
            txtReplace = txtReplace.substring(0, txtReplace.length - 2);
        }
    }
    else {
        txtReplace = txt.replace(txtTrimmed, AddCodeBlock(TrimSingles(StripCodeBlocks(txtTrimmed), "`")));
        if(!txt.endsWith("\r\n") && Peek(d, s, 2) != "\r\n") { txtReplace += "\r\n"; }
    }
                    
    e.replace(s, txtReplace); 
}

function FormatTable(d: vscode.TextDocument, e: vscode.TextEditorEdit, s: vscode.Selection) {
    if(d.getText().length == 0) { return; }
    if(s.isEmpty) { s = SelectTable(d, s); }
    
    if(s != null) {
        let txt: string = d.getText(new vscode.Range(s.start, s.end));
        let txtTrimmed: string = txt.trim();
        if(!IsTable(txtTrimmed)) { return; }

        let table: Table = new Table(txtTrimmed);
        let txtReplace: string = txt.replace(txtTrimmed, table.ToString());
        e.replace(s, txtReplace);    
    }
}

/////////////////////////////////////
//
// START HELPERS
//
/////////////////////////////////////

// code block
function IsCodeBlock(txt: string) { return txt.startsWith("```\r\n") && txt.endsWith("\r\n```"); }
function ConvertCodeBlock(txt: string) {
    if(IsCodeBlock(txt)) { return AddCodeBlock(RemoveCodeBlock(txt)); }
    else { return txt; }
}
function AddCodeBlock(txt: string) { return "```\r\n" + txt + "\r\n```"; }
function RemoveCodeBlock(txt: string) {
    if(IsCodeBlock(txt)) {
        let txtStrippedFirstLine: string = txt.substring(txt.indexOf("\n") + 1);
        let txtLines: string[] = txtStrippedFirstLine.split("\n");
        txtLines.pop();
        return txtLines.join("\n") + "\n";
    }
    else { return txt; }
}
function StripCodeBlocks(txt: string) {
    let txtReturn: string = "";
    let txtLines: string[] = txt.split("\n");
    for(let txtLine of txtLines) {
        if(txtLine.match(global_expression_code_block_line) == null) {
            txtReturn += txtLine;
            if(txtLine.endsWith("\r")) { txtReturn += "\n"; }
        }
    }    
    return txtReturn;
}

// code inline
function IsCodeInline(txt: string) { return !IsCodeBlock(txt) && (txt.startsWith("`") && txt.endsWith("`")); }
function AddCodeInline(txt: string) { return "`" + txt + "`"; }
function RemoveCodeInline(txt: string) {
    if(IsCodeInline(txt)) { return txt.substring(1, txt.length - 1); }
    else { return txt; }
}
function IsCodeInlineList(txtList: string) {
    // assumes txtList is a valid list
    let txtLines: string[] = txtList.split("\n");
    for(let txtLine of txtLines) {
        let matches: RegExpMatchArray = txtLine.match(global_expression_list_line);
        let txtAfterBullet: string = matches[4];
        if(!IsCodeInline(txtAfterBullet)) { return false; }
    }
    return true;
}

// bold/italics
function AddBold(txt: string) { return "**" + RemoveBold(txt) + "**"; }
function RemoveBold(txt: string) { 
    if(IsBold(txt)) { return txt.substring(2, txt.length - 2); }
    else if(IsItalicizedAndBold(txt)) { return AddItalics(txt.substring(3, txt.length - 3)); }
    else { return txt; } 
}
function IsBold(txt: string) { return (txt.startsWith("**") && txt.endsWith("**")) || (txt.startsWith("__") && txt.endsWith("__")); }
function IsBoldList(txtList: string) {
    // assumes txtList is a valid list
    let txtLines: string[] = txtList.split("\n");
    for(let txtLine of txtLines) {
        let matches: RegExpMatchArray = txtLine.match(global_expression_list_line);
        let txtAfterBullet: string = matches[4];
        if(!(IsBold(txtAfterBullet) || IsItalicizedAndBold(txtAfterBullet))) { return false; }
    }
    return true;
}
function AddItalics(txt: string) { return "_" + RemoveItalics(txt) + "_"; }
function RemoveItalics(txt: string) { 
    if(IsItalicized(txt)) { return txt.substring(1, txt.length - 1); }
    else if(IsBoldAndItalicized(txt)) { return AddBold(txt.substring(3, txt.length - 3)); }
    else { return txt; } 
}
function IsItalicizedList(txtList: string) {
    // assumes txtList is a valid list
    let txtLines: string[] = txtList.split("\n");
    for(let txtLine of txtLines) {
        let matches: RegExpMatchArray = txtLine.match(global_expression_list_line);
        let txtAfterBullet: string = matches[4];
        if(!(IsItalicized(txtAfterBullet) || IsBoldAndItalicized(txtAfterBullet))) { return false; }
    }
    return true;
}
function IsItalicized(txt: string) { return ((txt.startsWith("_") && txt.endsWith("_")) && !(txt.startsWith("__") && txt.endsWith("__"))) 
    || ((txt.startsWith("*") && txt.endsWith("*") && !(txt.startsWith("**") && txt.endsWith("**")))); }
function IsItalicizedAndBold(txt: string) { return (txt.startsWith("_**") && txt.endsWith("**_")) || (txt.startsWith("*__") && txt.endsWith("__*")); }
function IsBoldAndItalicized(txt: string) { return (txt.startsWith("**_") && txt.endsWith("_**")) || (txt.startsWith("__*") && txt.endsWith("*__")); }
function StripItalics(txt: string) { return TrimSingles(TrimSingles(txt, "*"), "_"); }
function ConvertBold(txt: string) {
    if (IsBold(txt)) { return AddBold(RemoveBold(txt)); }
    else { return txt; }    
}
function ConvertItalics(txt: string) {
    if (IsItalicized(txt)) { return AddItalics(RemoveItalics(txt)); }
    else { return txt; }    
}

// strikethrough
function IsStrikethrough(txt: string) { return txt.startsWith("~~") && txt.endsWith("~~"); }
function AddStrikethrough(txt: string) { return "~~" + txt + "~~"; }
function RemoveStrikethrough(txt: string) { 
    if(IsStrikethrough(txt)) { return txt.substring(2, txt.length - 2); }
    else { return txt; } 
}
function IsStrikethroughList(txtList: string) {
    // assumes valid list
    let txtLines: string[] = txtList.split("\n");
    for(let txtLine of txtLines) {
        let matches: RegExpMatchArray = txtLine.match(global_expression_list_line);
        let txtAfterBullet: string = matches[4];
        if(!IsStrikethrough(txtAfterBullet)) { return false; }
    }
    return true;
}

// links
function ContainsLink(txt: string) {
    let match: RegExpExecArray = global_expression_link.exec(txt);
    return (match != null);
}
function ContainsImageLink(txt: string) {
    let match: RegExpExecArray = global_expression_image.exec(txt);
    return (match != null);
}

// blockquote
function IsBlockquote(txt: string) {
    let txtLines: string[] = txt.split("\n");
    for(let i = 0; i < txtLines.length; i++) {
        let matches: RegExpMatchArray = txtLines[i].match(global_expression_blockquote);
        if (matches == null) { return false; }
    }    
    return true;
}
function AddBlockquote(txt: string) {
    // assumes whole lines are selected (to append spaces, if needed)
    let txtLines: string[] = txt.split("\n");
    for(let i = 0; i < txtLines.length; i++) {
        txtLines[i] = "> " + txtLines[i];
        if(!txtLines[i].endsWith("  \r")) {
            if(!txtLines[i].endsWith(" \r")) { txtLines[i] = txtLines[i].replace("\r", "  \r"); }
            else { txtLines[i] = txtLines[i].replace("\r", " \r"); }            
        }
    }    
    return txtLines.join("\n");
}
function RemoveBlockquote(txt: string) {
    let txtLines: string[] = txt.split("\n");
    for(let i = 0; i < txtLines.length; i++) {
        txtLines[i] = txtLines[i].substring(2);
    }    
    return txtLines.join("\n");
}

// list
function IsPartialList(txt: string, d: vscode.TextDocument, s: vscode.Selection) {
    // partial list is a selection that is a list with an adjacent line that is also a list [item]
    if(!IsList(txt)) { return false; }
    if(s.start.line > 0 && IsList(d.lineAt(s.start.line - 1).text)) { return true; }
    if(s.end.line < d.lineCount - 1 && IsList(d.lineAt(s.end.line + 1).text)) { return true; }
    return false;
}
function IsList(txt: string) {
    let txtLines: string[] = txt.split("\n");
    for(let i = 0; i < txtLines.length; i++) {
        let matches: RegExpMatchArray = txtLines[i].match(global_expression_list_line);
        if (matches == null) { return false; }
    }    
    return true;
}
function IsUnorderedList(txt: string) {
    let txtLines: string[] = txt.split("\n");
    for(let i = 0; i < txtLines.length; i++) {
        let matches: RegExpMatchArray = txtLines[i].match(global_expression_unordered_list_line);
        if (matches == null) { return false; }
    }    
    return true;
}
function IsOrderedList(txt: string) {
    let txtLines: string[] = txt.split("\n");
    for(let i = 0; i < txtLines.length; i++) {
        let matches: RegExpMatchArray = txtLines[i].match(global_expression_ordered_list_line);
        if (matches == null) { return false; }
    }    
    return true;
}

// table
function IsTable(txt: string) {
    let txtLines: string[] = txt.split("\r\n");
    for(let txtLine of txtLines) {
        if(!IsTableLine(txtLine)) { return false; }
    }
    return true;
}
function Pad(txt: string, char: string, length: number) {
    while(txt.length < length) { txt += char; }
    return txt;
}
function IsTableLine(txt: string) { return txt.indexOf("|") != -1; }
function IsDashLine(txt: string) {
    for(let i = 0; i < txt.length; i++) {
        if(txt[i] != "-" && txt[i] != "|" && txt[i] != " ") { return false; }
    }
    return true;
}
function SelectAndParseTable(d: vscode.TextDocument, s: vscode.Selection) {
    let txtLines: string[] = [];
    let txtLine: string = d.lineAt(s.active.line).text;
    txtLines[0] = txtLine;
    
    let column: number = GetTableColumn(d, s);
    let row: number = GetTableRow(d, s);
    vscode.window.showInformationMessage("Row: " + row.toString() + " Column: " + column.toString());
    s = new vscode.Selection(s.active.line, 0, s.active.line, txtLine.length);    
}

function SelectTable(d: vscode.TextDocument, s: vscode.Selection) {
    let lineStart: number = s.start.line;
    let lineEnd: number = s.end.line;

    // initial checks
    let txtLine: string = d.lineAt(lineStart).text;
    if(!IsTableLine(txtLine)) { return null; }    
    txtLine = d.lineAt(lineEnd).text;
    if(!IsTableLine(txtLine)) { return null; }

    // check following lines
    // note: lineCount is one-based; lineAt is zero-based
    if(lineEnd < d.lineCount - 1) {
        txtLine = d.lineAt(lineEnd + 1).text;
        while((lineEnd + 1) < d.lineCount && IsTableLine(txtLine)) {
            lineEnd++;
            if(lineEnd < d.lineCount - 1) { txtLine = d.lineAt(lineEnd + 1).text; }            
        }
    }

    // check preceding lines
    if(lineStart > 0) {
        txtLine = d.lineAt(lineStart - 1).text;
        while((lineStart - 1) >= 0 && IsTableLine(txtLine)) {
            lineStart--;
            if(lineStart > 0) { txtLine = d.lineAt(lineStart - 1).text; }            
        }
    }

    return new vscode.Selection(lineStart, 0, lineEnd, d.lineAt(lineEnd).text.length);
}

function GetTableColumn(d: vscode.TextDocument, s: vscode.Selection) {
    let txtLine: string = d.lineAt(s.active.line).text.trim();
    if(txtLine.startsWith("|")) { txtLine = txtLine.substring(1); }
    if(txtLine.endsWith("|")) { txtLine = txtLine.substring(0, txtLine.length - 1); }

    let nTotalColumns: number = txtLine.split("|").length - 1; 
    let nCountAfter: number = 0;
    let nCurrentIndex: number = txtLine.indexOf("|", s.active.character);
    while(nCurrentIndex != -1) {
        nCountAfter++;
        nCurrentIndex = txtLine.indexOf("|", nCurrentIndex + 1);
    }

    return nTotalColumns - nCountAfter;
}

function GetTableRow(d: vscode.TextDocument, s: vscode.Selection) {
    let row: number = -1;
    let nCurrentLine: number = s.active.line;
    let txtLine: string = d.lineAt(nCurrentLine).text.trim();
    while(IsTableLine(txtLine)) {
        row++;
        nCurrentLine--;
        txtLine = d.lineAt(nCurrentLine).text.trim();
    }
    return row;
}

class Table {
    columnWidths: number[];
    cells: string[][];
    lines: string[];
    formattedString: string;
    cursorX: number;
    cursorY: number;

    constructor(txt: string, _cursorX?: number, _cursorY?: number) {
        this.cursorX = _cursorX == null ? -1 : _cursorX;
        this.cursorY = _cursorY == null ? -1 : _cursorY;

        this.lines = txt.split("\r\n");
        this.cells = [];

        let nNumberOfColumns: number = 0;

        // split and trim into cells, and determine number of columns
        for(let i = 0; i < this.lines.length; i++) {
            this.cells[i] = [];
            this.cells[i] = this.lines[i].split("|");
            for(let j = 0; j < this.cells[i].length; j++) { this.cells[i][j] = this.cells[i][j].trim(); }
            if(this.cells[i].length > nNumberOfColumns) { nNumberOfColumns = this.cells[i].length; }               
        }

        // create array to hold column widths
        this.columnWidths = new Array(nNumberOfColumns);
        for(let i = 0; i < this.columnWidths.length; i++) { this.columnWidths[i] = 0; }
        
        // determine column widths
        for(let i = 0; i < nNumberOfColumns; i++) {
            for(let j = 0; j < this.cells.length; j++) {
                if(this.cells[j][i].length > this.columnWidths[i]) { 
                    this.columnWidths[i] = this.cells[j][i].length; 
                }
            }
        }

        // format and set formattedString
        // remove errant dash lines; force dash line if none exists
        for(let i = this.lines.length - 1; i >= 0; i--) {
            if(IsDashLine(this.lines[i]) && i != 1) {
                this.lines.splice(i, 1);
            }
            else {
                let padChar: string = " ";
                if(IsDashLine(this.lines[i])) { padChar = "-"; }
                this.lines[i] = "";
                for(let j = 0; j < this.cells[i].length; j++) {
                    this.lines[i] += " " + Pad(this.cells[i][j], padChar, this.columnWidths[j]) + " |";
                }
                if(this.lines[i].length > 0) {
                    this.lines[i] = this.lines[i].substring(1, this.lines[i].length - 2);
                }
                if(i == 1 && !IsDashLine(this.lines[i])) {
                    // add a dash line
                    let txtDashLine: string = "";
                    for(let j = 0; j < this.columnWidths.length; j++) {
                        txtDashLine += " " + Pad("", "-", this.columnWidths[j]) + " |";
                    } 
                    if(txtDashLine.length > 0) {
                        txtDashLine = txtDashLine.substring(1, txtDashLine.length - 2);
                    }
                    this.lines.splice(1, 0, txtDashLine);
                }
                
                this.lines[i] = this.lines[i].trim();
            }
        }

        this.formattedString = this.lines.join("\r\n");
    }
    ToString() { return this.formattedString; }
    AddColumnRight(column_index: number) {
        // can assume formatted table
    }
    AddColumnLeft(column_index: number) {
        // can assume formatted table
    }
    AddRowBelow(row_index: number) {
        // can assume formatted table
    }
    AddRowAbove(row_index: number) {
        // can assume formatted table
    }
}

// miscellaneous/utility
function Peek(d: vscode.TextDocument, s: vscode.Selection, n: number) {
    // returns a substring of the document text equal to n characters after the selection (TODO: or before, if n is negative)
    // includes \r\n, but this is hard-coded, so it's not accurate for UNIX-style line endings
    if(n <= 0) { return; }
    else if(n > 0) {
        // look ahead
        let nCurrentLineIndex: number = s.end.line;
        let txtReturn: string = "";
        let txtCurrentLine: string = d.lineAt(nCurrentLineIndex).text;
        
        if(s.end.character + n > txtCurrentLine.length) {
            // add the rest of the current line to txtReturn
            txtReturn += txtCurrentLine.substring(s.end.character);
            txtReturn += "\r"; if(txtReturn.length < n) { txtReturn += "\n"; }
            while(txtReturn.length < n && ++nCurrentLineIndex < d.lineCount - 1) {
                txtCurrentLine = d.lineAt(nCurrentLineIndex).text;
                let nNeededCharacters: number = n - txtReturn.length;
                if(txtCurrentLine.length < nNeededCharacters) {
                    txtReturn += txtCurrentLine;
                    txtReturn += "\r"; if(txtReturn.length < n) { txtReturn += "\n"; }
                    
                }
                else {
                    txtReturn += txtCurrentLine.substring(0, nNeededCharacters);
                }
            }
        }
        else {            
            txtReturn = txtCurrentLine.substring(s.end.character, s.end.character + n); 
        }
        
        return txtReturn;        
    }
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
function SelectWord(d: vscode.TextDocument, s: vscode.Selection) {
    let txtLine: string = d.lineAt(s.active.line).text;
    let spacePreceding: number = txtLine.lastIndexOf(' ', s.start.character - 1);
    let spaceFollowing: number = txtLine.indexOf(' ', s.start.character);
    if(spaceFollowing == -1) { spaceFollowing = txtLine.length; }
    return new vscode.Selection(new vscode.Position(s.active.line, spacePreceding + 1), new vscode.Position(s.active.line, spaceFollowing));
}
function SelectLines(d: vscode.TextDocument, s: vscode.Selection) {
    let nLastLineLength: number = d.lineAt(s.end.line).text.length;
    return new vscode.Selection(s.start.line, 0, s.end.line, nLastLineLength);
}