# Basic Markdown helper

Leverages (and occasionally overrides) keyboard shortcuts to apply Markdown formatting to highlighted text

| Formatting                | Keyboard Shortcut |
|---------------------------|-------------------|
| Bold                      | Ctrl+B            |
| Italics                   | Ctrl+I            |
| ToUpper                   | Ctrl+Shift+U      |
| ToLower                   | Ctrl+Shift+L      |
| Convert to unordered list | Ctrl+U            |
| Convert to ordered list   | Ctrl+O            |
| Convert to empty link     | Ctrl+L            | 

## Notes
- bold/italics shortcuts serve as toggles
- supports aggregation of bold/italics formatting within a selection
- supports toggle of a bolded and italicized selection (e.g toggling bold on \_\*\*example\*\*\_ retains the italics; similar functionality for \*\*\_example\_\*\*) 
- converting to list strips any pre-existing list formatting 