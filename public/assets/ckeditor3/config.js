/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {
    // Define changes to default configuration here. For example:
    config.language = 'vi';
    config.htmlEncodeOutput = false;
    config.entities = false;
    config.entities_latin = false;
    config.fillEmptyBlocks = false;
    config.basicEntities = false;
    config.allowedContent = false;
    //config.filebrowserUploadMethod = 'form';

    config.filebrowserBrowseUrl = '/assets/ckfinder/ckfinder.html';
    config.filebrowserImageBrowseUrl = '/assets/ckfinder/ckfinder.html?type=Images';
    config.filebrowserFlashBrowseUrl = '/assets/ckfinder/ckfinder.html?type=Flash';
    config.filebrowserUploadUrl = '/assets/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files';
    config.filebrowserImageUploadUrl = '/assets/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images';
    config.filebrowserFlashUploadUrl = '/assets/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash';

    config.toolbar = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Undo', 'Redo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ], items: [ 'Find', 'Replace' ] },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-' ] },
		{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
		{ name: 'insert', items: [ 'Image', 'Iframe', 'Table', 'SpecialChar' ] },
		'/',
		{ name: 'styles', items: [ 'Format' ] }
	];

	// // Set the most common block elements.
	config.format_tags = 'p;h2;h3;h4;h5;h6';

	// // figcaption img
	//config.extraPlugins = 'image2';
};