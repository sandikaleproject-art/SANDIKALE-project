// DATA PRODUK DUMMY (SANDIKALE PROJECT)
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

// RENDER PRODUK KE HALAMAN
function renderProducts() {
    const listContainer = document.getElementById('product-list');
    const searchInput = document.getElementById('search-product').value.toLowerCase();
    
    listContainer.innerHTML = '';

    const filtered = products.filter(p => {
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchInput);
        return matchesCategory && matchesSearch;
    });

    if(filtered.length === 0) {
        listContainer.innerHTML = `<p class="text-xs text-gray-500 col-span-3 text-center py-6">Produk tidak ditemukan.</p>`;
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

// FILTER KATEGORI
function filterCategory(category) {
    activeCategory = category;
    renderProducts();
}

// TAMBAH KE KERANJANG
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        if(cartItem.qty < product.stock) {
            cartItem.qty += 1;
        } else {
            alert("Stok tidak mencukupi!");
        }
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

// UPDATE JUMLAH ITEM (PLUS/MINUS)
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

// KOSONGKAN KERANJANG
function clearCart() {
    cart = [];
    updateCartUI();
}

// RENDER KERANJANG BELANJA
function updateCartUI() {
    const cartContainer = document.getElementById('cart-list');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="text-xs text-gray-500 text-center py-8">Keranjang belanja masih kosong.</p>`;
        document.getElementById('subtotal-val').innerText = 'Rp 0';
        document.getElementById('total-val').innerText = 'Rp 0';
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

    document.getElementById('subtotal-val').innerText = `Rp ${total.toLocaleString('id-ID')}`;
    document.getElementById('total-val').innerText = `Rp ${total.toLocaleString('id-ID')}`;
}

// PROSES PEMBAYARAN
function processPayment() {
    if(cart.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }
    
    alert("Transaksi Berhasil! Nota siap dicetak.");
    clearCart();
}

// INISIALISASI
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});
// ==========================================
// LOGIKA MANAJEMEN PRODUK (CRUD)
// ==========================================

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

// BUKA & TUTUP MODAL
function openProductModal() {
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
    document.getElementById('add-product-form').reset();
}

// SIMPAN PRODUK BARU
function saveProduct(event) {
    event.preventDefault();

    const name = document.getElementById('p-name').value;
    const category = document.getElementById('p-category').value;
    const price = parseInt(document.getElementById('p-price').value);
    const stock = parseInt(document.getElementById('p-stock').value);

    // Tentukan icon berdasarkan kategori
    let icon = "fa-box";
    if (category === "Apparel") icon = "fa-shirt";
    if (category === "Bag") icon = "fa-bag-shopping";
    if (category === "Accessories") icon = "fa-star";

    const newProduct = {
        id: Date.now(), // ID Unik
        name,
        category,
        price,
        stock,
        icon
    };

    products.push(newProduct);
    
    // Refresh tampilan
    renderProducts();
    renderProductTable();
    closeProductModal();
    alert("Produk berhasil ditambahkan!");
}

// HAPUS PRODUK
function deleteProduct(id) {
    if (confirm("Yakin ingin menghapus produk ini?")) {
        products = products.filter(p => p.id !== id);
        renderProducts();
        renderProductTable();
    }
}

// UPDATE FUNGSI SWITCH MENU AGAR OTOMATIS RENDER TABEL
const oldSwitchMenu = window.switchMenu;
window.switchMenu = function(menuName) {
    document.querySelectorAll('.menu-content').forEach(el => el.classList.add('hidden'));
    document.getElementById('menu-' + menuName).classList.remove('hidden');
    
    if (menuName === 'produk') {
        renderProductTable();
    }
};
