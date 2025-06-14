import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleEnhance = async () => {
    if (!image) return;
    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      try {
        const response = await axios.post("/api/enhance", {
          image: reader.result,
        });
        setEnhancedImage(response.data.output);
      } catch (err) {
        alert("Enhancement failed.");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">AI Photo Enhancer</h1>
      <div className="max-w-xl mx-auto bg-white p-4 rounded-xl shadow-md space-y-4">
        <input type="file" onChange={handleImageChange} />
        {preview && (
          <div>
            <p className="text-sm font-semibold">Original Image:</p>
            <img src={preview} alt="original" className="rounded-md w-full" />
          </div>
        )}
        <button
          onClick={handleEnhance}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Enhancing..." : "Enhance Photo"}
        </button>
        {enhancedImage && (
          <div>
            <p className="text-sm font-semibold">Enhanced Image:</p>
            <img src={enhancedImage} alt="enhanced" className="rounded-md w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
