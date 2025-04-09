# ##### havent fixed yet#########

# from flask import Flask, request, jsonify
# import os
# from inference_module import describe_clothing  # Import inference functions

# app = Flask(__name__)

# @app.route('/infer', methods=['POST'])
# def infer():
#     data = request.json
#     image_path = data.get("image_path")
#     clothing_id = data.get("clothing_id")

#     if not image_path or not clothing_id:
#         return jsonify({"status": "error", "message": "Missing image path or clothing ID"}), 400

#     try:
#         description = describe_clothing(image_path, clothing_id)
#         return jsonify({"status": "success", "description": description})
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500

# if __name__ == '__main__':
#     app.run(port=5001)  # Run on port 5001

# ############