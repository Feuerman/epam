events.addProduct = function() {
	$.ajax({
		url: '/epam-test/build/templates/formProduct.html',
		cache: true,
		success: function (data) {

			var data = data.replace(/(?:\r\n|\r|\n)/g, '');
			var form;

			var add = function(dialog) {
				if (!form.valid()) {
					return;
				}

				var product = new Product({
					name: $('#name').val(),
					count: +$('#count').val(),
					price: +$('#price').val().replace(/(\$|,)/g, '')
				});

				product = productsCtrl.addProduct(product);
				productsCtrl.addRow(product);

				notifyShow.showSuccess('New product added');
				dialog.close();
			};

			showModal.showDialog({
				title: 'Add new',
				message: data,
				buttons: [
					{
						label: 'Add',
						cssClass: 'btn-primary',
						action: add
					},
					{
						label: 'Close',
						cssClass: 'btn-primary',
						action: function (dialog) {
							dialog.close();
						}
					}
				],
				onshown: function() {
					form = $('form.add-new');
					form.validate(regulations);
				}
			});
		}
	});
};

events.editProduct = function() {

	var $this = $(this);

	var productId = +$this.attr('product-id');
	var product = productsCtrl.getById(productId);

	$.ajax({
		url: '/epam-test/build/templates/formProduct.html',
		cache: true,
		success: function (data) {
			var data = data.replace(/(?:\r\n|\r|\n)/g, '');

			var form = $(data);

			form.find('#name').val(product.name);
			form.find('#price').val(product.price.moneyFormat());
			form.find('#count').val(product.count);

			var edit = function (dialog) {
				if (!form.valid()) {
					return;
				}

				product.name = $('#name').val();
				product.count = +$('#count').val();
				product.price = +$('#price').val().replace(/(\$|,)/g, '');

				productsCtrl.editProduct(product);
				$this.closest('tr').remove();
				$('.tablesorter').trigger("update");

				productsCtrl.addRow(product);

				notifyShow.showSuccess('Product edited');
				dialog.close();
			};

			showModal.showDialog({
				title: 'Edit product',
				message: form,
				buttons: [
					{
						label: 'Update',
						cssClass: 'btn-primary',
						action: edit
					},
					{
						label: 'Close',
						cssClass: 'btn-primary',
						action: function(dialog) {
							dialog.close();
						}
					}
				],
				onshown: function () {
					form.validate(regulations);
				}
			});
		}
	});
};

events.removeProduct = function () {

    var $this = $(this);

	showModal.showDialog({
		title: 'Removal confirmation',
		message: 'Remove items?',
		buttons: [
			{
				label: 'Yes',
				cssClass: 'btn-danger',
				action: function (dialog) {
					var productId = +$this.attr('product-id');

					productsCtrl.removeProduct(productId);
					$this.closest('tr').remove();

					$('.tablesorter').trigger("update");

					notifyShow.showSuccess('Product deleted');
					dialog.close();
				}
			},
			{
				label: 'No',
				cssClass: 'btn-primary',
				action: function (dialog) {
					dialog.close();
				}
			}
		]
	});
};

events.search = function() {
	var search = $('input.search').val();

	if (!search) {
		notifyShow.showError('Please, enter the query');
		return;
	}

	var searchProducts = productsCtrl.searchByName(search);
	productsCtrl.showProducts(searchProducts);
};

events.showAll = function(){
	$('input.search').val('');
	productsCtrl.showProducts(products);
}; 

var showModal = (function() {
	return {
		showDialog: function (options) {
			BootstrapDialog.show(options);
		}
	}
})();

var notifyShow = (function () {
	var notify = function (message, type) {
		$('.notification').notify({
			message: { text: message },
			type: type
		}).show();
	};

	return {
		showError: function (message) {
			notify(message, 'danger');
		},
		showSuccess: function (message) {
			notify(message, 'success');
		},
		showInfo: function (message) {
			notify(message, 'info');
		}
	}
})();

var regulations = {
	rules: {
		name: {
			required: true,			
			pattern: /\S/,
			maxlength: 15
		},
		price: {
			validPrice: true
		}
	},
	messages: {
		name: {
			pattern: 'The field can not consist solely of spaces'
		},
		price: {
			validPrice: 'Enter the number'
		}
	}
};

var options = {
	highlight: function(field) {
		$(field).parents('.form-group').removeClass('has-success').addClass('has-error');
	},
	unhighlight: function(field) {
		$(field).parents('.form-group').removeClass('has-error');
	},
	errorElement: 'span',
	errorPlacement: function(error, field) {
		error.insertAfter(field);
	}
};

$.validator.setDefaults(options);

$.validator.addMethod('pattern', function (value, element, pattern) {
	return pattern.test(value);
});

$.validator.addMethod('validPrice', function (value) {
	return !isNaN(+value.replace(/(\$|,)/g, ''));
});

events.inPrice = function() {
	this.value = this.value.replace(/(\$|,)/g, '');
};

events.outPrice = function () {
	var value = +this.value;

	if (!isNaN(value)) {
		this.value = value.moneyFormat();
	}
};