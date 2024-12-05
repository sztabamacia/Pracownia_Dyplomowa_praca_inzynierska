import tensorflow as tf
import numpy as np
from PIL import Image
import class_names as cn

def load_model(model_path):
    model = tf.keras.models.load_model(model_path)
    return model

def load_image(image_path):
    img = tf.keras.preprocessing.image.load_img(image_path, target_size=(150, 150))
    img = tf.keras.preprocessing.image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255
    return img

def predict_top_3_classes(model, image_path, class_names):
    img = load_image(image_path)
    predictions = model.predict(img)[0]
    top_3_indices = np.argsort(predictions)[-3:][::-1]
    return [(class_names[i], predictions[i]) for i in top_3_indices]

print(predict_top_3_classes(load_model('model1.h5'), './dataset/Cetraria islandica/4024medium.jpeg', cn.class_names))
