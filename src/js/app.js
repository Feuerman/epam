var events = {};

var productsCtrl, product;

$(function () {
	productsCtrl = new ProductController();
	products = productsCtrl.products;

	productsCtrl.showProducts(products);

	$('.tablesorter').tablesorter({
		headers: {
			0: {sorter: "text"},
			1: {sorter: false},
			2: {sorter: "digit"},
			3: {sorter: false}
		}
	});

	$('body').on('click','.add', events.addProduct);
	$('body').on('click','.edit', events.editProduct);
	$('body').on('click','.remove', events.removeProduct);

	$('button.search').on('click', events.search);
	$('button.showAll').on('click', events.showAll);

	$('body').on('focus', '#price', events.inPrice);
	$('body').on('blur', '#price', events.outPrice);
});