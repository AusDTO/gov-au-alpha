---
layout: test-pages/article-template
title:  "Article Page"
date_published: 20 Nov 2015
type: "News Story"
section: "Testing the Articles"
description: This is a template page for articles.
categories: test-pages
include_on_homepage: true
---

# H1 Page header - Article heading

The lead paragraph is special, it is the first paragraph and it has a 'lead' class on it. It is a paragraph and it has some text which will be displayed in line with the body css styling and wrap when it becomes to long for the page. It will have sentenses and words and whatnot. 

This is a standard paragraph that comes after the the intro paragraph and has all the standard attributes. 

# H1 Page header - Article heading

<p class="normal">If there is a case for an author to NOT have a lead class on the article then they will have to use the normal class and an HTML paragraph tag. This is only necessary after an H1 tag. Example: 
</p>
<code><p class="normal">The content of the paragraph</p></code>

## H2 Heading

Standard paragraph. Font size is set to 16px. Line height is 24px. Letter spacing is 0.15px. 

### H3 Heading

This is a paragraph and it has some text which will be displayed in line with the body css styling and wrap when it becomes to long for the page. It will have sentenses and words and whatnot. Ramble ramble ramble.

#### H4 Heading

This is a paragraph and it has some text which will be displayed in line with the body css styling and wrap when it becomes to long for the page. It will have sentenses and words and whatnot. Ramble ramble ramble.

##### H5 Heading

This is a paragraph and it has some text which will be displayed in line with the body css styling and wrap when it becomes to long for the page. It will have sentenses and words and whatnot. Ramble ramble ramble.

###### H6 Heading

This is a paragraph and it has some text which will be displayed in line with the body css styling and wrap when it becomes to long for the page. It will have sentenses and words and whatnot. Ramble ramble ramble.

And now heres another paragraph so we can see how they look next to each other and how much space is in between each. So many paragraphs...


<p class="list-heading">Bullet point list:</p>

- Unordered lists inherit the paragraph style due to the markdown inserting a <code><p></code> tag inside the <code><li></code> tag. We have over-ridden the padding and margin as the list classes have their own.

- another thing

- some third thing

<p class="list-heading">Numbered list:</p>

1. a thing

2. another thing

3. some third thing

> block quotes look like this and 
> they can be on multiple lines in the markdown

<figcaption>This is a figure caption</figcaption>

<a href="#">A link</a>

There can be <a href="#">links</a> in paragraphs too and they should appear like a regular paragraph. Then the link within the paragraph should be styled like a link as well and this is an example.

<table>
    <thead>
        <tr>
            <th>table heading</th>
            <th>another heading</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>content</td>
            <td>more content</td>
        </tr>
        <tr>
            <td>content again</td>
            <td>even more content</td>
        </tr>
    </tbody>
</table>



