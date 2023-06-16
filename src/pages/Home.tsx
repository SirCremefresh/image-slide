import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CollectionCredentials } from "@common/models/collection.ts";

export function Home() {
  const [collectionId, setCollectionId] = useState("");
  const navigate = useNavigate();

  const handleViewCollection = () => {
    navigate(`/view/${collectionId}`);
  };

  const handleCreateCollection = async () => {
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: CollectionCredentials = await response.json();
      navigate(`/edit/${data.collectionId}/${data.secret}`);
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold">Welcome</h1>
          <div>
            <label htmlFor="collectionId" className="mb-2 block">
              Collection ID:
            </label>
            <input
              type="text"
              id="collectionId"
              placeholder="Enter collection ID"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 p-2"
            />
            <button
              className="mb-4 w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={handleViewCollection}
            >
              View Collection
            </button>
          </div>
          <div>
            <p className="mb-4 text-center">Or</p>
            <button
              className="mb-4 block w-full rounded bg-green-500 px-4 py-2 text-center font-bold text-white hover:bg-green-700"
              onClick={handleCreateCollection}
            >
              Create Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
