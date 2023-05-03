import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

export function Home() {
    const [collectionId, setCollectionId] = useState('');
    const navigate = useNavigate();

    const handleViewCollection = () => {
        navigate(`/view/${collectionId}`);
    };

    const handleCreateCollection = async () => {
        try {
            const response = await fetch('/api/collections/example', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            navigate(`/edit/${data.id}`);
        } catch (error) {
            console.error('Failed to create collection:', error);
        }
    };


    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Welcome</h1>
                    <div>
                        <label htmlFor="collectionId" className="block mb-2">Collection ID:</label>
                        <input
                            type="text"
                            id="collectionId"
                            placeholder="Enter collection ID"
                            value={collectionId}
                            onChange={(e) => setCollectionId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-4"
                            onClick={handleViewCollection}
                        >
                            View Collection
                        </button>
                    </div>
                    <div>
                        <p className="text-center mb-4">Or</p>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded block text-center w-full mb-4"
                            onClick={handleCreateCollection}
                        >
                            Create Collection
                        </button>
                    </div>
                    <div className={"pt-1"}>
                        <Link
                            to={"/view"}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded block text-center w-full">
                            Create Sample Collection
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
