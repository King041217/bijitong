---
name: "docx-optimizer"
description: "Optimizes DOCX files by compressing images, removing unused styles, reducing file size, and improving document structure. Invoke when user needs to reduce DOCX file size or improve document performance."
---

# DOCX Optimizer

## Overview

This skill optimizes DOCX files to reduce file size, improve loading performance, and ensure better compatibility across different applications.

## Features

- **Image Compression**: Reduce image resolution and quality to minimize file size
- **Style Cleanup**: Remove unused styles, themes, and fonts
- **Metadata Removal**: Strip document metadata (author, creation date, etc.)
- **Embedded Object Optimization**: Handle embedded objects efficiently
- **Compression**: Apply ZIP compression optimization
- **Format Standardization**: Ensure consistent formatting throughout the document

## When to Invoke

1. DOCX file is too large to email or upload
2. Document loads slowly in Word or other editors
3. Need to remove sensitive metadata before sharing
4. Document contains unused styles that need cleanup
5. User specifically asks to optimize a DOCX file

## Optimization Techniques

### Image Optimization
- Reduce image resolution (e.g., from 300dpi to 150dpi)
- Convert images to more efficient formats
- Compress images while maintaining visual quality

### Style and Format Cleanup
- Remove unused styles from the document
- Delete empty paragraphs and sections
- Normalize font usage
- Remove unused themes and color schemes

### Metadata Removal
- Document properties (author, title, subject)
- Comments and tracked changes
- Hidden text and personal information
- Document revision history

### Structural Optimization
- Remove empty tables and rows
- Optimize table structure
- Clean up XML formatting
- Reduce redundant content

## Usage Examples

### Example 1: Optimize a single file

```
Optimize docx file: report.docx
```

### Example 2: Optimize with custom settings

```
Optimize document.docx with:
- Image quality: medium
- Remove metadata: yes
- Compress images: yes
```

### Example 3: Batch optimization

```
Optimize all docx files in documents/ folder
```

## Optimization Options

| Option | Description | Default |
|--------|-------------|---------|
| `imageQuality` | Image compression quality (low/medium/high) | medium |
| `removeMetadata` | Remove document metadata | true |
| `removeStyles` | Remove unused styles | true |
| `imageResolution` | Target image resolution in DPI | 150 |
| `compress` | Apply additional compression | true |

## Output Format

The skill provides a summary report:

```
┌─────────────────────────────────────────────────────────────┐
│ DOCX OPTIMIZATION REPORT                                   │
├─────────────────────────────────────────────────────────────┤
│                                                           │
│ Original File: report.docx                                │
│ Original Size: 2,456 KB                                   │
│ Optimized Size: 892 KB                                    │
│ Savings: 63.7%                                            │
│                                                           │
│ [✓] Image Compression: 12 images optimized                │
│ [✓] Metadata Removal: Removed 23 metadata entries         │
│ [✓] Style Cleanup: Removed 15 unused styles               │
│ [✓] Empty Content: Removed 8 empty paragraphs            │
│                                                           │
│ Output File: report_optimized.docx                        │
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

## Benefits

1. **Reduced File Size**: Significant reduction in document size
2. **Faster Loading**: Documents open and load more quickly
3. **Better Sharing**: Easier to email or upload
4. **Privacy Protection**: Removes sensitive metadata
5. **Improved Compatibility**: More consistent across applications

## Notes

- Always keep a backup of the original file
- Image optimization may affect visual quality for high-resolution prints
- Metadata removal is irreversible - ensure you don't need this information
- Some advanced formatting may be affected by style cleanup
