import tensorflow as tf
import numpy as np
from PIL import Image
from class_names import class_names
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet50 import preprocess_input
from sklearn.neighbors import NearestNeighbors
import os

# Załaduj modele
model = tf.keras.models.load_model('model1.h5')
feature_extractor = ResNet50(weights='imagenet', include_top=False, pooling='avg')

def load_image(image_path):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(150, 150))
    img = tf.keras.preprocessing.image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255
    return img

def extract_features(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_data = image.img_to_array(img)
    img_data = np.expand_dims(img_data, axis=0)
    img_data = preprocess_input(img_data)
    features = feature_extractor.predict(img_data)
    return features.flatten()

def build_feature_database(image_folder):
    feature_database = {}
    for root, dirs, files in os.walk(image_folder):
        for file in files:
            img_path = os.path.join(root, file)
            features = extract_features(img_path)
            feature_database[img_path] = features
    return feature_database

def find_similar_images(query_features, feature_database, k=5):
    feature_list = list(feature_database.values())
    image_paths = list(feature_database.keys())
    
    if not feature_list:
        raise ValueError("Feature list is empty. Ensure that the feature database is built correctly.")
    
    nbrs = NearestNeighbors(n_neighbors=k, algorithm='ball_tree').fit(feature_list)
    distances, indices = nbrs.kneighbors([query_features])
    
    similar_images = [image_paths[idx] for idx in indices[0]]
    return similar_images

def classify_image(query_image_path, mushroom_features, not_mushroom_features, k=5):
    query_features = extract_features(query_image_path)
    similar_mushrooms = find_similar_images(query_features, mushroom_features, k)
    similar_not_mushrooms = find_similar_images(query_features, not_mushroom_features, k)
    
    mushroom_count = len(similar_mushrooms)
    not_mushroom_count = len(similar_not_mushrooms)
    
    if mushroom_count > not_mushroom_count:
        return True  # The image depicts a mushroom
    else:
        return False  # The image does not depict a mushroom

def predict_top_3_classes(model, image_path, class_names):
    img = load_image(image_path)
    predictions = model.predict(img)[0]
    top_3_indices = np.argsort(predictions)[-3:][::-1]
    return [(class_names[i], predictions[i]) for i in top_3_indices]

# Przykład użycia
mushroom_folder = 'dataset/mushrooms'
not_mushroom_folder = 'dataset2/not_mushroom'
mushroom_features = build_feature_database(mushroom_folder)
not_mushroom_features = build_feature_database(not_mushroom_folder)

# Debugowanie
print(f"Number of mushroom features: {len(mushroom_features)}")
print(f"Number of not mushroom features: {len(not_mushroom_features)}")

image_path = './dataset/Cetraria islandica/4024medium.jpeg'
if classify_image(image_path, mushroom_features, not_mushroom_features):
    print(predict_top_3_classes(model, image_path, class_names))
else:
    print("The image does not depict a mushroom.")