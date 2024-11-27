import tensorflow as tf
import numpy as np
from PIL import Image
from class_names import class_names

model = tf.keras.models.load_model('../model1.h5')

def load_image(image_path):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(150, 150))
    img = tf.keras.preprocessing.image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255
    return img

def predict_top_3_classes(image_path):
    img = load_image(image_path)
    predictions = model.predict(img)[0]
    top_3_indices = np.argsort(predictions)[-3:][::-1]
    return [(class_names[i], predictions[i]) for i in top_3_indices]