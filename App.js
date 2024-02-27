import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import { type } from "./node_modules/axios/index.d";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const apiUrl = "https://api.escuelajs.co/api/v1/files/upload";
  const [loading, setLoading] = useState(false);

  const uploadImage = async (image) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("file", {
      uri: image,
      name: "dummy.png",
      type: "image/jpg",
    });

    formData.append("name", "ROhit");

    try {
      const responce = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (responce?.status == "201") {
        setLoading(false);
        console.log("Image Upload Successfully");
      }
    } catch (error) {
      setLoading(false);
      console.log("API ERR: ", error);
    }
  };

  return (
    <View style={styles.continer}>
      <Image
        resizeMode="cover"
        source={
          selectedImage == null
            ? require("./assets/image/placeholder.png")
            : { uri: selectedImage }
        }
        style={styles.image}
      />
      {/* Camera */}
      <TouchableOpacity
        onPress={() => {
          launchCamera(
            {
              mediaType: "photo",
              includeBase64: false,
              maxHeight: 2000,
              maxWidth: 2000,
            },
            (response) => {
              if (response.didCancel) {
              } else if (response.error) {
                console.log("Camera Error: ", response.error);
              } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                uploadImage(imageUri);
              }
            }
          );
        }}
        style={styles.button}
      >
        <Text style={styles.text}>Open Camera</Text>
      </TouchableOpacity>
      {/* Gallery */}
      <TouchableOpacity
        onPress={() => {
          launchImageLibrary(
            {
              mediaType: "photo",
              includeBase64: false,
              maxHeight: 2000,
              maxWidth: 2000,
            },
            (response) => {
              if (response.didCancel) {
                console.log("User cancelled image picker");
              } else if (response.error) {
                console.log("Image picker error: ", response.error);
              } else {
                let imageUri = response.uri || response.assets?.[0]?.uri;
                setSelectedImage(imageUri);
                uploadImage(imageUri);
              }
            }
          );
        }}
        style={[styles.button, { marginTop: 10 }]}
      >
        <Text style={styles.text}>Open Gallery</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size={"large"} style={styles.loading} />}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "grey",
  },
  button: {
    backgroundColor: "black",
    height: 45,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    borderRadius: 5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
  loading: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00000099",
  },
});
