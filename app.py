from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

@app.route("/")
def index():

    connection = sqlite3.connect("manager.db")
    connection.row_factory = sqlite3.Row
    rows = connection.execute("SELECT * FROM manager").fetchall()
    connection.close()

    return render_template("index.html", rows=rows)

@app.route("/api/add", methods=["POST"])
def add_password():
    data = request.json
    try:
        connection = sqlite3.connect("manager.db")
        connection.execute("INSERT INTO manager (email, username, passwd, note) VALUES (?, ?, ?, ?)",
                           (data.get('email'), data.get('username'), data.get('password'), data.get('note')))
        connection.commit()
        connection.close()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/delete/<int:id>", methods=["DELETE"])
def delete_password(id):
    try:
        connection = sqlite3.connect("manager.db")
        connection.execute("DELETE FROM manager WHERE id = ?", (id,))
        connection.commit()
        connection.close()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/api/update/<int:id>", methods=["PUT"])
def update_password(id):
    data = request.json
    try:
        connection = sqlite3.connect("manager.db")
        connection.execute("UPDATE manager SET email=?, username=?, passwd=?, note=? WHERE id=?",
                           (data.get('email'), data.get('username'), data.get('password'), data.get('note'), id))
        connection.commit()
        connection.close()
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500