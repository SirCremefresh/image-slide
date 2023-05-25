import axios from "axios";

export async function uploadImage(
  collectionId: string,
  image: File,
  secret: string,
  setUploadProgress?: (value: number) => void
): Promise<string> {
  const formData = new FormData();
  formData.append("file", image);

  const res = await axios.post<{ imageId: string }>(
    `/api/collections/${collectionId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: secret,
        Accept: "application/json",
      },
      onUploadProgress: (progressEvent) => {
        const total = progressEvent.total ?? image.size;
        const progress = Math.round((progressEvent.loaded / total) * 100);
        setUploadProgress?.(progress);
      },
    }
  );
  return res.data.imageId;
}
