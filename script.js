// Get DOM elements
const addProductBtn = document.getElementById('addProductBtn');
const formDiv = document.getElementById('formDiv');
const productContainer = document.getElementById('productContainer');
const backBtn = document.getElementById('backBtn');
const updateFormDiv = document.getElementById('updateFormDiv');
const updateBackBtn = document.getElementById('updateBackBtn');

// Initially hide the form
formDiv.style.display = 'none';

// Event listener for Add Product button
addProductBtn.addEventListener('click', function () {
    formDiv.style.display = 'block';
    addProductBtn.style.display = 'none';
    productContainer.style.display = 'none';
    document.body.classList.add('form-open');

});

// Event listener for Back button in the add product form
backBtn.addEventListener('click', function () {
    formDiv.style.display = 'none';
    addProductBtn.style.display = 'block';
    productContainer.style.display = 'flex';
    document.body.classList.remove('form-open');
});

// Event listener for submitting the add product form
document.getElementById('productForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const imageFile = document.getElementById('image').files[0];
    const reader = new FileReader();

    const idarray = JSON.parse(localStorage.getItem('idarray')) || [];
    idarray.push(1);
    localStorage.setItem('idarray', JSON.stringify(idarray));



    reader.onload = function (event) {
        // Create a new product object
        const product = {
            id: idarray.length,
            name: document.getElementById('productName').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value),
            image: event.target.result
        };

        // Add the new product to local storage
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));

        alert(`${product.name} added successfully!`);
        displayProduct(product);
        document.getElementById('productForm').reset();
        formDiv.style.display = 'none';
        addProductBtn.style.display = 'block';
        productContainer.style.display = 'flex';
        document.body.classList.remove('form-open');
    };

    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
});

// Load and display existing products
const products = JSON.parse(localStorage.getItem('products')) || [];
products.forEach(displayProduct);

// Function to display a single product
function displayProduct(product) {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.innerHTML = `
         <img src="${product.image}" alt="${product.name}">
         <h2>${product.name}</h2>
         <p>${product.description}</p>
         <p>Price: ₹ ${product.price.toFixed(2)}</p>
         <button class="edit" onclick="editProduct(${product.id})">Edit</button>
         <button class="delete" onclick="deleteProduct(${product.id})">Delete</button>
     `;
    document.getElementById('productContainer').appendChild(productElement);
}

// Function to edit a product
function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('updateProductId').value = product.id;
        document.getElementById('updateProductName').value = product.name;
        document.getElementById('updateDescription').value = product.description;
        document.getElementById('updatePrice').value = product.price;
        document.getElementById('updateImage').value = '';
        document.getElementById('imgdiv').innerHTML = `<img src="${product.image}" alt="${product.name}">`;

        updateFormDiv.style.display = 'block';
        formDiv.style.display = 'none';
        addProductBtn.style.display = 'none';
        productContainer.style.display = 'none';
        document.body.classList.add('update-form-open');
    }
}

// Event listener for Back button in the update form
updateBackBtn.addEventListener('click', function () {
    updateFormDiv.style.display = 'none';
    addProductBtn.style.display = 'block';
    productContainer.style.display = 'flex';
    document.body.classList.remove('update-form-open');
});

// Event listener for submitting the update product form
document.getElementById('updateProductForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const productId = parseInt(document.getElementById('updateProductId').value);
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const index = products.findIndex(p => p.id === productId);

    if (index !== -1) {
        const imageFile = document.getElementById('updateImage').files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            // Update the product in the array
            products[index] = {
                id: productId,
                name: document.getElementById('updateProductName').value,
                description: document.getElementById('updateDescription').value,
                price: parseFloat(document.getElementById('updatePrice').value),
                image: imageFile ? event.target.result : products[index].image
            };

            // Save updated products to local storage
            localStorage.setItem('products', JSON.stringify(products));
            alert(`${products[index].name} updated successfully!`);
            updateFormDiv.style.display = 'none';
            addProductBtn.style.display = 'block';
            productContainer.innerHTML = '';
            products.forEach(displayProduct);
            productContainer.style.display = 'flex';
            document.body.classList.remove('update-form-open');
        };

        if (imageFile) {
            reader.readAsDataURL(imageFile);
        } else {
            reader.onload();
        }
    }
});

// Function to delete a product
function deleteProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        let product = products[index];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        document.getElementById('productContainer').innerHTML = '';
        products.forEach(displayProduct);
        alert(`${product.name} deleted successfully!`);
    }
}



