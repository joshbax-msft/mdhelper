# Basic Markdown helper

Leverages (and occasionally overrides) keyboard shortcuts to apply Markdown formatting to highlighted text

| Formatting                 | Keyboard Shortcut |
|----------------------------|-------------------|
| Toggle bold                | Ctrl+B            |
| Toggle italics             | Ctrl+I            |
| Toggle code inline         | Ctrl+`            |
| Toggle code block          | Ctrl+Shift+`      |
| ToUpper                    | Ctrl+Shift+U      |
| ToLower                    | Ctrl+Shift+L      |
| Convert to unordered list  | Ctrl+L, Ctrl+U    |
| Convert to ordered list    | Ctrl+L, Ctrl+O    |
| Convert to empty link      | Alt+L             | 
| Convert to templated image | Alt+I             |

## Notes
- acts on current word when nothing is selected
- supports aggregation of bold/italics within a selection
- supports bold/italics combination formatting (e.g toggling bold on \_\*\*example\*\*\_ preserves the italics; similar functionality for \*\*\_example\_\*\*) 
- supports toggling of list items when a list is selected
- formatting is often overwritten during toggles (bold favors \*\*; italics favor \_)
- converting to list strips any pre-existing list formatting 
