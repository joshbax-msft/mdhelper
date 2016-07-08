# Basic Markdown helper

Apply Markdown formatting to text (keyboard shortcuts, context menu)

| Formatting                         | Keyboard Shortcut          |
|------------------------------------|----------------------------|
| Toggle bold                        | Ctrl+B                     |
| Toggle italics                     | Ctrl+I                     |
| Toggle strikethrough               | Alt+S                      |
| Toggle code inline                 | Ctrl+`                     |
| Toggle code block                  | Ctrl+Shift+`               |
| Toggle blockquote                  | Ctrl+Shift+Q               |
| ToUpper                            | Ctrl+Shift+U               |
| ToLower                            | Ctrl+Shift+L               |
| Convert to unordered list          | Ctrl+L, Ctrl+U             |
| Convert to ordered list            | Ctrl+L, Ctrl+O             |
| Convert to link template           | Alt+L                      | 
| Convert to image template          | Alt+I                      |
| Format GFM table                   | Ctrl+Shift+T, Ctrl+Shift+F |
| GFM Table: Add column to the left  | Ctrl+Shift+T, Ctrl+Shift+L |
| GFM Table: Add column to the right | Ctrl+Shift+T, Ctrl+Shift+R |
| GFM Table: Add row above           | Ctrl+Shift+T, Ctrl+Shift+A |
| GFM Table: Add row below           | Ctrl+Shift+T, Ctrl+Shift+B |

## Notes
- acts on current word when nothing is selected
- aggregates formatting within a selection
- supports bold/italics combination formatting (e.g toggling bold on \_\*\*example\*\*\_ preserves the italics; similar functionality for \*\*\_example\_\*\*)
 - similar complex formatting with other styles is currently unsupported
- supports format toggling of list items (e.g. select a list, Ctrl+B to toggle bold on list items)
- formatting is often overwritten during toggles (bold favors \*\*; italics favor \_)
- converting to list strips any pre-existing list formatting 
- the blockquote toggling algorithm isn't particularly smart
- GFM table formatting resizes table columns based on the largest string in that column
 - also removes extraneous dash lines and adds a dash line if one is not already in the correct position
 - also tries to smartly work around dash lines when adding rows; consequently, trying to add a row above the dash line results in adding a row below the dash line
- context menu support