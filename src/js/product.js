function Product(params){
	this.name = params.name;
	this.count = +params.count;
	this.price = +params.price;
};

function ProductController(){
	this.counter = 1;
	this.products = [];

	this.addProduct(new Product({
		name: 'Keyboard',
		count: 57,
		price: 200
	}));
	this.addProduct(new Product({
		name: 'Mouse',
		count: 30,
		price: 120.21
	}));
	this.addProduct(new Product({
		name: 'Monitor',
		count: 95,
		price: 1280
	}));
	this.addProduct(new Product({
		name: 'Gamepad',
		count: 43,
		price: 280
	}));
	this.addProduct(new Product({
		name: 'CPU',
		count: 18,
		price: 1500.55
	}));

};

ProductController.prototype.addProduct = function(product){
	product.id = this.counter++;
	this.products.push(product);

	return product;
};

ProductController.prototype.editProduct = function(product){
	var current = this.getById(product.id);

	current.name = product.name;
	current.count = product.count;
	current.price = product.price;
};

ProductController.prototype.removeProduct = function (id) {
	var index = this.products.getIndex('id', id);

	this.products.splice(index, 1);
};

Array.prototype.getIndex = function(attr, value) {
	for (var i = 0; i < this.length; i++) {
		if (this[i][attr] === value) {
			return i;
		}
	}
};

ProductController.prototype.showProducts = function(products){
	container = $('.products-table tbody');

	$(container).empty();

	for (var i = 0; i <= products.length - 1; i++) {
		this.addRow(products[i]);
	};
};

ProductController.prototype.searchByName = function (search) {
	return this.products.filter(function (product) {
		return product.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
	});
};

ProductController.prototype.getById = function (id) {
	return products.filter(function (product) {
		return product.id === id;
	})[0];
};

ProductController.prototype.addRow = function(product){
	var productRow = 	'<tr>' +
							'<td>' + product.name + '</td>' +
							'<td>' + product.count + '</td>' +
							'<td>' + product.price + '</td>' +
							'<td class="text-center">' +
								'<span class="glyphicon glyphicon-edit edit" product-id="' + product.id + '" title="Update"></span>' +
								'<span class="glyphicon glyphicon-remove remove" product-id="' + product.id + '" title="Delete"></span>' +
							'</td>' +
						'</tr>';

	$(container).append(productRow);
};

Number.prototype.moneyFormat = function () {
	return '$' + this.toFixed(2).replace(/./g, function (c, i, a) {
		return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
	});
};