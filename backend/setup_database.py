import sqlite3
import json

# Connect to the SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('bookstore.db')
cursor = conn.cursor()

# Create the newArrivalList table
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

# Sample data
book_data = {
    "_id": "623012bb16d6b222d99D64b",
    "bookName": "Adorable Girls' Adventure Storybook | Illustrated Tales of Friendship and Fun",
    "author": "",
    "originalPrice": 400,
    "discountedPrice": 200,
    "discountPercent": 25,
    "imgSrc": "https://cdn.discordapp.com/attachments/1042199440586453065/1283570926192955492/4.png?ex=66e37a14&is=66e22894&hm=ceafe5b3b225172e00fbc2dbd9988a1cd4839581cf55a7b611dfe93d75e6272f&",
    "imgAlt": "Pink Daily Planner",
    "badgeText": "New Arrival",
    "outOfStock": False,
    "fastDeliveryAvailable": True,
    "genre": "Management",
    "rating": 5,
    "description": "Introducing our Pink Digital Planner, the ultimate tool for those who love to stay organized while adding a touch of elegance and personality to their planning routine. Designed with a soft, pastel pink theme, this digital planner offers a blend of functionality and aesthetics, making it perfect for anyone who wants to plan their days in style."
}

# Insert the data into the table
cursor.execute('''
INSERT OR REPLACE INTO newArrivalList (
    _id, bookName, author, originalPrice, discountedPrice, discountPercent,
    imgSrc, imgAlt, badgeText, outOfStock, fastDeliveryAvailable,
    genre, rating, description
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
''', (
    book_data['_id'], book_data['bookName'], book_data['author'],
    book_data['originalPrice'], book_data['discountedPrice'], book_data['discountPercent'],
    book_data['imgSrc'], book_data['imgAlt'], book_data['badgeText'],
    book_data['outOfStock'], book_data['fastDeliveryAvailable'],
    book_data['genre'], book_data['rating'], book_data['description']
))

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Database setup complete. Data inserted successfully.")