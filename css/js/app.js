// DATA INITIAL PRODUK
let products = [
    { id: 1, name: "T-Shirt Oversize Sandikale", category: "Apparel", price: 135000, stock: 25, icon: "fa-shirt" },
    { id: 2, name: "Totebag Canvas Black", category: "Bag", price: 65000, stock: 40, icon: "fa-bag-shopping" },
    { id: 3, name: "Keychain Akrilik Event", category: "Accessories", price: 15000, stock: 100, icon: "fa-key" },
    { id: 4, name: "Lanyard Custom Printed", category: "Accessories", price: 25000, stock: 60, icon: "fa-id-badge" },
    { id: 5, name: "Mug Keramik Sandikale", category: "Accessories", price: 45000, stock: 18, icon: "fa-mug-hot" },
    { id: 6, name: "Sticker Pack Vinyl (Isi 5)", category: "Accessories", price: 20000, stock: 80, icon: "fa-note-sticky" }
];

let cart = [];
let activeCategory = 'All';

// FUNGSI UTAMA PERPINDAHAN MENU
function switchMenu(menuName, element) {
    console.log("Mencoba pindah ke menu:", menuName);

    // 1. Sembunyikan semua menu
    const allMenus = document.querySelectorAll('.menu-content');
    allMenus.forEach(menu => {
        menu.classList.add('hidden');
    });

    // 2. Tampilkan menu target
    const targetMenu = document.getElementById('menu-' + menuName);
    if (targetMenu) {
        targetMenu.classList.remove('hidden');
    } else {
        console.error("Menu tidak ditemukan: menu-" + menuName);
    }

    // 3. Ubah warna tombol aktif
    const allButtons = document.querySelectorAll('.menu-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('bg-brandRed', 'text-white');
        btn.classList.add('text-gray-300');
    });

    if (element) {
        element.classList.add('bg-brandRed', 'text-white');
        element.classList.remove('text-gray-300');
    }

    // 4. Render data sesuai menu
    if (menuName === 'produk') {
        renderProductTable();
    } else if (menuName === 'kasir') {
        renderProducts();
    }
}

// RENDER KATALOG KASIR
function renderProducts() {
    const listContainer = document.getElementById('product-list');
    if (!listContainer) return;

    const searchElem = document.getElementById('search-product');
    const searchInput = searchElem ? searchElem.value.toLowerCase() : '';

    listContainer.innerHTML = '';

    const filtered = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchInput);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = `<p class="text-xs text-gray-500 col-span-3 py-8 text-center">Produk tidak ditemukan.</p>`;
        return;
    }

    filtered.forEach(product => {
        listContainer.innerHTML += `
            <div onclick="addToCart(${product.id})" class="bg-brandGray border border-neutral-800 p-4 rounded-xl cursor-pointer hover:border-brandRed transition flex flex-col justify-between">
                <div>
                    <div class="w-10 h-10 bg-neutral-800 text-brandRed rounded-lg flex items-center justify-center mb-3 text-lg">
                        <i class="fa-solid ${product.icon}"></i>
                    </div>
                    <h4 class="font-bold text-sm text-white mb-1 line-clamp-1">${product.name}</h4>
                    <p class="text-xs text-gray-400 mb-2">Stok: ${product.stock}</p>
                </div>
                <div class="text-brandRed font-bold text-sm">
                    Rp ${product.price.toLocaleString('id-ID')}
                </div>
            </div>
        `;
    });
}

function filterCategory(category) {
    activeCategory = category;
    renderProducts();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        if (cartItem.qty < product.stock) {
            cartItem.qty += 1;
        } else {
            alert("Stok tidak mencukupi!");
        }
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function updateQty(productId, amount) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.qty += amount;
        if (cartItem.qty <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }
    updateCartUI();
}

function clearCart() {
    cart = [];
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cart-list');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="text-xs text-gray-500 text-center py-8">Keranjang belanja masih kosong.</p>`;
        const subTotalElem = document.getElementById('subtotal-val');
        const totalElem = document.getElementById('total-val');
        if (subTotalElem) subTotalElem.innerText = 'Rp 0';
        if (totalElem) totalElem.innerText = 'Rp 0';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;

        cartContainer.innerHTML += `
            <div class="flex items-center justify-between bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                <div class="flex-1">
                    <h5 class="text-xs font-bold text-white">${item.name}</h5>
                    <p class="text-[11px] text-gray-400">Rp ${item.price.toLocaleString('id-ID')}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="updateQty(${item.id}, -1)" class="w-6 h-6 bg-neutral-800 text-xs text-white rounded hover:bg-brandRed">-</button>
                    <span class="text-xs font-bold px-1">${item.qty}</span>
                    <button onclick="updateQty(${item.id}, 1)" class="w-6 h-6 bg-neutral-800 text-xs text-white rounded hover:bg-brandRed">+</button>
                </div>
            </div>
        `;
    });

    const subTotalElem = document.getElementById('subtotal-val');
    const totalElem = document.getElementById('total-val');
    if (subTotalElem) subTotalElem.innerText = `Rp ${total.toLocaleString('id-ID')}`;
    if (totalElem) totalElem.innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

function processPayment() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }
    alert("Transaksi Berhasil!");
    clearCart();
}

// RENDER TABEL PRODUK
function renderProductTable() {
    const tableBody = document.getElementById('product-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    products.forEach(p => {
        tableBody.innerHTML += `
            <tr class="hover:bg-neutral-800/50 transition">
                <td class="px-6 py-4 font-semibold text-white flex items-center gap-3">
                    <div class="w-8 h-8 bg-neutral-800 text-brandRed rounded flex items-center justify-center text-xs">
                        <i class="fa-solid ${p.icon}"></i>
                    </div>
                    ${p.name}
                </td>
                <td class="px-6 py-4"><span class="bg-neutral-800 text-xs px-2.5 py-1 rounded-full text-gray-300">${p.category}</span></td>
                <td class="px-6 py-4 text-brandRed font-semibold">Rp ${p.price.toLocaleString('id-ID')}</td>
                <td class="px-6 py-4">${p.stock} pcs</td>
                <td class="px-6 py-4 text-center">
                    <button onclick="deleteProduct(${p.id})" class="text-red-500 hover:text-red-400 text-xs font-semibold bg-red-950/30 px-3 py-1.5 rounded border border-red-900">
                        <i class="fa-solid fa-trash mr-1"></i> Hapus
                    </button>
                </td>
            </tr>
        `;
    });
}

// FUNGSI POP-UP MODAL
function openProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('add-product-form');
        if (form) form.reset();
    }
}

function saveProduct(event) {
    event.preventDefault();

    const name = document.getElementById('p-name').value;
    const category = document.getElementById('p-category').value;
    const price = parseInt(document.getElementById('p-price').value);
    const stock = parseInt(document.getElementById('p-stock').value);

    let icon = "fa-box";
    if (category === "Apparel") icon = "fa-shirt";
    if (category === "Bag") icon = "fa-bag-shopping";
    if (category === "Accessories") icon = "fa-star";

    products.push({ id: Date.now(), name, category, price, stock, icon });

    renderProducts();
    renderProductTable();
    closeProductModal();
    alert("Produk berhasil ditambahkan!");
}

function deleteProduct(id) {
    if (confirm("Yakin ingin menghapus produk ini?")) {
        products = products.filter(p => p.id !== id);
        renderProducts();
        renderProductTable();
    }
}

// JALANKAN SAAT HALAMAN SELESAI DIMUAT
document.addEventListener("DOMContentLoaded", () => {
    console.log("Aplikasi Kasir Siap!");
    renderProducts();
});
