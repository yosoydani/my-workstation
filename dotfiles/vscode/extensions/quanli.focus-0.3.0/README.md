# Focus

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version/QuanLi.focus.svg)](https://marketplace.visualstudio.com/items?itemName=QuanLi.focus) [![Installs](https://vsmarketplacebadge.apphb.com/installs/QuanLi.focus.svg)](https://marketplace.visualstudio.com/items?itemName=QuanLi.focus) [![Rating](https://vsmarketplacebadge.apphb.com/rating/QuanLi.focus.svg)](https://marketplace.visualstudio.com/items?itemName=QuanLi.focus)

Highlight code lines/code blcok what you are focus on.

![Usage](https://github.com/mzzw/focus/raw/master/images/usage01.png)

## Features

* Highlight current line.
* Highlight fixed configuration numbers of lines.
* Highlight lines by indent.
* Highlight code block.

## Usages

* Just install it.
* We provide commands and statusbar button that help you quickly change level.

![Usage](https://github.com/mzzw/focus/raw/master/images/usage02.png)


## Configuration

Set the level by json or UI:

``` json
"focus.highlightRange":"line"   //Highlight current line
"focus.highlightRange":"block"  //Highlight code block which range by `{` and `}`
"focus.highlightRange":"indent" //Highlight lines by indent
"focus.highlightRange":"fixed"  //Highlight line counts by configuration
```

When the level set to *fixed*,configurate how many line to highlight:

``` json
"focus.highlightLines":5
```

Configurate opacity:

``` json
"focus.opacity":0.7 //number between (0,1)
```

![Usage](https://github.com/mzzw/focus/raw/master/images/usage03.png)

## Change Log
See Change Log [here](https://github.com/mzzw/focus/blob/master/CHANGELOG.md)

## Issues
Submit the [issues](https://github.com/mzzw/focus/issues) if you find any bug or have any suggestion.

## Contribution
Fork the [repo](https://github.com/mzzw/focus) and submit pull requests.
