from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import logging
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)

def get_db_connection():
    conn = sqlite3.connect('bookstore.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create products table if not exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        _id TEXT PRIMARY KEY,
        bookName TEXT,
        author TEXT,
        originalPrice REAL,
        discountedPrice REAL,
        discountPercent INTEGER,
        imgSrc TEXT,
        imgAlt TEXT,
        badgeText TEXT,
        outOfStock BOOLEAN,
        fastDeliveryAvailable BOOLEAN,
        genre TEXT,
        rating INTEGER,
        description TEXT
    )
    ''')

    # Create wishlist table if not exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id TEXT,
        FOREIGN KEY (book_id) REFERENCES products (_id)
    )
    ''')

    # Create cart table if not exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id TEXT,
        FOREIGN KEY (book_id) REFERENCES products (_id)
    )
    ''')

    # Create users table if not exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    ''')

    # Create newArrivalList table if not exists
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS newArrivalList (
        _id TEXT PRIMARY KEY,
        bookName TEXT,
        author TEXT,
        originalPrice REAL,
        discountedPrice REAL,
        discountPercent INTEGER,
        imgSrc TEXT,
        imgAlt TEXT,
        badgeText TEXT,
        outOfStock BOOLEAN,
        fastDeliveryAvailable BOOLEAN,
        genre TEXT,
        rating INTEGER,
        description TEXT
    )
    ''')
    
    conn.commit()
    conn.close()
    app.logger.info("Database initialized successfully")

# Initialize the database
with app.app_context():
    init_db()

@app.route('/api/home/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM newArrivalList")
    products = cursor.fetchall()
    conn.close()
    
    return jsonify({"productsList": [dict(product) for product in products]})

@app.route('/api/home/products', methods=['POST'])
def add_product():
    data = request.json
    product = data.get('productDetails')
    
    if not product or '_id' not in product:
        return jsonify({"status": "error", "message": "Invalid product data"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO products 
            (_id, bookName, author, originalPrice, discountedPrice, discountPercent, 
            imgSrc, imgAlt, badgeText, outOfStock, fastDeliveryAvailable, genre, 
            rating, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            product['_id'], product['bookName'], product['author'], product['originalPrice'],
            product['discountedPrice'], product['discountPercent'], product['imgSrc'],
            product['imgAlt'], product['badgeText'], product['outOfStock'],
            product['fastDeliveryAvailable'], product['genre'], product['rating'],
            product['description']
        ))
        conn.commit()
        return jsonify({"status": "ok", "message": "Product added successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error adding product: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to add product"}), 500
    finally:
        conn.close()

@app.route('/api/home/products/<string:id>', methods=['DELETE'])
def remove_product(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM products WHERE _id = ?", (id,))
        conn.commit()
        return jsonify({"status": "ok", "message": "Product removed successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error removing product: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to remove product"}), 500
    finally:
        conn.close()

@app.route('/api/user', methods=['GET'])
def get_user_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Fetch wishlist
        cursor.execute('''
            SELECT p.* FROM products p
            JOIN wishlist w ON p._id = w.book_id
        ''')
        wishlist = cursor.fetchall()

        # Fetch cart
        cursor.execute('''
            SELECT p.* FROM products p
            JOIN cart c ON p._id = c.book_id
        ''')
        cart = cursor.fetchall()
        
        return jsonify({
            "status": "ok",
            "user": {
                "wishlist": [dict(book) for book in wishlist],
                "cart": [dict(item) for item in cart]
            }
        }), 200
    except Exception as e:
        app.logger.error(f"Unexpected error fetching user data: {str(e)}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    finally:
        conn.close()

@app.route('/api/wishlist', methods=['PATCH'])
def add_to_wishlist():
    data = request.json
    product = data.get('productdetails')
    
    if not product or '_id' not in product:
        return jsonify({"status": "error", "message": "Invalid product data"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Add product to products table if not exists
        cursor.execute("INSERT OR IGNORE INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                       (product['_id'], product['bookName'], product['author'], product['originalPrice'],
                        product['discountedPrice'], product['discountPercent'], product['imgSrc'],
                        product['imgAlt'], product['badgeText'], product['outOfStock'],
                        product['fastDeliveryAvailable'], product['genre'], product['rating'],
                        product['description']))

        # Add to wishlist
        cursor.execute("INSERT OR IGNORE INTO wishlist (book_id) VALUES (?)", (product['_id'],))
        conn.commit()

        return jsonify({"status": "ok", "message": "Product added to wishlist"}), 200
    except Exception as e:
        app.logger.error(f"Error adding product to wishlist: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to add product to wishlist"}), 500
    finally:
        conn.close()

@app.route('/api/wishlist/<string:id>', methods=['DELETE'])
def remove_from_wishlist(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM wishlist WHERE book_id = ?", (id,))
        conn.commit()
        return jsonify({"status": "ok", "message": "Product removed from wishlist"}), 200
    except Exception as e:
        app.logger.error(f"Error removing product from wishlist: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to remove product from wishlist"}), 500
    finally:
        conn.close()

@app.route('/api/cart', methods=['PATCH'])
def add_to_cart():
    data = request.json
    product = data.get('productdetails')
    
    if not product or '_id' not in product:
        return jsonify({"status": "error", "message": "Invalid product data"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Add product to products table if not exists
        cursor.execute("INSERT OR IGNORE INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                       (product['_id'], product['bookName'], product['author'], product['originalPrice'],
                        product['discountedPrice'], product['discountPercent'], product['imgSrc'],
                        product['imgAlt'], product['badgeText'], product['outOfStock'],
                        product['fastDeliveryAvailable'], product['genre'], product['rating'],
                        product['description']))

        # Add to cart
        cursor.execute("INSERT OR IGNORE INTO cart (book_id) VALUES (?)", (product['_id'],))
        conn.commit()

        return jsonify({"status": "ok", "message": "Product added to cart"}), 200
    except Exception as e:
        app.logger.error(f"Error adding product to cart: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to add product to cart"}), 500
    finally:
        conn.close()

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('newUserName')
    email = data.get('newUserEmail')
    password = data.get('newUserPassword')

    if not username or not email or not password:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    hashed_password = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                       (username, email, hashed_password))
        conn.commit()
        return jsonify({"status": "ok"}), 200
    except sqlite3.IntegrityError:
        return jsonify({"status": "error", "message": "Username or email already exists"}), 409
    except Exception as e:
        app.logger.error(f"Error during signup: {str(e)}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('userEmail')
    password = data.get('userPassword')

    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user['password'], password):
            return jsonify({"status": "ok", "user": user['id']}), 200
        else:
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401
    except Exception as e:
        app.logger.error(f"Error during login: {str(e)}")
        return jsonify({"status": "error", "message": "An unexpected error occurred"}), 500
    finally:
        conn.close()

@app.route('/api/newArrivalList', methods=['GET'])
def get_new_arrivals():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM newArrivalList")
    new_arrivals = cursor.fetchall()
    conn.close()
    
    return jsonify({"newArrivalList": [dict(product) for product in new_arrivals]})

@app.route('/api/newArrival', methods=['POST'])
def add_new_arrival():
    data = request.json
    product = data.get('productDetails')
    
    if not product or '_id' not in product:
        return jsonify({"status": "error", "message": "Invalid product data"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT OR REPLACE INTO newArrivalList 
            (_id, bookName, author, originalPrice, discountedPrice, discountPercent, 
            imgSrc, imgAlt, badgeText, outOfStock, fastDeliveryAvailable, genre, 
            rating, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            product['_id'], product['bookName'], product['author'], product['originalPrice'],
            product['discountedPrice'], product['discountPercent'], product['imgSrc'],
            product['imgAlt'], product['badgeText'], product['outOfStock'],
            product['fastDeliveryAvailable'], product['genre'], product['rating'],
            product['description']
        ))
        conn.commit()
        return jsonify({"status": "ok", "message": "New arrival added successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error adding new arrival: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to add new arrival"}), 500
    finally:
        conn.close()

@app.route('/api/newArrival/<string:id>', methods=['DELETE'])
def remove_new_arrival(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("DELETE FROM newArrivalList WHERE _id = ?", (id,))
        conn.commit()
        return jsonify({"status": "ok", "message": "New arrival removed successfully"}), 200
    except Exception as e:
        app.logger.error(f"Error removing new arrival: {str(e)}")
        return jsonify({"status": "error", "message": "Failed to remove new arrival"}), 500
    finally:
        conn.close()

@app.errorhandler(Exception)
def handle_error(e):
    app.logger.error(f"Unhandled exception: {str(e)}")
    return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)