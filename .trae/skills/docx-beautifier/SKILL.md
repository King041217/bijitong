---
name: "docx-beautifier"
description: "Enhances DOCX file appearance by applying professional formatting, styles, themes, and layouts. Invoke when user wants to improve document aesthetics or create professional-looking documents."
---

# DOCX Beautifier

## Overview

This skill transforms plain DOCX documents into professionally formatted documents with beautiful layouts, consistent styling, and modern design elements.

## Features

- **Title and Heading Styling**: Apply consistent heading styles with proper hierarchy
- **Theme Application**: Apply professional color schemes and font sets
- **Table Enhancement**: Add borders, shading, and proper alignment to tables
- **Table of Contents**: Generate automatic table of contents
- **Font Optimization**: Apply readable fonts with appropriate sizes
- **Paragraph Formatting**: Consistent line spacing and indentation
- **Header/Footer**: Add professional headers and footers
- **Cover Page**: Generate professional cover pages
- **List Formatting**: Proper bullet and numbering styles
- **Page Layout**: Optimize margins and orientation

## When to Invoke

1. Document needs professional formatting for presentations
2. Reports need to be visually appealing
3. Academic papers require proper formatting
4. Creating resumes or CVs
5. User wants to apply consistent styling across documents
6. Document needs table of contents or cover page

## Styling Options

### Heading Styles
- Modern clean headings with proper spacing
- Consistent font sizes and weights
- Automatic numbering for sections

### Color Schemes
| Scheme | Description |
|--------|-------------|
| `professional` | Blue-gray tones for business documents |
| `academic` | Black-white with subtle accents |
| `creative` | Vibrant but professional colors |
| `minimal` | Clean white with gray accents |

### Font Presets
- **Business**: Calibri or Arial
- **Academic**: Times New Roman
- **Modern**: Open Sans or Roboto
- **Classic**: Georgia or Garamond

### Layout Options
- Page margins: Narrow, Normal, Wide
- Line spacing: Single, 1.5x, Double
- Paragraph indentation: First line or hanging

## Usage Examples

### Example 1: Basic beautification

```
Beautify report.docx
```

### Example 2: With specific style

```
Beautify document.docx with style: professional
```

### Example 3: Custom settings

```
Beautify thesis.docx with:
- Style: academic
- Font: Times New Roman
- Add TOC: yes
- Add cover page: yes
```

### Example 4: Apply theme to multiple files

```
Apply professional theme to all docx files in reports/
```

## Beautification Options

| Option | Description | Default |
|--------|-------------|---------|
| `style` | Style preset (professional/academic/creative/minimal) | professional |
| `font` | Font family (business/academic/modern/classic) | business |
| `addTOC` | Generate table of contents | false |
| `addCover` | Add professional cover page | false |
| `addHeaderFooter` | Add header/footer | false |
| `lineSpacing` | Line spacing (single/1.5/double) | 1.5 |
| `margins` | Page margins (narrow/normal/wide) | normal |

## Output Format

```
┌─────────────────────────────────────────────────────────────┐
│ DOCX BEAUTIFICATION REPORT                                │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│ Original File: report.docx                                │
│ Style Applied: professional                               │
│                                                           │
│ [✓] Heading Styles: Applied 3 heading levels              │
│ [✓] Font Scheme: Calibri (11pt)                          │
│ [✓] Line Spacing: 1.5x                                   │
│ [✓] Paragraph Indentation: First line (0.5")             │
│ [✓] Table Enhancement: 2 tables formatted                │
│ [✓] Color Scheme: Professional blue-gray                 │
│ [✓] Page Margins: Normal (1")                            │
│                                                           │
│ [✓] Table of Contents: Generated                         │
│ [✓] Cover Page: Added                                    │
│                                                           │
│ Output File: report_beautified.docx                       │
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

## Preset Styles

### Professional Style
- Color scheme: Blue (#1F4E79) with gray accents
- Font: Calibri 11pt
- Clean modern headings
- Suitable for business reports

### Academic Style
- Color scheme: Black with subtle blue accents
- Font: Times New Roman 12pt
- Classic academic formatting
- Suitable for theses and papers

### Creative Style
- Color scheme: Teal and orange accents
- Font: Open Sans 11pt
- Modern creative layout
- Suitable for portfolios and proposals

### Minimal Style
- Color scheme: Monochrome grayscale
- Font: Arial 11pt
- Clean minimalist design
- Suitable for resumes and CVs

## Benefits

1. **Professional Appearance**: Documents look polished and well-designed
2. **Consistency**: Uniform styling throughout the document
3. **Time Saving**: Automated formatting saves manual effort
4. **Improved Readability**: Better typography and layout
5. **Impressive Presentations**: Stand out with visually appealing documents

## Notes

- Always keep a backup of the original file
- Complex documents may require manual adjustments
- Some custom formatting may be overwritten
- Table of contents requires heading styles in the document
