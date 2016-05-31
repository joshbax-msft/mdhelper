# Basic Markdown helper

Leverages (and occasionally overrides) keyboard shortcuts to apply Markdown formatting to highlighted text

| Formatting                 | Keyboard Shortcut |
|----------------------------|-------------------|
| Toggle bold                | Ctrl+B            |
| Toggle italics             | Ctrl+I            |
| Toggle strikethrough       | Alt+S             |
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
- aggregates formatting within a selection
- supports bold/italics combination formatting (e.g toggling bold on \_\*\*example\*\*\_ preserves the italics; similar functionality for \*\*\_example\_\*\*) 
- supports format toggling of list items (e.g. select a list, Ctrl+B to toggle bold on list items)
- formatting is often overwritten during toggles (bold favors \*\*; italics favor \_)
- converting to list strips any pre-existing list formatting 
